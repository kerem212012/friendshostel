import {PRICE_TYPE_BREAKFAST, PRICE_TYPE_WITHOUT_BREAKFAST} from "../price/types";

export const resolvePriceType = (type: 'breakfast'| 'without_breakfast') => {
    if (type === "breakfast") {
        return PRICE_TYPE_BREAKFAST
    }

    if (type === "without_breakfast") {
        return PRICE_TYPE_WITHOUT_BREAKFAST
    }

    return 0
}