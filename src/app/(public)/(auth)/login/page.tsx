import LoginForm from "@/app/(public)/(auth)/login/login-form";
import bgLg from "@/assets/placeholder.svg";
import Loading from "@/components/loading";
import Image from "next/image";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src={bgLg}
                    alt="Image"
                    fill
                    style={{ objectFit: "cover" }}
                    className="dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <Suspense fallback={<div><Loading /></div>}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>

    );
}
