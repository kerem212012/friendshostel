import {Card, CardBody, CardFooter} from "@heroui/card";
import {Select, SelectItem} from "@heroui/select";
import {Checkbox} from "@heroui/checkbox";
import {BedIcon, PersonIcon, ShowerIcon} from "./Icons";
import {generatePlaces, Room as RoomType, roomPrice, roomTitle, SelectPlace} from "@/app/common/rooms/types";
import {MediaItem} from "@/app/common/media/uploads";
import {useEffect, useState} from "react";
import {Link} from "@heroui/react";
import type {RangeValue} from "@react-types/shared";
import {DateValue} from "@internationalized/date";

export interface Room {
    id: number;
    name: string;
    image: string;
    shower: number;
    beds: number;
    capacity: number;
    price: number;
}

export interface Order {
    room: RoomType;
    quantity: number;
    withBreakfast: boolean;
}

interface RoomCardProps {
    room: RoomType,
    host: string,
    isInCart: boolean,
    placesInput?: number,
    onAdd: (order: Order) => void,
    dateRange: RangeValue<DateValue> | null
}


export function RoomCard({room, onAdd, host, isInCart, dateRange}: RoomCardProps) {
    const [selected, setSelected] = useState<number | false>(false)
    const [baseList, setSelectList] = useState<SelectPlace[]>([])
    const [withBreakfast, setWithBreakfast] = useState(false)

    useEffect(() => {
        setSelectList(generatePlaces(room, dateRange, withBreakfast))
    }, [room, dateRange, withBreakfast])


    useEffect(() => {
        if (!isInCart) {
            setSelected(false)
            setWithBreakfast(false)
        }
    }, [isInCart]);

    useEffect(() => {
        if (selected && selected > 0) {
            onAdd({
                room,
                quantity: selected,
                withBreakfast
            });
        }
    }, [withBreakfast])


    const add = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "remove") {
            onAdd({
                room,
                quantity: 0,
                withBreakfast
            });
            setSelected(false);
            setWithBreakfast(false)
            return;
        }

        const quantity = parseInt(value, 10) || 0;
        onAdd({
            room,
            quantity,
            withBreakfast
        });
        setSelected(quantity);
    };

    const img: MediaItem | undefined = (room.photos || [])[0]
    const firstImage = `${host}${img?.url || ''}`

    const selectList: SelectPlace[] = selected
        ? [...baseList, {key: "remove", label: "Remove"}]
        : baseList;


    return (
        <Card className="transition-transform">
            <CardBody className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    <div className="md:col-span-1">
                        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                                src={firstImage}
                                alt={roomTitle(room)}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3E' + roomTitle(room) + '%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-xl mb-2">{roomTitle(room)}</h3>

                            <div className="flex gap-6 text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <ShowerIcon/>
                                    <span className="text-sm">{room.data.bathrooms} bathroom</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BedIcon/>
                                    <span className="text-sm">{room.data.bedrooms} bed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PersonIcon/>
                                    <span className="text-sm">Sleeps {room.data.places}</span>
                                </div>
                            </div>

                            <p className="text-lg  dark:text-gray-400 mb-4 mt-2 font-bold">
                                {roomPrice(room, dateRange)} GEL
                            </p>

                            {room.data.international_comment.en &&
                                <p className="text-m text-gray-600 dark:text-gray-400 mb-4  mt-2">
                                    {room.data.international_comment.en}
                                </p>}

                            <Link href={`/room/${room.documentId}`} size="sm" underline="always">
                                More info
                            </Link>


                        </div>

                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex-col items-start gap-3 pt-0">
                <div className="w-full flex gap-4 items-end">
                    <Select
                        label="Number of places"
                        className="max-w-[160px]"
                        size="sm"
                        selectedKeys={selected ? [String(selected)] : []}
                        onChange={add}
                    >
                        {selectList.map((item) => (
                            <SelectItem key={item.key}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </Select>

                    <Checkbox
                        isSelected={withBreakfast}
                        onValueChange={setWithBreakfast}
                        size="sm"
                        className="mb-1"
                    >
                        <span className="text-sm">With breakfast</span>
                    </Checkbox>
                </div>
            </CardFooter>
        </Card>
    );
}