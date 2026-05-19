
export type RoomData = Record<string, any>

export type PriceName = "breakfast" | "without_breakfast"

export const PriceNameBreakfast: PriceName = "breakfast"
export const PriceNameWithoutBreakfast: PriceName = "without_breakfast"

export type Price = {
    id: number
    name: PriceName
    value: number
    date: string
    count: number
}

export interface PlaceDatum {
    dayId: number
    date: string
    count: number
    prices: Price[]
}

export type RoomItem = {
    id: number,
    sort: number,
    name: string,
    shortName: string,
    data?: RoomData,
    photoUrls?: string[],
    defaultPrices?: Price[]
    prices?: Map<string, PlaceDatum>
}

export type SyncData = {
    rooms: RoomItem[]
}

export const PUBLIC_SNAP_PATH = 'public/screens'