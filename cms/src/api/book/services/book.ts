import {factories} from '@strapi/strapi';
import {BookEntry, BookModelUID} from '../types';
import {BookingRequestPayloadWithUser} from "../../order/types";

let isStartedRemoveOldReserves = false

export default factories.createCoreService(BookModelUID, ({strapi}) => ({
    async createBooks(input: BookingRequestPayloadWithUser): Promise<any[]> {
        const createdBookIds: any[] = []

        const { items, dateRange, user } = input

        if (!dateRange) {
            throw new Error('dateRange is required')
        }

        const [firstname, lastname = ''] = user.name.split(' ')

        for (const item of items) {
            const priceType = item.withBreakfast
                ? 'breakfast'
                : 'without_breakfast'

            const book = await strapi.entityService.create(
                BookModelUID,
                {
                    data: {
                        firstname,
                        lastname,
                        email: user.email,
                        phone: user.phone,

                        from: dateRange.start,
                        to: dateRange.end,

                        priceType,
                        adults: item.quantity,

                        room: item.documentId,
                        message: user.comment,

                        isPaid: false,
                        isCancelReserve: false,

                        publishedAt: new Date(),
                    },
                }
            )

            createdBookIds.push(book.id)
        }

        return createdBookIds
    },

    async checkUnpaidBooks() {
        try {
            if (isStartedRemoveOldReserves) {
                return
            }

            isStartedRemoveOldReserves = true

            const ttlReservationMin: number = strapi.config.get('server.otelMs.ttlReservationMin');
            const createdTime = new Date(Date.now() - ttlReservationMin * 60 * 1000);

            const unpaidBooks: BookEntry[] = await strapi.db.query(BookModelUID).findMany({
                where: {
                    isPaid: false,
                    isCancelReserve: false,

                    externalReserveID: {
                        $notNull: true,
                    },

                    createdAt: {
                        $lt: createdTime,
                    },
                },
            });

            if (!unpaidBooks.length || unpaidBooks.length < 1) {
                strapi.log.info(`Нет неоплаченных бронирований старше ${ttlReservationMin} минут`);
                return
            }

            strapi.log.info(
                `Найдено ${unpaidBooks.length} неоплаченных бронирований старше 10 минут`,
            );

            for (const b of unpaidBooks) {
                await (async () => {
                    // TODO:: удаляем резерв
                })


                await strapi.entityService.update(BookModelUID, b.id, {
                    data: {
                        isCancelReserve: true,
                        publishedAt: new Date(),
                    },
                    publicationState: 'live', // сохраняем публикацию
                });
            }


            // если нужно — вызвать removeNotPaid()
            // await strapi.service('api::book.book').removeNotPaid();

        } catch (error) {
            console.log("Ошибка проверки неоплаченных заказов", error)
            // throw new Error("fdjfjnd njfdnj fndnfj ")
        } finally {
            isStartedRemoveOldReserves = false
            return
        }
    },

}));
