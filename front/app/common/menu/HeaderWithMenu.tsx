'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {MenuItem} from "@/app/common/menu/types";

interface HeaderWithMenuProps {
    menuItems: MenuItem[];
}

const bookingBtn: MenuItem = {
    Sort: 1000,
    Title: 'Book Your Stay',
    Url: '/booking',
    documentId: 'booking_btn',
    IsMainMenu: true,
    IsCustom: true,
}

export function HeaderWithMenu({ menuItems }: HeaderWithMenuProps) {

    const pathname = usePathname();
    const [logoUnavailable, setLogoUnavailable] = useState(false);

    const isHome = pathname === '/';

    const logoUrl = '/uploads/Screenshot_2025_12_25_at_03_23_52_2aea2358b1.png';
    const showLogoImage = !logoUnavailable;

    const logo = showLogoImage ? (
        <img
            src={logoUrl}
            alt="Friends Hostel"
            className="h-16 w-auto -my-4"
            onError={() => setLogoUnavailable(true)}
        />
    ) : (
        <span className="text-lg font-semibold uppercase tracking-[0.28em] text-slate-900">
            Friends Hostel
        </span>
    );

    return (
        <header className="bg-white shadow">
            <nav className="container mx-auto flex justify-between items-center py-4 px-6">
                {isHome ? (
                    <div className="flex items-center">
                        {logo}
                    </div>
                ) : (
                    <Link
                        href="/"
                        className="flex items-center hover:opacity-80 transition"
                    >
                        {logo}
                    </Link>
                )}

                <ul className="flex items-center space-x-6">
                    {menuItems.map((item) => (
                        <li key={item.Title}>
                            <a href={item.Url} className="hover:text-blue-500 transition">
                                {item.Title}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            key={bookingBtn.documentId}
                            href={bookingBtn.Url}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {bookingBtn.Title}
                        </a>
                    </li>
                </ul>
            </nav>


        </header>


    );
}
