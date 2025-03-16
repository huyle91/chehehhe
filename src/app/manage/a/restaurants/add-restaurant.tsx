"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useAddRestaurantMutation } from "@/queries/useRestaurant";
import {
  CreateRestaurantBody,
  CreateRestaurantBodyType,
} from "@/schemaValidations/restaurant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
//
export default function RestaurantsAdd({
  setCreate,
}: {
  setCreate: (values: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const createrestaurant = useAddRestaurantMutation();
  const FormCreateRestaurant = useForm<CreateRestaurantBodyType>({
    resolver: zodResolver(CreateRestaurantBody),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  const onSubmit = async (data: CreateRestaurantBodyType) => {
    try {
      if (createrestaurant.isPending) return;
      const resCreate = await createrestaurant.mutateAsync(data);
      if (resCreate && resCreate.payload) {
        setCreate(true);
        FormCreateRestaurant.reset();
        setOpen(false);
        toast({
          description: resCreate.payload.message,
          duration: 1200,

        });
      } else {
        toast({
          description: "Restaurant already exist",
          duration: 1200,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormCreateRestaurant.setError,
      });
    }
  };
  // console.log("module", data);
  return (
    <>
      <Dialog
        onOpenChange={(isOpen) => {
          setOpen(isOpen); // Cập nhật state open
          if (!isOpen) {
            FormCreateRestaurant.reset();
          }
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create new Restaurant
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Create new Restaurant</DialogTitle>
            <DialogDescription>All fields is required</DialogDescription>
          </DialogHeader>
          <Form {...FormCreateRestaurant}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-employee-form"
              onSubmit={FormCreateRestaurant.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormCreateRestaurant.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Name</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="name" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormCreateRestaurant.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Addess</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="api" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormCreateRestaurant.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Phone</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="api" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={createrestaurant.isPending}>
                {createrestaurant.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                Create new restaurant
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
