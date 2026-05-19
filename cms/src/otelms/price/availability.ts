import type {BrowserContext} from "playwright";
import {priceCalendar} from "../pages";
import {Price, PriceName, PriceNameBreakfast, PriceNameWithoutBreakfast, RoomItem, PlaceDatum} from "../types";
import * as cheerio from "cheerio";
import {CheerioAPI} from "cheerio";
import {PRICE_TYPE_BREAKFAST, PRICE_TYPE_WITHOUT_BREAKFAST} from "./types";
import {formatDate, getDateFromDayIdTz, getDayIdTz} from "../utils/date";

function initDefaultPriceDatum(dayIdAttr: number) {
    return {
        dayId: dayIdAttr,
        date: formatDate(getDateFromDayIdTz(dayIdAttr)),
        count: 0,
        prices: [],
    };
}

async function enrichPrices(rooms: RoomItem[], $: CheerioAPI, dayId: number) {
    console.log("sync prices for rooms", rooms.map(r => r.id))
    console.log("today:", formatDate(new Date()), new Date().toString(), dayId)

    rooms.forEach(room => {
        // Find TD elements for this room (matching category_id and date)
        const roomPriceCells = $(`td[category_id="${room.id}"]`);

        // Extract data for both rate types
        const defaultPrices: Price[] = [];
        const placesMap = new Map<string, PlaceDatum>

        roomPriceCells.each((_, element) => {
            const $el = $(element);

            {
                const rateId = parseInt($el.attr('rate_id') || '0');
                const dayIdAttr = parseInt($el.attr('date')) || '';



                const priceText =  (sel: string) => {
                    return  $el.find(sel).text().trim()
                }
                const priceValue = parseInt(priceText('.yield_price')) || parseInt(priceText('.wrapper_calendar_price'));
                let price: Price | null = null;

                if (dayIdAttr && !isNaN(priceValue)) {

                    const dateStr = formatDate(getDateFromDayIdTz(dayIdAttr))

                    // Determine the price name based on rate type
                    let priceName = '';
                    if (rateId === PRICE_TYPE_WITHOUT_BREAKFAST) {
                        priceName = PriceNameWithoutBreakfast
                    } else if (rateId === PRICE_TYPE_BREAKFAST) {
                        priceName = PriceNameBreakfast
                    }

                    // Add price if we found a valid rate
                    if (priceName) {
                        price = {
                            date: formatDate(getDateFromDayIdTz(dayIdAttr)),
                            id: rateId,
                            name: priceName as PriceName,
                            value: priceValue,
                            count: 0,
                        };
                    }

                    let isFirstDay = Number(dayIdAttr) === Number(dayId);

                    if (!!price) {
                        if (isFirstDay) {
                            defaultPrices.push(price);
                        }

                        let existsDatum = placesMap.get(dateStr)
                        if (!existsDatum) {
                            existsDatum = initDefaultPriceDatum(dayIdAttr)
                            placesMap.set(dateStr, existsDatum)
                        }

                        existsDatum.prices.push(price);
                    }
                }
            }

            {
                const availabilityText = $el.find('.calendar_sum').text().trim();
                const availabilityValue = parseInt(availabilityText);
                const dayIdAttr2 = parseInt($el.attr('day_id')) || '';

                if (dayIdAttr2 && !isNaN(availabilityValue)) {

                    const dateStr = formatDate(getDateFromDayIdTz(dayIdAttr2))

                    let existsDatum = placesMap.get(dateStr)
                    if (!existsDatum) {
                        existsDatum = initDefaultPriceDatum(dayIdAttr2)
                        placesMap.set(dateStr, existsDatum)
                    }

                    existsDatum.count = availabilityValue
                }
            }
        });

        room.defaultPrices = defaultPrices;
        room.prices = placesMap;
    });
}

export async function parseFirstPrices(
    context: BrowserContext,
    rooms: RoomItem[],
): Promise<any> {
    const page = await context.newPage();

    const roomsIds = rooms.map(r => {
        return String(r.id)
    })


    const form = new FormData();
    form.append('bool', '1');
    form.append('date_shift', '0');
    form.append('month_shift', '0');
    form.append('today', '0');
    roomsIds.forEach(id => {
        form.append('categories[]', id.toString())
    });

    [String(PRICE_TYPE_WITHOUT_BREAKFAST), String(PRICE_TYPE_BREAKFAST)].forEach(id => form.append('reservations_rates[]', id.toString()));

    const response = await page.request.post(priceCalendar, {form});
    const text = await response.text();

    const $ = cheerio.load(text);
    const dayId = getDayIdTz(new Date()) // e.g. 20448

    await enrichPrices(rooms, $, dayId);

    // await enrichPlaces(rooms, $, dayId);

    return rooms;
}
