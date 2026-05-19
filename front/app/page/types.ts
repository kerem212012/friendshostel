import {type BlocksContent} from '@strapi/blocks-react-renderer';

export interface Page {
    id?: number;
    documentId: string;
    Url: string;
    Title: string;
    Body: BlocksContent;
    IsMainMenu: boolean;
    Sort: number;
}

export interface PagesResponse {
    data: Page[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface PageParams {
    params: Promise<{
        id: string;
    }>;
}
