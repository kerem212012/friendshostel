const envNumber = (env: string, defaultValue: number) => (process.env[env] ? parseInt(process.env[env]) : defaultValue);
const envString = (env: string, defaultValue: string) => (process.env[env] ? process.env[env] : defaultValue);
const envBoolean = (env: string, defaultValue: boolean) => (process.env[env] ? process.env[env] === "true" : defaultValue);

const required =
    <T>(fmt: (env: string, defaultValue?: any) => T | undefined) =>
        (env, ...args): T => {
            if (!process.env[env]) throw new Error(`${env} is required`);
            return fmt(env, ...args) as T;
        };

export default {
    logLevel: envString("LOG_LEVEL", "info") as "error" | "warn" | "info" | "debug" | "trace",


    headless: envBoolean("HEADLESS", false),

    otelMs: {
        hotel: required(envString)("OTEMLMS_HOTEL"),
        url: required(envString)("OTEMLMS_URL"),
        login: required(envString)("OTEMLMS_LOGIN"),
        password: required(envString)("OTEMLMS_PASSWORD"),
        userID: required(envNumber)("OTEMLMS_USER_ID"),
    },

};
