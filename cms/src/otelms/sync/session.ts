import {type Browser} from "playwright";
import config from "../config.js";
import {loginPage} from "../pages.js";
import fs from "fs";
import {createSnap} from "../utils/page";

export async function login(browser: Browser) {
    if (isActiveSession()) {
        console.log("Used old data, login is skipped")

        return await browser.newContext({
            storageState: "storageState.json",
        })
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Start login in Otem MS")

    await page.goto(loginPage, {
        waitUntil: "domcontentloaded",
    });

    await page.fill('input[name="hotel"]', config.otelMs.hotel);
    await page.fill('input[name="login"]', config.otelMs.login);
    await page.fill('input[name="password"]', config.otelMs.password);

    {
        await createSnap(page, 'login page', 'before_login')
    }

    await Promise.all([
        page.waitForURL("**/reservation_c2/calendar"),
        page.click('input[type="submit"]'),
    ]);

    {
        await createSnap(page, 'after login', 'after_login')
        console.log("URL after login:", page.url());
    }

    await context.storageState({ path: "storageState.json" });

    return context
}

export const isActiveSession = () => {
    return false

    try {
        const state = JSON.parse(fs.readFileSync("storageState.json", "utf8"));

        const now = Date.now() / 1000 - 60;
        return !!state.cookies && state.cookies.some((cookie: any) => {
            return (
                cookie.name === "ci_session" && !!cookie.expires && cookie.expires > now
            );
        })
    } catch (e) {
        return false
    }
}
