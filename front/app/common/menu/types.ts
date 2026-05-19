import {Page as PageType} from "@/app/page/types";

export type MenuItem = Omit<PageType, 'Body' | 'id'> & {
    className?: string
    IsCustom?: boolean
}

export const defaultItems: MenuItem[] = [
    // {
    //     Sort: 1001,
    //     Title: 'Book your stay',
    //     Url: '/booking',
    //     documentId: 'booking_btn',
    //     IsMainMenu: true,
    //     IsCustom: true,
    // },
    {
        Sort: 1000,
        Title: 'Blog',
        Url: '/blog',
        documentId: 'blog_link',
        IsMainMenu: true,
        IsCustom: true,
    },
]