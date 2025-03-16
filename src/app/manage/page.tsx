"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/app-provider";
import Loading from "@/components/loading";

const rolePaths: Record<string, string> = {
    Admin: "/manage/a/dashboard",
    Manager: "/manage/m",
    Staff: "/manage/s/tracking",
    Chef: "/manage/c/order-control",
};

export default function ManagePage() {
    const router = useRouter();
    const { role } = useAppContext();

    useEffect(() => {
        if (role) {
            const redirectPath = rolePaths[role.name] || "/login";
            router.replace(redirectPath);
        }
    }, [router, role]);

    return <Suspense fallback={<Loading />}></Suspense>;
}
