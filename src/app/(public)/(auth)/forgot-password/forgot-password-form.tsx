'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useState, useEffect } from "react"

interface OtpPopupProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

function OtpPopup({ isOpen, onClose, email }: OtpPopupProps) {
    const [countdown, setCountdown] = useState(60);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCountdown(60);
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        onClose();
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen, onClose]);

    const handleClose = () => {
        if (countdown > 0) {
            setShowConfirm(true);
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[120px] md:max-w-[620px]">
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Enter the one-time password (OTP) sent to <strong>{email}</strong> to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center">
                        <InputOTP maxLength={6} pattern="^[0-9]+$" className="text-2xl">
                            <InputOTPGroup>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <InputOTPSlot key={index} index={index} className="w-12 h-12 text-xl" />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <p className="text-center text-md text-gray-600 dark:text-gray-400">Resend OTP in <span className="font-semibold text-red-500">{countdown}s</span></p>
                    <div className="flex justify-end gap-2">
                        <Button type="submit">Verify OTP</Button>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
            {showConfirm && (
                <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Exit</DialogTitle>
                            <DialogDescription>
                                You haven&apos;t entered your OTP yet. Are you sure you want to exit?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => {
                                onClose();
                                setShowConfirm(false);
                            }}>Exit</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}

export default function ForgotPwForm() {
    const [isOtpOpen, setOtpOpen] = useState(false);
    const [email, setEmail] = useState("");

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950">
            <div className="mx-auto w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                    </p>
                </div>
                <form className="space-y-6" action="#" method="POST" onSubmit={(e) => { e.preventDefault(); setOtpOpen(true); }}>
                    <div>
                        <Label htmlFor="email" className="sr-only">
                            Email address
                        </Label>
                        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">
                        Reset password
                    </Button>
                </form>
                <div className="flex justify-center">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        prefetch={false}
                    >
                        Back to login
                    </Link>
                </div>
            </div>
            <OtpPopup isOpen={isOtpOpen} onClose={() => setOtpOpen(false)} email={email} />
        </div>
    );
}