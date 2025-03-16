"use client";

import { useAppContext } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useUpdateDishRestaurantMutation } from "@/queries/useDishRestaurant";
import {
  UpdateRestaurantDish,
  UpdateRestaurantDishType,
} from "@/schemaValidations/dish_restaurant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function PriceOfDishUpdate({
  id,
  setID,
  objectToEdit,
  isUpdate,
}: {
  id: string | undefined;
  setID: (values: string | undefined) => void;
  objectToEdit: UpdateRestaurantDishType;
  isUpdate: (values: boolean) => void;
}) {
  const { restaurant } = useAppContext()
  const updatePriceDish = useUpdateDishRestaurantMutation();
  const FormUpdatePriceDish = useForm<UpdateRestaurantDishType>({
    resolver: zodResolver(UpdateRestaurantDish), //use zodResolver to validate
    defaultValues: {
      restaurant: "",
      idResDish: "",
      dish: "",
      price: 0,
      isActived: false,
    },
  });

  useEffect(() => {
    const FillForm = () => {
      if (objectToEdit) {
        FormUpdatePriceDish.setValue("price", objectToEdit.price),
          FormUpdatePriceDish.setValue("isActived", objectToEdit.isActived),
          FormUpdatePriceDish.setValue("restaurant", restaurant?._id),
          FormUpdatePriceDish.setValue("dish", objectToEdit.dish),
          FormUpdatePriceDish.setValue("idResDish", objectToEdit.idResDish)
      }
    };
    FillForm();
  }, [objectToEdit, FormUpdatePriceDish, restaurant]);

  const onSubmit = async (data: UpdateRestaurantDishType) => {
    // console.log("beffore",data)

    try {
      if (id) {
        const newDataUpdate = {
          idResDish: objectToEdit.idResDish,
          restaurant: restaurant?._id,
          dish: objectToEdit.dish,
          price: data.price,
          isActived: Boolean(data.isActived),
        };
        const resUpdate = await updatePriceDish.mutateAsync(newDataUpdate);
        if (resUpdate && resUpdate.payload) {
          setID(undefined);
          FormUpdatePriceDish.reset();
          isUpdate(true);
          toast({
            description: 'Update dish successfully',
            duration: 1000,
          });
        } else {
          toast({
            description: "Failed to update price of dish",
            duration: 1000,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormUpdatePriceDish.setError,
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
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Update price of dish</DialogTitle>
            <DialogDescription>
              Fields price, sell is not required
            </DialogDescription>
          </DialogHeader>
          <Form {...FormUpdatePriceDish}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              onSubmit={FormUpdatePriceDish.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormUpdatePriceDish.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Price</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="name" className="w-full" {...field} type="number" />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormUpdatePriceDish.control}
                  name="isActived"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="description">Is in stock</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            } // Convert string to boolean
                            defaultValue={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose status sell" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={"true"}>In stock</SelectItem>
                              <SelectItem value={"false"}>
                                Out of stock
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Update price</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
