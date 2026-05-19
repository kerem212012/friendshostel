/**
 * order controller
 */

import {factories} from '@strapi/strapi';

export default factories.createCoreController(
    'api::order.order',
    ({strapi}) => ({
        async createMultiBooking(ctx) {
            // todo:: validate ctx.request.body
            // todo:: validate price

            // 1. Создаём книги
            const booksIds = await strapi
                .service('api::book.book')
                .createBooks(ctx.request.body);

            // 2. Формируем массив для one-to-many
            const booksRelation = booksIds.map(id => ({ id }));

            // 3. Создаём order с привязкой к книгам
            return await strapi.entityService.create(
                'api::order.order',
                {
                    data: {
                        books: booksRelation,
                    },
                    populate: ['books'],
                }
            );
        },
    })
);
