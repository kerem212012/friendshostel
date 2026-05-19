import {LandingData} from "@/app/common/landing/types";
import Image from "next/image";
import {uploadsUrl} from "@/app/config";

type FeaturesProps = {
    landing: LandingData;
};

export default async function Features({landing}: FeaturesProps) {
    const features = landing.Features
        .sort((a, b) => a.Sort - b.Sort)
        .map(f => {
            if (f.Image) {
                f.Image.url = `${uploadsUrl()}${f.Image.url}`
            }
            return f
        })

    // todo: :remove
    // features = [...features, ...features]

    return (
        <section className="container mx-auto py-16 px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((f) => {
                    const hasImage = Boolean(f.Image);

                    return (
                        <div
                            key={f.id}
                            className="relative overflow-hidden shadow hover:shadow-lg transition flex items-center justify-center"
                            style={
                                !hasImage && f.Color
                                    ? {backgroundColor: f.Color}
                                    : undefined
                            }
                        >
                            {hasImage && f.Image?.url && (
                                <img
                                    src={f.Image.url}
                                    alt={f.Title ?? ""}
                                    className="object-cover"
                                />
                            )}

                            {f.Title && (
                                <div className="relative z-10 text-center px-4">
                                    <h3 className="text-xl font-semibold text-white">
                                        {f.Title}
                                    </h3>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
