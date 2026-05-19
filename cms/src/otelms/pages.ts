import config from "./config.js";


export const loginPage = `${config.otelMs.url}/login_c2/single_login`
export const roomsListPage = `${config.otelMs.url}/setup_categories_c2/categories_list`
export const priceCalendar = `${config.otelMs.url}/reservation_c2/price_calendar`

export const roomsEditPage = (id: number) =>  `${config.otelMs.url}/setup_categories_c2/edit/${id}`
export const roomsEditOccupancyPage = (id: number) =>  `${config.otelMs.url}/setup_categories_c2/edit_occupancy/${id}`
export const roomsEditEquipmentPage = (id: number) =>  `${config.otelMs.url}/setup_categories_c2/edit_equipment/${id}`
export const roomsEditPhotoPage = (id: number) =>  `${config.otelMs.url}/setup_categories_c2/edit_foto/${id}`

export const basePriceConfigPage = (priceId: number) =>  `${config.otelMs.url}/setup_rates_c2/edit_v2/${priceId}`
