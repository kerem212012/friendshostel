/**
 * room service
 */

import {factories} from '@strapi/strapi';
import {syncOtelMs} from "../../../otelms";
import {RoomEntry, RoomModelUID} from "../types";

export default factories.createCoreService(RoomModelUID, ({strapi}) => ({
    async mainSynchronization() {

        console.log("start sync")
        {
            // ------------------------
            // Sync Rooms
            // ------------------------

            try {
                const existsRooms: RoomEntry[] = await strapi.db.query(RoomModelUID).findMany({
                   where: {
                       externalID: {
                           $notNull: true,
                       },
                       publishedAt: {
                           $notNull: true,
                       },
                   }
                });

                const existsRoomsByExternalId = new Map<string, RoomEntry[]>
                existsRooms.forEach(r => {
                    if (!existsRoomsByExternalId.get(r.externalID)) {
                        existsRoomsByExternalId.set(r.externalID, [])
                    }

                    const gr = existsRoomsByExternalId.get(r.externalID)
                    gr.push(r)
                })

                const syncData = await syncOtelMs()
                const msRooms = syncData.rooms;

                for (const or of msRooms) {
                    const externalID = String(or.id);
                    const exists = existsRoomsByExternalId.get(externalID);

                    // -------- CREATE --------
                    if (!exists || exists.length === 0) {
                        await strapi.entityService.create(RoomModelUID, {
                            data: {
                                title: or.name,
                                siteTitle: or.name,
                                data: or.data,
                                externalID,
                                isActive: true,
                                basePrices: or.defaultPrices || [],
                                prices: Object.fromEntries(or.prices || new Map),
                                publishedAt: new Date(),
                            },
                            publicationState: 'live',
                        });

                        continue;
                    }

                    // -------- UPDATE --------
                    const room = exists[0];
                    await strapi.entityService.update(RoomModelUID, room.id, {
                        data: {
                            title: or.name,
                            siteTitle: room.siteTitle ||  or.name,
                            data: or.data,
                            isActive: true,
                            basePrices: or.defaultPrices || [],
                            prices: Object.fromEntries(or.prices || new Map),
                            publishedAt: new Date(),
                        },
                        publicationState: 'live',
                    });

                }
            } catch (e) {
                console.log("Failed rooms sync", e);
            } finally {
                console.log("sync is finished")
            }
        }
    },
}));

