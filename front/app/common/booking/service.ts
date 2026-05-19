import {BookingRequestPayloadWithUser} from "@/app/common/booking/types";

export const requestCreateBooking = async (host: string, req: BookingRequestPayloadWithUser) => {
    const response = await fetch(`${host}/api/orders/create-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    });

    if (!response.ok) {
        throw new Error("Failed to create order");
    }

    const result = await response.json();
    console.log("Order created:", result);

    // тут можно:
    // - редиректить на страницу оплаты
    // - показать success toast
    // - очистить корзину
}