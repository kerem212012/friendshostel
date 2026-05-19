import Link from "next/link";
import {getAllRooms} from "@/app/common/rooms/service";
import MainSlider from "@/app/common/landing/MainSlider";
import {apiUrl, uploadsUrl} from "@/app/config";
import {buildQuery} from "@/app/common/http/query";
import {LandingResponse} from "@/app/common/landing/types";
import Features from "@/app/common/landing/Features";
import {roomTitle} from "@/app/common/rooms/types";
import Image from "next/image";

const advantages = [
    {title: "Central Location", description: "Located in the heart of Kutaisi."},
    {title: "Free Wi-Fi", description: "Stay connected during your stay."},
    {title: "24/7 Reception", description: "We are always available for you."},
    {title: "Cozy Atmosphere", description: "Feel like home in our hostel."},
];

export default async function Home() {
    const rooms = await getAllRooms();

    const queryParams = {
        populate: {
            MainSlider: {
                populate: "*",
            },
            Features: {
                populate: "*",
            },
        },
    };

    let url = `${apiUrl()}/landing?${buildQuery(queryParams)}`;
    const res = await fetch(url, { cache: "no-store" });
    const landing: LandingResponse = await res.json();

    return (
        <div className="font-sans">

            <section className="container mx-auto px-6 py-8">
                <MainSlider landing={landing.data}/>
            </section>

            <Features landing={landing.data}/>

            <section className="container mx-auto py-16 px-6">
                <h2 className="text-6xl font-bold mb-8 text-center">Our Rooms</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {rooms.length > 0 && rooms.map((room) => (
                        <Link
                            key={room.documentId}
                            href={`/room/${room.documentId}`}
                            className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative w-full aspect-[16/9]">
                                {room.photos && room.photos.length > 0 ? (
                                    <img
                                        src={`${uploadsUrl()}${room.photos[0].url}`}
                                        alt={roomTitle(room)}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-2xl font-bold">
                                            {roomTitle(room)}
                                        </h3>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            room.isActive
                                                ? 'bg-green-500/90 text-white'
                                                : 'bg-gray-500/90 text-white'
                                        }`}>
                                            {room.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    {room.data.international_name?.ru && (
                                        <p className="text-sm text-gray-200 mb-3">
                                            {room.data.international_name.ru}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm">
                                            {room.data.places && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    {room.data.places} guests
                                                </span>
                                            )}
                                        </div>
                                        {room.data.base_price && (
                                            <div className="text-right">
                                                <p className="text-sm text-gray-300">from</p>
                                                <p className="text-2xl font-bold text-white">
                                                    {room.data.base_price} <span className="text-lg">GEL</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>



            <section className="w-full h-[600px]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.771194020908!2d42.6938121!3d42.2741917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x405c8d6e228e7df7%3A0xe195f983e275f9e2!2sThe%20Friends%20Hostel!5e0!3m2!1sen!2sge!4v1733750000000"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>
        </div>
    );
}
