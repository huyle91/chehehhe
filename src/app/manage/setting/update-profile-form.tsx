'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useAccountMe, useUpdateMeMutation } from '@/queries/useAccount'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const updateMeMutation = useUpdateMeMutation()
  const useMedia = useUploadMediaMutation()
  const { data, refetch } = useAccountMe()

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      username: '',
      avatar: undefined,
      id: ''
    }
  })
  const avatar = form.watch('avatar')
  const username = form.watch('username')
  useEffect(() => {
    if (data) {
      const { _id, username, avatar } = data.payload.data
      form.reset({
        username,
        avatar: avatar ?? '',
        id: _id
      })
    }
  }, [form, data])

  const previewAvatar = file ? URL.createObjectURL(file) : avatar

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const handleSubmit = async (values: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return
    try {
      let body = values
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageResult = await useMedia.mutateAsync({ folderType: 'avatar', file: formData })
        const imgUrl = uploadImageResult.payload.data.file_url
        body = {
          ...values,
          avatar: imgUrl
        }
      }

      const result = await updateMeMutation.mutateAsync(body)
      toast({
        description: result.payload.message,
        duration: 1200,
      })
      refetch()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }

  }
  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onReset={reset}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Account information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className='rounded-none'>{username}</AvatarFallback>
                      </Avatar>
                      <input type='file'
                        accept='image/*'
                        className='hidden'
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('https://api.scanorderly.com' + field.name)
                          }
                        }}
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Username</Label>
                      <Input id='name' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Reset
                </Button>
                <Button size='sm' type='submit'>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
