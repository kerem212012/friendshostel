import {Order} from "./RoomCard";
import {MediaItem} from "@/app/common/media/uploads";
import {useMemo} from "react";
import {roomPrice, roomTitle} from "@/app/common/rooms/types";
import {BookingRequestPayload} from "@/app/common/booking/types";
import {Button} from "@heroui/button";
import type {RangeValue} from "@react-types/shared";
import {DateValue} from "@internationalized/date";

interface BookingCartProps {
    items: Order[];
    host: string;
    dateRange?: RangeValue<DateValue> | null;
    guests?: number;
    isBlockedButton: boolean;

    onRemove?: (roomId: number) => void;
    onClickBooking: (payload: BookingRequestPayload) => void;
}

export function BookingCart({
    items,
    host,
    onRemove,
    dateRange,
    guests,
    onClickBooking,
    isBlockedButton
}: BookingCartProps) {

    const daysCount = useMemo(() => {
        return dateRangeCountDays(dateRange || null);
    }, [dateRange]);

    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            const price = roomPrice(item.room, dateRange || null, item.withBreakfast)
            return sum + (price * item.quantity * daysCount);
        }, 0);
    }, [items, daysCount, dateRange]);


    const totalPlaces = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    const formatDateRange = () => {
        if (!dateRange?.start || !dateRange?.end) return 'Dates not selected';

        const start = `${dateRange.start.day}.${dateRange.start.month}.${dateRange.start.year}`;
        const end = `${dateRange.end.day}.${dateRange.end.month}.${dateRange.end.year}`;
        return `${start} - ${end}`;
    };

    if (items.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Cart</h2>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                    Cart is empty
                </div>
            </div>
        );
    }

    const handleBookClick = async () => {
        const isValidCart = (guests && (guests > 0)) && !!dateRange
        if (!isValidCart) {
            return
        }

        const payload: BookingRequestPayload = {
            items: items.map(item => ({
                documentId: item.room.documentId,
                quantity: item.quantity,
                withBreakfast: item.withBreakfast,
            })),
            dateRange: {
                start: dateRange.start.toString(),
                end: dateRange.end.toString(),
            },
            guestsCount: guests,
            totalPrice: totalPrice,
        };

        onClickBooking(payload)

    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 sticky top-4">
            {/*<h2 className="text-xl font-bold mb-4">Cart</h2>*/}

            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Dates:</span>
                    <span className="font-medium">{formatDateRange()}</span>
                </div>
                {guests !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Guests:</span>
                        <span className="font-medium">{guests}</span>
                    </div>
                )}
            </div>

            <div className="space-y-4 mb-6">
                {items.map((item) => {
                    const img: MediaItem | undefined = (item.room.photos || [])[0];
                    const imageUrl = img ? `${host}${img.url}` : '';

                    return (
                        <div key={item.room.id} className="flex gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 relative">
                            {onRemove && (
                                <button
                                    onClick={() => onRemove(item.room.id)}
                                    className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors text-sm font-bold z-10"
                                    aria-label="Remove from cart"
                                >
                                    ×
                                </button>
                            )}
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt={roomTitle(item.room)}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-medium text-sm truncate">{roomTitle(item.room)}</h3>

                                </div>
                                {/*<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">*/}
                                {/*    {item.withBreakfast && (*/}
                                {/*        <div className="flex-shrink-0 bg-orange-100 dark:bg-orange-900/30 rounded-full p-1" title="With breakfast">*/}
                                {/*            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">*/}
                                {/*                <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>*/}
                                {/*            </svg>*/}
                                {/*        </div>*/}
                                {/*    )}*/}
                                {/*</p>*/}

                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    {item.quantity} {item.quantity === 1 ? 'place' : 'places'}
                                    {item.withBreakfast && <span> + breakfast</span>}
                                </p>

                                <p className="text-sm">
                                    <span className="font-semibold"></span>{roomPrice(item.room, dateRange, item.withBreakfast) * item.quantity} GEL / day x {item.quantity}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Places booked:</span>
                        <span className="font-medium">{totalPlaces}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Days:</span>
                        <span className="font-medium">{daysCount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="text-xl font-bold">{totalPrice} GEL</span>
                    </div>
                </div>

                {!isBlockedButton && <Button
                    color="primary"
                    className="w-full"
                    size="lg"
                    onPress={handleBookClick}
                    isDisabled={isBlockedButton}
                >
                    Book
                </Button>}

            </div>
        </div>
    );
}

export const dateRangeCountDays = (dateRange: RangeValue<DateValue> | null): number => {
    if (!dateRange?.start || !dateRange?.end) return 1;

    const startDate = dateRange.start.toDate('UTC');
    const endDate = dateRange.end.toDate('UTC');

    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 1;
}