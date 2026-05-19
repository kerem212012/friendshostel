// path: src/api/room/controllers/room.ts (или .js)
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::room.room', ({ strapi }) => ({

    async syncOtelMs(ctx) {
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

        await strapi.service('api::room.room').mainSynchronization();
        ctx.body = { message: 'ОК' };
    },

    async find(ctx) {
        return await super.find(ctx);
    },

    async findOne(ctx) {
        return await super.findOne(ctx);
    },

    async create(ctx) {
        return await super.create(ctx);
    },

    async update(ctx) {
        return await super.update(ctx);
    },

    async delete(ctx) {
        return await super.delete(ctx);
    },

}));
