import {BookEntry} from "../../types";
import {syncBooking} from "../../../../otelms";
import {BookReserveInput} from "../../../../otelms/book/types";
import {calculateNights, formatDate, formatDateInterval, getDayIdTz} from "../../../../otelms/utils/date";
import {resolvePriceType} from "../../../../otelms/utils/priceType";

export default {
    async afterCreate(event: any) {
        const { result: resultBook } = event;

        if (!resultBook.publishedAt) {
            return
        }

        const book: BookEntry = await strapi.entityService.findOne(
            'api::book.book',
            resultBook.id,
            {
                populate: ['room'],
            }
        );

        const from = new Date(book.from.toString())
        const to = new Date(book.to.toString())

        const req: BookReserveInput = {
            room_id: Number(book.room.externalID),
            datein: formatDate(from),
            dateinId: getDayIdTz(from),
            dateout: formatDate(to),
            dateoutId: getDayIdTz(to),
            date: formatDateInterval(from, to),

            // @ts-ignore
            duration: calculateNights(from, to),

            phone: book.phone,
            email: book.email,
            firstname: book.firstname,
            lastname: book.lastname,
            middlename: "",
            description: book.message,
            price_type: resolvePriceType(book.priceType),
            service_main_amount: 120,
            adults: book.adults,
        }

        console.log("Request", req, {...book, prices: '__replaced__', data: '__replaced__'})

        await syncBooking(req)
        // todo:: сохранить resid в booking в externalId
    },

}