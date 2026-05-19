"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {SlideItem} from "@/app/common/landing/types";

type SlideProps = {
    host: string
    slides: SlideItem[]
}
export default function MainSliderClient(props: SlideProps) {
    const {slides, host} = props

    return (
        <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            autoplay={{ delay: 8000 }}
            pagination={{ clickable: true, enabled: false }}
            className="rounded-xl overflow-hidden shadow-lg"
        >
            {slides.map((mediaItem) => (
                <SwiperSlide key={mediaItem.id} className="relative w-full h-[500px] md:h-[600px]">
                    <img
                        src={`${host}${mediaItem.Media.url}`}
                        alt={mediaItem.Title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-6xl font-bold text-center px-4">
                            {mediaItem.Title}
                        </h1>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
