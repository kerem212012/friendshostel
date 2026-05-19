import { chromium, Browser } from 'playwright';
import config from "./config.js";

let instance: Browser | null = null;

export async function createBrowser(): Promise<Browser | null> {
    if (instance?.isConnected()) {
        return instance;
    }

    try {
        instance = await chromium.launch({
            headless: config.headless ?? true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ],
        });

        instance.on('disconnected', () => {
            instance = null;
        });

        return instance;
    } catch (err) {
        console.error('[Playwright] Failed to launch browser', err);
        instance = null;
        return null;
    }
}
