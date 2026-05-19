/**
 * book router
 */

import { Core, factories } from '@strapi/strapi';

const config: Core.RouterConfig = {
    type: 'content-api',
    routes: [

        {
            method: 'POST',
            path: '/books/check-unpaid',
            handler: 'book.checkUnpaid',
            config: {
                auth: false,
            },
        },

        { method: 'GET', path: '/books', handler: 'book.find' },
        { method: 'GET', path: '/books/:id', handler: 'book.findOne' },
        // { method: 'POST', path: '/books', handler: 'book.create' },
        // { method: 'PUT', path: '/books/:id', handler: 'book.update' },
        // { method: 'DELETE', path: '/books/:id', handler: 'book.delete' },

    ]
}

export default config
