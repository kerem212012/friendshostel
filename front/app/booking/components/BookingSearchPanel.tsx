import {DateRangePicker} from "@heroui/date-picker";
import {Button} from "@heroui/button";
import {Input} from "@heroui/input";
import type {RangeValue} from "@react-types/shared";
import {DateValue, getLocalTimeZone, today} from "@internationalized/date";
import {Room as RoomType} from "@/app/common/rooms/types";

interface BookingSearchPanelProps {
    guests: number;
    dateRange: RangeValue<DateValue> | null;
    onGuestsChange: (guests: number) => void;
    onDateRangeChange: (dateRange: RangeValue<DateValue> | null) => void;
    onSearch: (val:  RoomType[] | boolean) => void;
}

export function BookingSearchPanel({
    guests,
    dateRange,
    onGuestsChange,
    onDateRangeChange,
    onSearch
}: BookingSearchPanelProps) {
    const incrementGuests = () => {
        onGuestsChange(guests + 1);
    };

    const decrementGuests = () => {
        onGuestsChange(Math.max(1, guests - 1));
    };

    const handleSearchVariants = () => {
        onSearch([])
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[300px]">
                    <DateRangePicker
                        label="Select dates"
                        value={dateRange}
                        selectorButtonPlacement="start"
                        defaultValue={{
                            start: today(getLocalTimeZone()),
                            end: today(getLocalTimeZone()).add({days: 1}),
                        }}
                        minValue={today(getLocalTimeZone())}
                        onChange={onDateRangeChange}
                        className="w-full"
                        visibleMonths={2}
                    />
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block text-tiny font-medium">
                        Adults
                    </label>
                    <div className="flex items-center gap-2">
                        <Button
                            isIconOnly
                            size="md"
                            variant="flat"
                            onPress={decrementGuests}
                            isDisabled={guests <= 1}
                        >
                            -
                        </Button>
                        <Input
                            value={guests.toString()}
                            readOnly
                            className="w-10 text-center"
                            classNames={{
                                input: "text-center"
                            }}
                        />
                        <Button
                            isIconOnly
                            size="md"
                            variant="flat"
                            onPress={incrementGuests}
                        >
                            +
                        </Button>
                    </div>
                </div>

                {/*<Button*/}
                {/*    color="primary"*/}
                {/*    size="lg"*/}
                {/*    onPress={handleSearchVariants}*/}
                {/*    isDisabled={!dateRange}*/}
                {/*>*/}
                {/*    Find variants*/}
                {/*</Button>*/}
            </div>
        </div>
    );
}
