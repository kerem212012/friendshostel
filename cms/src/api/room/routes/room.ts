/**
 * room router
 */

import { Core, factories } from '@strapi/strapi';

const config: Core.RouterConfig = {
    type: 'content-api',
    routes: [

        {
            method: 'POST',
            path: '/rooms/sync',
            handler: 'room.syncOtelMs',
            config: {
                auth: false,
            },
        },

        { method: 'GET', path: '/rooms', handler: 'room.find' },
        { method: 'GET', path: '/rooms/:id', handler: 'room.findOne' },
        { method: 'DELETE', path: '/rooms/:id', handler: 'room.delete' },
        // { method: 'POST', path: '/rooms', handler: 'room.create' },
        // { method: 'PUT', path: '/rooms/:id', handler: 'room.update' },

    ]
}

export default config
