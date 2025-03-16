'use client'
import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
}[] = [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: 'Branch',
      href: '/branches'
    },
    {
      title: 'About',
      href: '/about'
    },
    {
      title: 'Contact',
      href: '/contact'
    },
    {
      title: 'Policy',
      href: '/policy'
    },
    {
      title: 'Menu',
      href: '/guest/menu',
      role: [Role.Customer]
    },
    {
      title: 'Orders',
      href: '/guest/orders',
      role: [Role.Customer]
    },
    {
      title: 'Manage',
      href: '/manage/dashboard',
      role: [Role.Admin, Role.Manager, Role.Staff, Role.Chef]
    },
    {
      title: 'Login',
      href: '/login',
      hideWhenLogin: true
    },
  ]

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext()
  console.log("🚀 ~ role:", role)
  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error
      })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        console.log("🚀 ~ {menuItems.map ~ menuItems:", menuItems)
        const isAuth = item.role && role && item.role.includes(role.name)
        // Trường hợp menu item có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin)
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>Logout</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Do you wanna logout?</AlertDialogTitle>
              <AlertDialogDescription>
                Logging out may cause your bill to be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
