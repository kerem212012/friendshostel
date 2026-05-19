export default ({env}) => ({
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
        keys: env.array('APP_KEYS'),
    },

    otelMs: {
        userId: env.int('OTEMLMS_USER_ID', 0),
        ttlReservationMin: 8,
    },

    internal: {
        apiKey: env('API_SERVICE_TOKEN', 'secret'),
    },

    watchIgnoreFiles: [
        './storageState.json',
    ]
});
