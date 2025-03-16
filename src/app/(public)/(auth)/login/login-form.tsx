'use client'
import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { decodeToken, handleErrorApi } from '@/lib/utils'
import { useLoginGoogleMutation, useLoginMutation } from '@/queries/useAuth'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase'
import { LoaderCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLoginMutation()
  const searchParams = useSearchParams()
  const clearToken = searchParams.get('clearToken')
  const { setRole } = useAppContext()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const router = useRouter()

  useEffect(() => {
    if (clearToken) {
      setRole()
    }
  }, [clearToken, setRole])

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast({
        description: result.payload.message,
        duration: 1200,
      })
      const userRole = decodeToken(result.payload.data.access_token).role
      setRole(userRole)
      router.push('/manage')
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  //login google
  const loginGoogleMutation = useLoginGoogleMutation()
  const loginGoogle = async () => {
    if (loginGoogleMutation.isPending) return
    const provider = new GoogleAuthProvider()
    try {
      const data = await signInWithPopup(auth, provider)
      const email = data.user.email
      const result = await loginGoogleMutation.mutateAsync({ email: email as string })
      toast({
        description: result.payload.message,
        duration: 1200,
      })
      const userRole = decodeToken(result.payload.data.access_token).role
      setRole(userRole)
      setTimeout(() => {
        router.push('/manage')
      }, 2000)
    } catch {
      toast({
        description: 'Your account is not registered yet, please register first',
        variant: 'destructive',
        duration: 1200,
      })
    }
  }

  return (
    <Card className='mx-auto max-w-lg'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            noValidate
            onSubmit={form.handleSubmit(onSubmit, error => {
              console.warn(error)
            })}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='username'>Email</Label>
                      <Input id='username' type='email' placeholder='name@example.com' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='password'>Password</Label>
                        <Button
                          variant='link'
                          className='text-black text-sm dark:text-white'
                          onClick={(e) => {
                            e.preventDefault();
                            router.push('/forgot-password')
                          }}
                          type="button"
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className='relative'>
                        <Input
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          required
                          className='pr-10'
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-0 top-0 h-full px-3'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                          <span className='sr-only'>
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={loginMutation.isPending}>
                {loginMutation.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                Login
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <Button variant='outline' className='w-full' type='button'
                onClick={loginGoogle} disabled={loginGoogleMutation.isPending}
              >
                {loginGoogleMutation.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                Login with Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}