"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {MediaItem} from "@/app/common/media/uploads";

type RoomSliderProps = {
    host: string
    photos: MediaItem[]
}

export default function RoomSliderClient(props: RoomSliderProps) {
    const {photos, host} = props

    return (
        <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            navigation={true}
            className="rounded-lg overflow-hidden"
        >
            {photos.map((photo) => (
                <SwiperSlide key={photo.id} className="relative w-full aspect-[16/9]">
                    <img
                        src={`${host}${photo.url}`}
                        alt={photo.alternativeText || "Room photo"}
                        className="w-full h-full object-cover"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
