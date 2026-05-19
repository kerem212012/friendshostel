import {uploadsUrl} from "@/app/config";
import {LandingData} from "@/app/common/landing/types";
// @ts-ignore
import {Autoplay, Navigation, Pagination} from "swiper";
import MainSliderClient from "./MainSliderClient";

type SliderProps = {
    landing: LandingData
}

export default async function MainSlider(props: SliderProps) {
    const mainSlider = props.landing.MainSlider

    return <MainSliderClient slides={mainSlider} host={uploadsUrl()}/>;
}