import {Room} from "@/app/common/rooms/types";

export interface DateRangePayload {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
}

export interface BookingItemPayload {
    documentId: Room["documentId"];
    quantity: number;
    withBreakfast: boolean;
}

export interface BookingUser {
    name: string
    email: string
}

export interface BookingRequestPayload {
    items: BookingItemPayload[];
    dateRange: DateRangePayload | null;
    guestsCount: number;
    totalPrice: number;
}


export type BookingRequestPayloadWithUser = BookingRequestPayload & {
    user: {
        name: string
        email: string
        emailConfirm: string
        phone: string
        address: string
        comment: string
    }
}