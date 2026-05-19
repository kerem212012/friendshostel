import type {Data} from "@strapi/strapi";
import {RoomItem} from "../../otelms/types";

export type RoomModelUIDType = 'api::room.room';

export const RoomModelUID: RoomModelUIDType = 'api::room.room'

export type RoomEntry = Data.ContentType<RoomModelUIDType>;

