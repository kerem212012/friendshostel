import {MediaItem} from "@/app/common/media/uploads";

export interface FeatureItem {
    id: number
    Title: string | null
    Color: string
    Sort: number
    Image: MediaItem | null
}

export interface SlideItem {
    id: number
    Title: string
    Media: MediaItem
}
export interface LandingData {
    id: number;
    documentId: string;
    Title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    MainSlider: SlideItem[];
    Features: FeatureItem[]
}

export interface LandingResponse {
    data: LandingData;
    meta: Record<string, any>;
}