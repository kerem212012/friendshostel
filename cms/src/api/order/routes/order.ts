/**
 * order router
 */


export default {
    routes: [
        {
            method: 'POST',
            path: '/orders/create-order',
            handler: 'order.createMultiBooking',
        },

        {
            method: 'GET',
            path: '/orders',
            handler: 'order.find',
        },

        {
            method: 'GET',
            path: '/orders/:id',
            handler: 'order.findOne',
        },
    ],
};
