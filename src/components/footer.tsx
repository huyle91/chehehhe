import { Beef } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='relative z-10 w-full border-t bg-background/80 backdrop-blur-sm'>
      <div className='mx-auto max-w-7xl px-4 py-8'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center gap-2 group' prefetch={false}>
              <Beef className='h-8 w-8 text-orange-500 group-hover:text-orange-600 transition-colors' />
              <span className='text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'>
                Big Boy Restaurant
              </span>
            </Link>
            <p className='text-sm text-muted-foreground max-w-md'>
              Trải nghiệm ẩm thực độc đáo với không gian sang trọng và phục vụ chuyên nghiệp
            </p>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Liên Kết Nhanh</h3>
            <div className='grid grid-cols-1 gap-2'>
              <Link 
                href='/term-of-service' 
                className='text-muted-foreground hover:text-foreground transition-colors hover:underline decoration-orange-500 underline-offset-4' 
                prefetch={false}
              >
                Điều khoản dịch vụ
              </Link>
              <Link 
                href='/privacy-policy' 
                className='text-muted-foreground hover:text-foreground transition-colors hover:underline decoration-orange-500 underline-offset-4' 
                prefetch={false}
              >
                Chính sách bảo mật
              </Link>
              <Link 
                href='/about' 
                className='text-muted-foreground hover:text-foreground transition-colors hover:underline decoration-orange-500 underline-offset-4' 
                prefetch={false}
              >
                Về chúng tôi
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Kết Nối Với Chúng Tôi</h3>
            <div className='flex gap-4'>
              <Link
                href='https://www.facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-full bg-background hover:bg-orange-500/10 text-muted-foreground hover:text-orange-500 transition-all'
                prefetch={false}
              >
                <svg role='img' viewBox='0 0 24 24' className='w-5 h-5 fill-current' xmlns='http://www.w3.org/2000/svg'>
                  <title>Facebook</title>
                  <path d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' />
                </svg>
              </Link>
              <Link
                href='https://www.youtube.com'
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-full bg-background hover:bg-orange-500/10 text-muted-foreground hover:text-orange-500 transition-all'
                prefetch={false}
              >
                <svg role='img' viewBox='0 0 24 24' className='w-5 h-5 fill-current' xmlns='http://www.w3.org/2000/svg'>
                  <title>YouTube</title>
                  <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                </svg>
              </Link>
              <Link
                href='https://www.tiktok.com'
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-full bg-background hover:bg-orange-500/10 text-muted-foreground hover:text-orange-500 transition-all'
                prefetch={false}
              >
                <svg role='img' viewBox='0 0 24 24' className='w-5 h-5 fill-current' xmlns='http://www.w3.org/2000/svg'>
                  <title>TikTok</title>
                  <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className='mt-8 pt-8 border-t border-border'>
          <p className='text-center text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Big Boy Restaurant. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  )
}