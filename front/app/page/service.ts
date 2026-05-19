import { Page as PageType, PagesResponse } from "@/app/page/types";
import {apiUrl} from "@/app/config";
import {buildQuery} from "@/app/common/http/query";

export async function getAllPages(): Promise<PageType[]> {
    try {
        const queryParams = {
            sort: "Sort:asc",
            fields: "Url,Title,Body,IsMainMenu,Sort",
            filters: {
                IsMainMenu: true
            }
        };

        let url = `${apiUrl()}/pages?${buildQuery(queryParams)}`;
        const res = await fetch(url, {cache: "no-store"});

        if (!res.ok) {
            return [];
        }

        const data: PagesResponse = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
}

export async function getPageByUrl(url: string): Promise<PageType | null> {
    try {
        const res = await fetch(
            `${apiUrl()}/pages?filters[Url][$eq]=${url}&fields=Url%2CTitle%2CBody%2CIsMainMenu%2CSort`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) {
            return null;
        }

        const data: PagesResponse = await res.json();
        return data.data[0] || null;
    } catch (error) {
        console.error("Error fetching page by URL:", error);
        return null;
    }
}
