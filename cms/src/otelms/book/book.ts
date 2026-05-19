import type {BrowserContext} from "playwright";
import config from "../config.js";
import {BookReserveInput} from "./types";
import * as cheerio from "cheerio";


export async function removeReservation(context: BrowserContext, resId: number, reason: string = "not paid") {
    const page = await context.newPage()

    await page.request.post(`${config.otelMs.url}/reservationcancel/SaveCancel/2`, {
        form: {
            res_id: resId,
            charge: "",
            status: 5,
            description: reason,
        },
    });
}

export async function bookRoom(context: BrowserContext, inp: BookReserveInput): Promise<string | null> {
    const page = await context.newPage()

    const form = new FormData();
    {
        const from = inp.dateinId
        const to = inp.dateoutId

        const count = to - from; // количество дней

        for (let i = 0; i < count; i++) {
            form.append(`reservations[${i}][room_id]`, '0');
            form.append(`reservations[${i}][day_id]`, String(from + i));
            form.append(`reservations[${i}][category_id]`, String(inp.room_id));
        }
    }

    const reserveModal = await page.request.post(`${config.otelMs.url}/reservations/build_fastorder_modal`, {
        form
    })

    const modalText = await reserveModal.text();
    const $ = cheerio.load(modalText);
    const roomId = String($('#group_form input[name="room_id"]').val());

    const fullCost = Number($('#fullcost').val());
    if (Math.abs(fullCost - inp.service_main_amount) > 0.1 ) {
        console.log('Цена сильно отличается, берем бОльшую')
    }

    const response = await page.request.post(`${config.otelMs.url}/reservations/save_modal`, {
        form: {
            // проверить response — room's id
            room_id: roomId,
            response: roomId,

            // даты
            datein: inp.datein,
            dateout: inp.dateout,
            date: inp.date,
            duration: inp.duration,

            //
            phone: inp.phone,
            email: inp.email,
            firstname: inp.firstname,
            lastname: inp.lastname,
            middlename: inp.middlename,
            description: inp.description,
            adults: inp.adults,

            //
            price_type: inp.price_type,
            service_main_amount: Math.max(fullCost, inp.service_main_amount),

            // кастомное описание
            intgroupid: "website",
            // id источника данных "модуль бронирования"
            dealer: 10,
            // Макс Федороф
            user: config.otelMs.userID,

            marker: 2, //6-orange, 6-blue


            // count

            hms_id: 0,
            insert_or_update_guest_id: 0,
            is_guest: 1,
            checkintime: "12:00",
            checkouttime: "12:00",
            baby_places: 0,
            babyplace2: 0,
            addbedplace: 0,
            service_main_amount_2: 0,
            tourtax: 0,
            percent_discount: 0,
            discount: 0,
            avoidtime_days: "",
            avoidtime_hours: "",
            avoidtime_minutes: "",
            cardnumber: "",
            exp_date: "",
            cardholder: "",

            cvc: ""
        },
    });

    // console.log("Status:", response.status());
    const text = await response.text();
    // console.log("Response:", text);

    const json = JSON.parse(text);

    const html = json.htmldiv;

    const match = html.match(/resid="(\d+)"/);
    return match ? match[1] : null
}
