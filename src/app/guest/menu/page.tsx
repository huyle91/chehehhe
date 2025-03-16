import Loading from "@/components/loading";
import MenuList from "./MenuList";
import { Suspense } from "react";

export default function Menu() {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <MenuList />
            </Suspense>
        </div>
    );
}