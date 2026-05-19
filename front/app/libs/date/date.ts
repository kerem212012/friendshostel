
export function getDayIdTz(date: Date): number {
    const msSinceEpoch = date.getTime();
    const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;

    return Math.floor((msSinceEpoch - timezoneOffsetMs) / 86400000);
}

export function getDateFromDayIdTz(dayId: number): Date {
    const ms = dayId * 86400000;
    const dateUtc = new Date(ms);

    return new Date(
        dateUtc.getUTCFullYear(),
        dateUtc.getUTCMonth(),
        dateUtc.getUTCDate()
    );
}

export function calculateNights(from: Date, to: Date): number {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffTime = to.getTime() - from.getTime();
    return Math.round(diffTime / oneDay);
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function formatDateInterval(from: Date, to: Date): string {
    return `${formatDate(from)} - ${formatDate(to)}`;
}


// export const dateRangeCountDays = (dateRange: RangeValue<DateValue> | null): number => {
//     if (!dateRange?.start || !dateRange?.end) return 1;
//
//     const startDate = dateRange.start.toDate('UTC');
//     const endDate = dateRange.end.toDate('UTC');
//
//     const diffTime = endDate.getTime() - startDate.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//
//     return diffDays > 0 ? diffDays : 1;
// }