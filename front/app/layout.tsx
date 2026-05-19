import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import MainMenu from "@/app/common/menu/MainMenu";
import Footer from "@/app/common/landing/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Friends Hostel — The Best Hostel in Kutaisi Georgia",
    description: "Friends Hostel — The Best Hostel in Kutaisi Georgia",
    applicationName: "Friends Hostel"
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="font-sans">
                    <MainMenu/>

                    {children}

                    <Footer/>
                </div>
            </body>
        </html>
    );
}
