import {Page} from "playwright";
import {PUBLIC_SNAP_PATH} from "../types";


export const createSnap = async (page: Page, text: string = '', action: string = '') => {
    console.info(text)
    await page.screenshot({ path: `${PUBLIC_SNAP_PATH}/${action ? action+'_' : ''}screenshot_${Date.now()}.png`, fullPage: true });
}