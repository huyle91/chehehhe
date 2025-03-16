'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateEmployeeAccountBody, CreateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { RestaurantType } from '@/schemaValidations/restaurant.schema'
import { RoleItemsType } from '@/schemaValidations/role.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface AddEmployeeProps {
  onSubmitSuccess: (data: CreateEmployeeAccountBodyType) => void;
  addEmployeeProps: {
    roleData: RoleItemsType[];
    restaurantData: RestaurantType[];
  };
}

export default function AddEmployee({ onSubmitSuccess, addEmployeeProps }: AddEmployeeProps) {

  const [open, setOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('https://avatar.iran.liara.run/public/boy')

  const generatePassword = () => {
    const length = 10; // Độ dài password
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
    let password =
      uppercase[Math.floor(Math.random() * uppercase.length)] + // 1 chữ hoa
      lowercase[Math.floor(Math.random() * lowercase.length)] + // 1 chữ thường
      numbers[Math.floor(Math.random() * numbers.length)] +     // 1 số
      symbols[Math.floor(Math.random() * symbols.length)];      // 1 ký tự đặc biệt

    // Sinh thêm các ký tự ngẫu nhiên cho đủ độ dài
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Trộn ngẫu nhiên các ký tự
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const initialPassword = generatePassword();


  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      email: '',
      username: '',
      role: '',
      restaurant: '',
      avatar: avatarUrl,
      password: initialPassword,

    }
  })

  const roleList = addEmployeeProps.roleData || [];

  const restaurantList = addEmployeeProps.restaurantData || [];



  const onSubmit = async (data: CreateEmployeeAccountBodyType) => {
    try {
      await onSubmitSuccess(data);
      setOpen(false);
      form.reset({
        ...form.formState.defaultValues,
        password: generatePassword()
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create new account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create new account</DialogTitle>
          <DialogDescription>Fill all field to create account</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <Input placeholder="Email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <Label>Username</Label>
                  <Input placeholder="Username" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='avatar'
              render={({ field }) => (
                <FormItem>
                  <Label>Gender</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="male"
                        checked={field.value === 'https://avatar.iran.liara.run/public/boy'}
                        onChange={() => {
                          const url = 'https://avatar.iran.liara.run/public/boy'
                          setAvatarUrl(url)
                          field.onChange(url)
                        }}
                      />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="female"
                        checked={field.value === 'https://avatar.iran.liara.run/public/girl'}
                        onChange={() => {
                          const url = 'https://avatar.iran.liara.run/public/girl'
                          setAvatarUrl(url)
                          field.onChange(url)
                        }}
                      />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <Label>Role <span className="text-red-500">*</span></Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleList.filter(role => role.name.toLowerCase() !== 'admin').map((role) => (
                        <SelectItem key={role._id} value={role._id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='restaurant'
              render={({ field }) => (
                <FormItem>
                  <Label>Restaurant <span className="text-red-500">*</span></Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurantList.map((restaurant) => (
                        <SelectItem key={restaurant._id} value={restaurant._id}>{restaurant.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit'
                disabled={form.formState.isSubmitting}
              >
                {
                  form.formState.isSubmitting && (<LoaderCircle className='w-5 h-5 mr-2 animate-spin' />)
                }
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}