"use client";

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
import { useUpdateCategoryMutation } from "@/queries/useCategory";
import { categoryUpdate, CategoryUpdateType } from "@/schemaValidations/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function UpdateCategory({
  id,
  setID,
  objectToEdit,
  isUpdate,
}: {
  id: string | undefined;
  setID: (values: string | undefined) => void;
  objectToEdit: CategoryUpdateType;
  isUpdate: (values: boolean) => void;
}) {

  const updateCategory = useUpdateCategoryMutation();
  const FormUpdateCategory = useForm<CategoryUpdateType>({
    resolver: zodResolver(categoryUpdate), //use zodResolver to validate
    defaultValues: {
      name: "",
      description: ""
    },
  });

  useEffect(() => {
    const FillForm = () => {
      if (objectToEdit) {
        FormUpdateCategory.setValue("name", objectToEdit.name),
          FormUpdateCategory.setValue("description", objectToEdit.description)
      }
    };
    FillForm();
  }, [objectToEdit]);

  const onSubmit = async (data: CategoryUpdateType) => {
    try {
      if (updateCategory.isPending) return;
      if (id) {
        const newDataUpdate = {
          categoryId: id,
          name: data.name,
          description: data.description
        };
        const resUpdate = await updateCategory.mutateAsync(newDataUpdate);
        if (resUpdate && resUpdate.payload) {
          setID(undefined);
          FormUpdateCategory.reset();
          isUpdate(true)
          toast({
            description: "Update category success",
            duration: 1200,
          });
        } else {
          toast({
            description: "Update category failed",
            duration: 1200,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormUpdateCategory.setError,
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
            FormUpdateCategory.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
            <DialogDescription>
              Fields name, Description is not required
            </DialogDescription>
          </DialogHeader>
          <Form {...FormUpdateCategory}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              onSubmit={FormUpdateCategory.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormUpdateCategory.control}
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
                  control={FormUpdateCategory.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Api-path</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="api" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={updateCategory.isPending}>
                {updateCategory.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                Update</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
