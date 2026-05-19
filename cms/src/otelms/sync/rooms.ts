import {type BrowserContext} from "playwright";
import * as cheerio from "cheerio";
import type {RoomData, RoomItem} from "../types.js";
import {roomsEditPage, roomsEditPhotoPage, roomsListPage} from "../pages.js";
import {createSnap} from "../utils/page";

export async function parseRooms(context: BrowserContext): Promise<RoomItem[]> {
    console.log(`📸 Загружаю номера...`);

    const page = await context.newPage()

    await page.goto(roomsListPage, {
        waitUntil: "domcontentloaded" ,
    });

    try {
        await page.waitForSelector('table.table tbody tr');
    } catch (err) {
        await createSnap(page, 'Failed parse rooms', 'rooms')
        throw err
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    return $('table.table tbody tr')
        .filter((_, row) => {
            const input = $(row).find('input[name^="web_booking["]');
            return input.length > 0 && input.is(':checked');
        })
        .map((_, row) => {
            const cols = $(row).find('td');
            return {
                id: Number($(cols[1]).text().trim()),
                name: $(cols[3]).text().trim(),
                shortName: $(cols[4]).text().trim(),
                sort: Number($(cols[5]).text().trim()),
            } as RoomItem;
        })
        .get();
}


export async function parseRoomsInfo(
    context: BrowserContext,
    rooms: RoomItem[],
    mode: "sequential" | "parallel" = "sequential"
): Promise<RoomItem[]> {
    console.log(`🔍 Загружаю инфу о номерах ...`);

    // последовательно в одной вкладке — все запросы параллельно
    if (mode === "sequential") {
        const results: RoomItem[] = [];
        for (const room of rooms) {
            results.push({
                ...room,
                data: await parseSingleRoomsInfo(context, room.id),
            });
        }
        return results;
    }

    // асинхронно — все запросы параллельно
    return await Promise.all(
        rooms.map(async (room) => ({
            ...room,
            data: await parseSingleRoomsInfo(context, room.id),
        }))
    );
}

export async function parseRoomsPhotos(
    context: BrowserContext,
    rooms: RoomItem[],
    mode: "sequential" | "parallel" = "sequential"
): Promise<RoomItem[]> {
    console.log(`📸 Загружаю картинки для номеров...`);

    // последовательно в одной вкладке — все запросы параллельно
    if (mode === "sequential") {
        const results: RoomItem[] = [];
        for (const room of rooms) {
            results.push({
                ...room,
                photoUrls: await parseSingleRoomPhotos(context, room.id),
            });
        }
        return results;
    }

    // асинхронно — все запросы параллельно
    return await Promise.all(
        rooms.map(async (room) => ({
            ...room,
            photoUrls: await parseSingleRoomPhotos(context, room.id),
        }))
    );
}

async function parseSingleRoomPhotos(
    context: BrowserContext,
    id: number
) {
    const page = await context.newPage();

    try {
        await page.goto(roomsEditPhotoPage(id), {
            waitUntil: "domcontentloaded" ,
            timeout: 5000
        });

        await page.waitForSelector("form#frmData", {timeout: 15000});

        const html = await page.content();
        const $ = cheerio.load(html);

        return $('a[target="_blank"][href*="media-data-storage"]')
            .map((_, a) => $(a).attr("href"))
            .get()
            .filter((href): href is string => !!href && href.startsWith("https"))

    } catch (e) {
        console.error(`❌ Ошибка при парсинге ID=${id}:`, e);
        return []
    }
}


export async function parseSingleRoomsInfo(
    context: BrowserContext,
    id: number
) {
    const page = await context.newPage();

    const editUrl = roomsEditPage(id);

    await page.goto(editUrl, {
        waitUntil: "domcontentloaded" ,
    });
    const html = await page.content();
    const $ = cheerio.load(html);

    const data: RoomData = {};

    // 1️⃣ Все input
    $('input').each((_, el) => {
        const name = $(el).attr('name');
        if (!name) return;

        const type = $(el).attr('type') || 'text';
        let value: string | number | boolean | null = $(el).val() as string;

        if (type === 'checkbox') {
            value = $(el).is(':checked');
        } else if (type === 'number' || name.match(/_id$/)) {
            const num = Number(value);
            if (!isNaN(num)) value = num;
        }

        data[name] = value;
    });

    // 2️⃣ Все textarea
    $('textarea').each((_, el) => {
        const name = $(el).attr('name');
        if (!name) return;
        const value = $(el).val() as string;
        data[name] = value;
    });

    // 3️⃣ Все select
    $('select').each((_, el) => {
        const name = $(el).attr('name');
        if (!name) return;
        const value = $(el).find('option:selected').val();
        data[name] = value;
    });

    await page.close();

    const transformLangFields = (prefix: string) => {
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(data)) {
            const match = key.match(new RegExp(`^${prefix}\\[(\\d+)\\]$`));
            if (match) {
                const langId = match[1];
                if (langId === "570") result.ru = value as string;
                else if (langId === "45") result.en = value as string;
                delete data[key];
            }
        }
        if (Object.keys(result).length > 0) data[prefix] = result;
    };

    transformLangFields("international_comment");
    transformLangFields("international_name");

    return data
}
