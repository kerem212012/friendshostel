import {Room as RoomType, RoomsResponse, roomTitle} from "@/app/common/rooms/types";
import {SeoType} from "@/app/libs/seo/types";

const CITY_POSTFIX = 'in Kutaisi, Georgia'

export const buildSeoRoom = (room: RoomType): SeoType => {
    let seo = room.seo
    if (!seo) {
        const name = room.data.international_name.en || `Rent room`
        const description = room.data.international_name.en || `Rent room`
        seo = {
            metaTitle: `${roomTitle(room)}`,
            metaDescription: `${description} — ${CITY_POSTFIX}`,
        }
    }

    return {
        metaTitle: `${seo.metaTitle} — ${CITY_POSTFIX}`,
        metaDescription: `${seo.metaDescription} — ${CITY_POSTFIX}`,
    }
}