import {Room as RoomType, RoomsResponse} from "@/app/common/rooms/types";
import {apiUrl} from "../../config";
import {buildQuery} from "@/app/common/http/query";

export interface SearchRoomFilter {
    from: string
    to: string
}

export interface SearchOptions {
    host?: string,
    filter?: SearchRoomFilter
}

export async function checkRoomsAvailable(options?: SearchOptions): Promise<number[]> {
    return []
}


export async function getAllRooms(options?: SearchOptions): Promise<RoomType[]> {
    try {
        const queryParams = {
            populate: {
                photos: {
                    populate: "*",
                },
            },
            filters: {
                isActive: true,
            }
        };

        const host = options?.host || apiUrl()
        const res = await fetch(`${host}/rooms?${buildQuery(queryParams)}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return [];
        }

        const data: RoomsResponse = await res.json();

        let rr = data.data;

        return rr
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
}

export async function getRoomById(id: string): Promise<RoomType | null> {

    const queryParams = {
        populate: {
            photos: {
                populate: "*",
            },
        },
        filters: {
            isActive: true,
        }
    };

    try {
        const res = await fetch(`${apiUrl()}/rooms?${buildQuery(queryParams)}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return null;
        }

        const data: RoomsResponse = await res.json();
        const room = data.data.find((room) => room.documentId === id);

        return room || null;
    } catch (error) {
        console.error("Error fetching room:", error);
        return null;
    }
}