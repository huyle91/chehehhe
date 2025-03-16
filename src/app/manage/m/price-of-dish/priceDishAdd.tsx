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
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useCreateDishRestaurantMutation } from "@/queries/useDishRestaurant";
import {
  CreateRestaurantDish,
  CreateRestaurantDishType,
} from "@/schemaValidations/dish_restaurant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function PriceOfDishAdd({
  id,
  setID,
  setIsCreate,
}: {
  id: string | undefined;
  setID: (values: string | undefined) => void;
  setIsCreate: (values: boolean) => void;
}) {
  const { restaurant } = useAppContext();
  const FormCreatePriceDish = useForm<CreateRestaurantDishType>({
    resolver: zodResolver(CreateRestaurantDish), //use zodResolver to validate
    defaultValues: {
      restaurant: restaurant?._id ?? "",
      dish: id ?? "",
      price: 0,
    },
  });

  const createPriceDish = useCreateDishRestaurantMutation();
  const onSubmit = async (data: CreateRestaurantDishType) => {

    try {
      const dataCreatePriceDish = {
        restaurant: restaurant?._id as string,
        dish: id as string,
        price: data.price,
      };
      const resCreateDishPrice =
        await createPriceDish.mutateAsync(dataCreatePriceDish);
      if (resCreateDishPrice && resCreateDishPrice.payload) {
        setID(undefined);
        FormCreatePriceDish.reset();
        setIsCreate(true);
        toast({
          description: `Dish has been added to the menu successfully!`,
          duration: 1000
        });
      } else {
        toast({
          description: `Error: Unable to add the dish, please try again`,
          duration: 1000,
          variant: "destructive"
        });
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: FormCreatePriceDish.setError,
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
            FormCreatePriceDish.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Create price</DialogTitle>
            <DialogDescription>
              Fields price, Sell is required
            </DialogDescription>
          </DialogHeader>
          <Form {...FormCreatePriceDish}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              onSubmit={FormCreatePriceDish.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormCreatePriceDish.control}
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
              </div>
              <Button type="submit">Add price</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
