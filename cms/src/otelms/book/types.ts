export interface BookReserveInput  {
    room_id: number,

    // datein: "2025-11-20",// даты
    datein: string,
    dateinId: number,
    // dateout: "2025-11-24",
    dateout: string,
    dateoutId: number,
    // date: "2025-11-20 - 2025-11-24",
    date: string,
    // duration: 4,
    duration: number,

    // phone: "+79999999999",
    phone: string,
    // email: "test@test.com",
    email: string,
    // firstname: "test",
    firstname: string,
    // lastname: "guest",
    lastname: string,
    // middlename: "",
    middlename: string,
    // description: "tttyyy",
    description: string,

    // price_type: 16,
    price_type: number,

    // service_main_amount: 80,
    service_main_amount: number,

    adults: number,
}