"use client";

import { useAppContext } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import GenerateUniqueHash from "@/helper/GetToken";
import { handleErrorApi } from "@/lib/utils";
import { useAddTableMutation } from "@/queries/useTable";
import {
  TableItemsCreate,
  TableItemsCreateType,
} from "@/schemaValidations/table.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
//
export default function AddTable({
  setCreate,
}: {
  setCreate: (values: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const createTable = useAddTableMutation();
  const { restaurant } = useAppContext();
  const FormCreateTable = useForm<TableItemsCreateType>({
    resolver: zodResolver(TableItemsCreate),
    defaultValues: {
      restaurant_id: "",
      token: "",
      capacity: 0,
      table_number: 0,
      status: "Available",
    },
  });

  const onSubmit = async (data: TableItemsCreateType) => {
    // console.log("data",data)
    try {
      const dataCreate = {
        restaurant_id: restaurant?._id,
        token: GenerateUniqueHash(),
        capacity: data.capacity,
        table_number: data.table_number,
        status: data.status,
      };
      const resCreate = await createTable.mutateAsync(
        dataCreate as TableItemsCreateType
      );
      // console.log("datacreatepermission", resCreate);
      if (resCreate && resCreate.payload) {
        setCreate(true);
        FormCreateTable.reset();
        setOpen(false);
        toast({
          description: resCreate.payload.message,
          duration: 1200,

        });
      } else {
        toast({
          description: "Table already exist",
          duration: 1200,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormCreateTable.setError,
      });
    }
  };

  //   console.log("token", data);
  return (
    <>
      <Dialog
        onOpenChange={(isOpen) => {
          setOpen(isOpen); // Cập nhật state open
          if (!isOpen) {
            FormCreateTable.reset();
          }
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create new Table
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Create new Table</DialogTitle>
            <DialogDescription>All fields is required</DialogDescription>
          </DialogHeader>
          <Form {...FormCreateTable}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-employee-form"
              onSubmit={FormCreateTable.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormCreateTable.control}
                  name="table_number"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Table number</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="name" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormCreateTable.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="email">Capacity</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="api" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormCreateTable.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="description">Status</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose status" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem value="Available">
                                Available
                              </SelectItem>
                              <SelectItem value="Unavailable">
                                Unavailable
                              </SelectItem>
                              <SelectItem value="Occupied">Occupied</SelectItem>
                              <SelectItem value="Cleaning">Cleaning</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                {createTable.isPending ? (
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}



