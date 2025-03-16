import DarkModeToggle from '@/components/dark-mode-toggle'
import DropdownAvatar from '@/app/manage/dropdown-avatar'
import NavLinks from '@/app/manage/nav-links'
import MobileNavLinks from '@/app/manage/mobile-nav-links'
import RestaurantName from '@/components/restaurant'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <NavLinks />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <MobileNavLinks />
          <div className='flex w-full items-center justify-between'>
            <RestaurantName />
            <div className='flex items-center gap-2'>
              <DarkModeToggle />
              <DropdownAvatar />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}