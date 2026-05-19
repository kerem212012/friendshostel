/**
 * book controller
 */

import {factories} from '@strapi/strapi'

export default factories.createCoreController(
    'api::book.book',
    ({ strapi }) => ({
        async checkUnpaid(ctx) {
            const token: string = strapi.config.get('server.internal.apiKey');
            const authHeader = ctx.request.header.authorization || '';
            const bearerToken = authHeader.startsWith('Bearer ')
                ? authHeader.slice(7) // убираем "Bearer "
                : null;

            if (!token) {
                return ctx.unauthorized('API Token не настроен!');
            }
            if (!bearerToken) {
                return ctx.unauthorized('API Token не предоставлен!');
            }
            if (bearerToken !== token) {
                return ctx.unauthorized('API Token не корректный!');
            }

            try {
                const result = await strapi.service('api::book.book').checkUnpaidBooks()
                ctx.body = {
                    status: 'success',
                    message: 'Check unpaid books process completed',
                    data: result,
                };
            } catch (error) {
                ctx.status = 500;
                ctx.body = {
                    status: 'error',
                    message: 'Failed to check unpaid books',
                    error: error.message || error,
                };

                ctx.status = 500;
                ctx.body = {
                    status: 'error',
                    message: 'Failed to check unpaid books',
                    error: error.message || error,
                };
            }
        },
    })
);