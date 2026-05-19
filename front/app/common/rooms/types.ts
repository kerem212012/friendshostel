import {SeoType} from "@/app/libs/seo/types";
import {MediaItem} from "@/app/common/media/uploads";
import {SearchRoomFilter} from "@/app/common/rooms/service";
import type {DateValue} from "@internationalized/date";
import type {RangeValue} from "@react-types/shared";

export interface RoomData {
    id: string;
    size: string;
    order: string;
    gender: string;
    places: string;
    bedrooms: string;
    bathrooms: string;
    is_active: boolean;
    shortname: string;
    size_type: string;
    base_price: string;
    property_id: string;
    web_booking: boolean;
    room_type_id: string;
    room_location: string;
    is_coomon_room: boolean;
    international_name: {
        en: string;
        ru: string;
    };
    international_comment: {
        en: string;
        ru: string;
    };
}

export interface RoomPlace {
    date: string
    value: number
}

export interface RoomPrice {
    id: number,
    name: "breakfast" | "without_breakfast",
    value: number
}

export interface PlaceDatum {
    dayId: number
    date: string
    count: number
    prices: RoomPrice[]
}

export interface Room {
    id: number;
    documentId: string;
    title: string;
    siteTitle: string;
    isActive: boolean;
    data: RoomData;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    seo: SeoType | null
    photos: MediaItem[] | null
    basePrices: RoomPrice[]
    prices: Record<string, PlaceDatum>

    intervalPrices?: (RoomPrice & {count: number})[]
}

export interface SelectPlace {
    key: string,
    label: string
}

export const roomBasePrice = (r: Room, withBreakfast: boolean = false): number => {
    const base = r.basePrices.find(price => {
        return withBreakfast ? price.name === "breakfast" : price.name === "without_breakfast"
    });

    return base?.value || 0
}

function getAveragePrice(
    r: Room,
    data: Record<string, PlaceDatum>,
    from: string,
    to: string,
    withBreakfast: boolean
): number {
    const current = new Date(from)
    const end = new Date(to)

    let total = 0
    let days = 0

    const priceName = withBreakfast ? "breakfast" : "without_breakfast"

    while (current < end) {
        const key = current.toISOString().slice(0, 10)
        const day = data[key]

        if (!day) {
            return roomBasePrice(r, withBreakfast)
        }

        const price = day.prices.find(p => p.name === priceName)
        if (!price) {
            return roomBasePrice(r, withBreakfast)
        }

        total += price.value
        days++

        current.setDate(current.getDate() + 1)
    }

    return days === 0 ? 0 : total / days
}

export const roomPrice = (r: Room, dateRange: RangeValue<DateValue> | null = null, withBreakfast: boolean = false): number => {
    if (!dateRange) {
        return Math.ceil(roomBasePrice(r, withBreakfast))
    }

    const from = dateRange.start.toString();
    const to = dateRange.end.toString();

    return Math.ceil(getAveragePrice(r, r.prices, from, to, withBreakfast))
}

function getAvailableCount(
    data: Record<string, PlaceDatum>,
    from: string,
    to: string
): number {
    const current = new Date(from)
    const end = new Date(to)

    let minCount = Infinity

    while (current < end) {
        const key = current.toISOString().slice(0, 10)
        const day = data[key]

        if (!day || day.count <= 0) {
            return 0
        }

        minCount = Math.min(minCount, day.count)
        current.setDate(current.getDate() + 1)
    }

    return minCount === Infinity ? 0 : minCount
}

export const generatePlaces = (r: Room, dateRange: RangeValue<DateValue> | null, withBreakfast: boolean = false): SelectPlace[] => {
    if (!dateRange) {
        return []
    }

    const from = dateRange.start.toString();
    const to = dateRange.end.toString();

    const availableCount = getAvailableCount(r.prices, from, to);

    return Array.from({ length: availableCount }, (_, i) => {
        const value = i + 1;
        return {
            key: String(value),
            label: `${value} ${value === 1 ? 'item' : 'items'}`,
        };
    });
}

export const filterRooms = (allRooms: Room[], filter: SearchRoomFilter | undefined): Room[] => {
    if (!filter) {
        return allRooms
    }

    // todo::
    return []
}

export const roomTitle = (room: Room): string => {
    return  room.siteTitle || room.title
}

export interface RoomsResponse {
    data: Room[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface RoomParams {
    params: Promise<{
        id: string;
    }>;
}