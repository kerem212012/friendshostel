import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                        Friends Hostel
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Cozy hostel in the heart of Kutaisi
                    </p>
                </div>

                {/* Навигация */}
                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 text-zinc-800 dark:text-zinc-200">
                        Information
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/page/rules"
                                className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600"
                            >
                                Rules
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/page/contacts"
                                className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600"
                            >
                                Contacts
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Контакты */}
                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 text-zinc-800 dark:text-zinc-200">
                        Contact us
                    </h4>

                    <div className="space-y-3">
                        <a
                            href="tel:+995551086627"
                            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600"
                        >
                            +995 551 086 627
                        </a>

                        <a
                            href="https://www.instagram.com/thefriendshostel/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>

            {/* Нижняя строка */}
            <div className="text-center text-xs py-4 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500">
                © {new Date().getFullYear()} Your Hostel. All rights reserved.
            </div>
        </footer>
    );
}
