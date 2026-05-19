import {notFound} from "next/navigation";
import {RoomParams, roomTitle} from "@/app/common/rooms/types";
import {getRoomById} from "@/app/common/rooms/service";
import {Metadata} from "next";
import {buildSeoRoom} from "@/app/libs/seo/seo-builder";
import {uploadsUrl} from "@/app/config";
import RoomSliderClient from "./RoomSliderClient";

type Props = {
  params: { id: string }
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
  const { id } = await params;

  const room = await getRoomById(id)

  if (!room) {
    return {
      title: 'Room not found',
      description: ''
    }
  }

  const seo = buildSeoRoom(room)

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
  }
}

export default async function Room({ params }: RoomParams) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

  const genderMap: Record<string, string> = {
    "0": "Mixed",
    "1": "Male",
    "2": "Female",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
          {roomTitle(room)}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Slider with photos */}
          <div className="lg:col-span-7">
            {room.photos && room.photos.length > 0 && (
              <RoomSliderClient photos={room.photos} host={uploadsUrl()} />
            )}
          </div>

          {/* Right column: Room information */}
          <div className="lg:col-span-5">
            <div className="text-zinc-700 dark:text-zinc-300 space-y-4">
              <p className="text-lg">
                {room.data.international_comment.en || "Room information"}
              </p>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                  Room Features:
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Name: {room.data.shortname}</li>
                  <li>Area: {room.data.size} m²</li>
                  <li>Capacity: {room.data.places} person(s)</li>
                  <li>Bedrooms: {room.data.bedrooms}</li>
                  <li>Bathrooms: {room.data.bathrooms}</li>
                  <li>Type: {genderMap[room.data.gender] || "Not specified"}</li>
                  <li>Price: {room.data.base_price}$ per night</li>
                  <li>
                    Status:{" "}
                    {room.isActive ? (
                      <span className="text-green-600">Available</span>
                    ) : (
                      <span className="text-red-600">Not available</span>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}