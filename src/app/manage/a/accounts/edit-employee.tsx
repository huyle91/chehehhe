'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetAccountById } from '@/queries/useAccount'
import { UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { RestaurantType } from '@/schemaValidations/restaurant.schema'
import { RoleItemsType } from '@/schemaValidations/role.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface EditEmployeeProps {
  id?: string;
  onSubmitSuccess: (data: UpdateEmployeeAccountBodyType & { id: string }) => void;
  employeeProps: {
    roleData: RoleItemsType[];
    restaurantData: RestaurantType[];
  };
}

export default function EditEmployee({ id, onSubmitSuccess, employeeProps }: EditEmployeeProps) {
  const [open, setOpen] = useState(false);
  
  const { data: accountData } = useGetAccountById(id || '');

  console.log(accountData)

  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      email: '',
      username: '',
      role: '',
      restaurant: '',
    }
  });

  // const {username, email, role, restaurant} = accountData || {}

  

  useEffect(() => {
    if (accountData) {
      form.reset({
        email: accountData?.data?.email,
        username: accountData?.data?.username,
        role: accountData?.data?.role?._id,
        restaurant: accountData?.data?.restaurant._id,
      });
    }
  }, [accountData, form]);

   // Open dialog when id changes
   useEffect(() => {
    if (id) setOpen(true);
    else setOpen(false);
  }, [id]);

  const roleList = employeeProps.roleData;
  const restaurantList = employeeProps.restaurantData;

  const onSubmit = async (data: UpdateEmployeeAccountBodyType) => {
    if (!id) return;
    try {
      await onSubmitSuccess({ ...data, id });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      console.log("open", open);
      setOpen(open);
      if (!open) form.reset();
    }}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update account</DialogTitle>
          <DialogDescription> all field is require if you change</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
              name='role'
              render={({ field }) => (
                <FormItem>
                  <Label>Role</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleList.filter(role => role.name.toLowerCase() !== 'admin')
                        .map((role) => (
                          <SelectItem key={role._id} value={role._id}>
                            {role.name}
                          </SelectItem>
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
                  <Label>Restaurant</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurantList.map((restaurant) => (
                        <SelectItem key={restaurant._id} value={restaurant._id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit'>
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 