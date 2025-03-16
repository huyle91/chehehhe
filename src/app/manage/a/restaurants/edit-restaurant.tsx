"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useUpdateRestaurantMutation } from "@/queries/useRestaurant";
import {
  UpdateRestaurantBody,
  UpdateRestaurantBodyType,
} from "@/schemaValidations/restaurant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function RestaurantsUpdate({
  id,
  setID,
  objectToEdit,
  isUpdate,
}: {
  id: string | undefined;
  setID: (values: string | undefined) => void;
  objectToEdit: UpdateRestaurantBodyType;
  isUpdate: (values: boolean) => void;
}) {
  const updateRestaurant = useUpdateRestaurantMutation();
  const FormUpdateRestaurant = useForm<UpdateRestaurantBodyType>({
    resolver: zodResolver(UpdateRestaurantBody), //use zodResolver to validate
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  useEffect(() => {
    const FillForm = () => {
      if (objectToEdit) {
        FormUpdateRestaurant.setValue("name", objectToEdit.name),
          FormUpdateRestaurant.setValue("address", objectToEdit.address),
          FormUpdateRestaurant.setValue("phone", objectToEdit.phone);
      }
    };
    FillForm();
  }, [objectToEdit]);

  const onSubmit = async (data: UpdateRestaurantBodyType) => {
    try {
      if (updateRestaurant.isPending) return;
      if (id) {
        const newDataUpdate = {
          restaurantsId: id,
          name: data.name,
          address: data.address,
          phone: data.phone,
        };
        const resUpdate = await updateRestaurant.mutateAsync(newDataUpdate);
        if (resUpdate && resUpdate.payload) {
          setID(undefined);
          FormUpdateRestaurant.reset();
          isUpdate(true);
          toast({
            description: "update restaurant success",
            duration: 1200,

          });
        } else {
          toast({
            description: "update restaurant failed",
            duration: 1200,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormUpdateRestaurant.setError,
      });
    }
  };

  return (
    <>
      <Dialog
        open={Boolean(id)}
        onOpenChange={(value) => {
          if (!value) {
            setID(undefined);
            FormUpdateRestaurant.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Update Restaurant</DialogTitle>
            <DialogDescription>
              Fields name, address, Phone is required
            </DialogDescription>
          </DialogHeader>
          <Form {...FormUpdateRestaurant}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              onSubmit={FormUpdateRestaurant.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormUpdateRestaurant.control}
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
                  control={FormUpdateRestaurant.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Address</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="address" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormUpdateRestaurant.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Phone-Number</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="phone" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">
                {updateRestaurant.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                Update
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
