import BookingUiPage from "@/app/booking/ui-page";
import {Metadata} from "next";
import {getAllRooms} from "@/app/common/rooms/service";
import {uploadsUrl} from "@/app/config";

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: 'Book yor state',
        description: 'Page with booking form'
    }
}

export default async function BookingPage() {
    const rooms = await getAllRooms();

    return <BookingUiPage rooms={rooms || []}  host={uploadsUrl()}/>
}
