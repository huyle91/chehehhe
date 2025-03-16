'use client'

import { useAppContext } from "@/components/app-provider";
import { MapPin } from "lucide-react"
export default function RestaurantName() {
    const { restaurant } = useAppContext();
    return (
        <div className="mr-4 flex-1">
            <h1 className="text-lg font-medium">
                {restaurant &&
                    <span className="flex items-center gap-2">
                        <MapPin size={16} />
                        {restaurant.name}
                    </span>
                    ||
                    <span>
                        Administrator
                    </span>
                }
            </h1>
        </div>
    );
}