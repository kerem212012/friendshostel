import {createBrowser} from "./browser";
import {login} from "./sync/session";
import {parseRooms, parseRoomsInfo} from "./sync/rooms";
import {type RoomItem, SyncData} from "./types";
import {BookReserveInput} from "./book/types";
import {parseFirstPrices} from "./price/availability";
import {bookRoom} from "./book/book";

let isStartedFullSync = false

export const syncBooking = async (inp: BookReserveInput) => {
    const browser = await createBrowser();

    try {
        const context = await login(browser);

        const bookRes = await bookRoom(context, inp)
        console.log("Reservation ID:", bookRes);

        return bookRes
    } catch (e) {

    } finally {
        await browser.close();
    }
}

export const syncOtelMs = async (): Promise<SyncData> => {
    const browser = await createBrowser();

    try {

        const context = await login(browser);

        let rooms = await parseRooms(context);

        // rooms = await parseRoomsPhotos(context, rooms, "parallel")
        rooms = await parseRoomsInfo(context, rooms, "parallel")
        rooms = await parseFirstPrices(context, rooms)

        return {rooms}
    } catch (err) {
        console.error("❌ Ошибка при сихронизации с OtemMS:", err);

        return {
            rooms: []
        }
    } finally {
        await browser.close();
        isStartedFullSync = false
    }
}

