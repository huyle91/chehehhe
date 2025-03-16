'use client';

import MobileNavLinks from '@/app/manage/mobile-nav-links';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DarkModeToggle from "@/components/dark-mode-toggle";
import NavItems from "@/app/(public)/nav-items";
import Image from "next/image";
import Logo from "@/assets/favicon.ico";
import { usePathname } from 'next/navigation';

interface HeaderProps {
  userName?: string;
  role?: string;
  avatarUrl?: string;
}

export function Header({ userName, role, avatarUrl }: HeaderProps) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || pathname === '/branches' || pathname === '/about' || pathname === '/contact' || pathname === '/policy';

  if (!isPublicPage) {
    return (
      <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-8'>
        <MobileNavLinks />
        <div className='flex items-center gap-2'>
          <Link href={"/"} className='text-xl font-semibold'>QR Ordering System</Link>
        </div>

        <div className='flex items-center gap-6'>
          {/* User Info */}
          {userName && role && (
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='font-medium'>{userName}</p>
                <p className='text-sm text-muted-foreground'>{role}</p>
              </div>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={avatarUrl} alt={`${userName}'s avatar`} />
                <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky z-20 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Image
              src={Logo}
              alt="Image"
              width={24}
              height={24}
              style={{ objectFit: "cover" }}
            />
          </div>
          <span className="sr-only">Hot Pot</span>
        </Link>
        <NavItems className="text-muted-foreground transition-colors hover:text-foreground flex-shrink-0" />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Image
                  src={Logo}
                  alt="Image"
                  width={24}
                  height={24}
                  style={{ objectFit: "cover" }}
                />
              </div>
              Hot Pot
            </Link>

            <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto">
        <DarkModeToggle />
      </div>
    </header>
  );
}