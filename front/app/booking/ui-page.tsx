'use client';

import {useCallback, useEffect, useState} from "react";
import {DateValue, RangeValue} from "@heroui/calendar";
import {getLocalTimeZone, today} from "@internationalized/date";
import {Providers} from "@/app/providers";
import {BookingSearchPanel} from "./components/BookingSearchPanel";
import {Order, RoomCard} from "./components/RoomCard";
import {BookingCart} from "./components/BookingCart";
import {uploadsUrl} from "@/app/config";
import {filterRooms, Room as RoomType} from "@/app/common/rooms/types";
import {SearchRoomFilter} from "@/app/common/rooms/service";
import {BookingRequestPayload} from "@/app/common/booking/types";
import {OrderForm} from "@/app/booking/components/OrderForm";

interface BookingPageProps {
    rooms: RoomType[]
    host: string
}

export default function BookingUiPage(props: BookingPageProps) {
    const allRooms = props.rooms

    const [rooms, setRooms] = useState<RoomType[]>(() => props.rooms)
    const [guests, setGuests] = useState(1);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({days: 1})
    });
    const [cartItems, setCartItems] = useState<Order[]>([]);
    const [filter, setFilter] = useState<SearchRoomFilter | undefined>()
    const [orderForm, setOrderForm] = useState<BookingRequestPayload | null>(null)


    useEffect(() => {
        const fetchData = async () => {
            if(!filter) {
                setRooms(allRooms)
                return
            }

            setRooms(filterRooms(allRooms, filter))
        }

        fetchData()
    }, [allRooms, filter])

    const handleAddRoom = (order: Order) => {
        if (order.quantity === 0) {
            setCartItems(prev => prev.filter(item => item.room.id !== order.room.id));
            return
        }

        const existingItemIndex = cartItems.findIndex(item => item.room.id === order.room.id);

        if (existingItemIndex >= 0) {
            setCartItems(prev => prev.map((item, index) =>
                index === existingItemIndex ? order : item
            ));
            return;
        }

        setCartItems(prev => [...prev, order]);
    };

    const handleRemoveFromCart = (roomId: number) => {
        setCartItems(prev => prev.filter(item => item.room.id !== roomId));
    };

    const handleGuests = (val: number) => {
        setGuests(val)
    }

    const handleDateRange = (val: RangeValue<DateValue> | null) => {
        setDateRange(val)
    }

    const handleSearch = (val: RoomType[] | boolean) => {
        if (dateRange?.start && dateRange?.end) {
            setFilter({
                from: dateRange?.start.toString(),
                to: dateRange?.end.toString(),
            })
        }
    }

    const handleOnClickBooking = (payload: BookingRequestPayload) => {
        setOrderForm(payload)
    }

    const showList = useCallback(() => {
        return rooms.length > 0 && !orderForm
    }, [rooms, orderForm])

    const handleSuccessBooking = () => {
        setCartItems([])
        setOrderForm(null)

        console.log(888)
    };

    return (
        <Providers>
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <div
                    className="relative h-72 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${uploadsUrl()}/uploads/b0d7f4f8_5bbf_48ce_b6cd_b038f38e2aa5_f467969d2c.avif)`
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"/>
                </div>

                <div className="container mx-auto px-4 -mt-24 relative z-10">
                    <BookingSearchPanel
                        guests={guests}
                        dateRange={dateRange}
                        onGuestsChange={handleGuests}
                        onDateRangeChange={handleDateRange}
                        onSearch={handleSearch}
                    />

                    {rooms.length === 0 && <div>
                        <h1>Choice date range</h1>
                    </div>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-4">
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 gap-4">
                                {showList() && rooms.map((room) => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        dateRange={dateRange}
                                        isInCart={cartItems.some(i => i.room.id === room.id)}
                                        onAdd={handleAddRoom}
                                        host={props.host}
                                    />
                                ))}

                                {!showList() && orderForm &&
                                    <OrderForm
                                        host={props.host}
                                        payload={orderForm}
                                        onClose={() => setOrderForm(null)}
                                        onSuccess={handleSuccessBooking}
                                    />
                                }
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <BookingCart
                                items={cartItems}
                                host={props.host}
                                onRemove={handleRemoveFromCart}
                                dateRange={dateRange}
                                guests={guests}
                                onClickBooking={handleOnClickBooking}
                                isBlockedButton={!showList()}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </Providers>
    );
}
