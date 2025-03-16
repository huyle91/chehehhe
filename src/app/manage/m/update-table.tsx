"use client";

import { QRCodeTable } from "@/components/QRCodeTable";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import GenerateUniqueHash from "@/helper/GetToken";
import { GetTableLink } from "@/helper/GetUrlQrOrder";
import { handleErrorApi } from "@/lib/utils";
import { useUpdateTableMutation } from "@/queries/useTable";
import {
  TableItemsUdpateType,
  TableItemsUpdate,
  TableItemType,
} from "@/schemaValidations/table.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function TableUpdate({
  id,
  setID,
  objectToEdit,
}: {
  id: string | undefined;
  setID: (values: string | undefined) => void;
  objectToEdit: TableItemType;
}) {
  const [changeToken, setChangeToken] = useState<boolean | undefined>(false);
  const updateTable = useUpdateTableMutation();
  const FormUpdateTable = useForm<TableItemsUdpateType>({
    resolver: zodResolver(TableItemsUpdate), //use zodResolver to validate
    defaultValues: {
      tableId: "",
      restaurant_id: "",
      capacity: 0,
      table_number: 0,
      status: "",
      token: "",
    },
  });

  useEffect(() => {
    const FillForm = () => {
      if (objectToEdit) {
        FormUpdateTable.setValue("capacity", objectToEdit.capacity),
          FormUpdateTable.setValue("status", objectToEdit.status),
          FormUpdateTable.setValue("table_number", objectToEdit.table_number);
      }
    };
    FillForm();
  }, [objectToEdit]);

  const onSubmit = async (data: TableItemsUdpateType) => {
    try {
      if (id) {
        const newDataUpdate = {
          tableId: objectToEdit._id,
          restaurant_id: objectToEdit.restaurant_id._id,
          capacity: data.capacity,
          table_number: data.table_number,
          status: data.status,
          token: changeToken ? GenerateUniqueHash() : objectToEdit.token,
        };
        const resUpdate = await updateTable.mutateAsync(newDataUpdate);
        if (resUpdate && resUpdate.payload) {
          setID(undefined);
          FormUpdateTable.reset();
          toast({
            description: "update table success",
            duration: 1200,

          });
        } else {
          toast({
            description: "update table failed",
            duration: 1200,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormUpdateTable.setError,
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
            FormUpdateTable.reset();
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
          <Form {...FormUpdateTable}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-employee-form"
              onSubmit={FormUpdateTable.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormUpdateTable.control}
                  name="table_number"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Table number</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="name"
                            className="w-full"
                            {...field}
                            readOnly
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormUpdateTable.control}
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
                  control={FormUpdateTable.control}
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

                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="price">Change QR code</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="changeToken"
                          checked={changeToken as boolean}
                          onCheckedChange={() =>
                            setChangeToken((preState) => !preState)
                          }
                        />
                      </div>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label>QR Code</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <QRCodeTable
                        token={
                          objectToEdit ? (objectToEdit.token as string) : ""
                        }
                        tableNumber={
                          objectToEdit
                            ? (objectToEdit.table_number as number)
                            : 0
                        }
                        tableId={
                          objectToEdit ? (objectToEdit._id as string) : ""
                        }
                      />
                    </div>
                  </div>
                </FormItem>
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label>URL Order</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Link
                        href={GetTableLink({
                          token: objectToEdit
                            ? (objectToEdit.token as string)
                            : "",
                          tableNumber: objectToEdit
                            ? (objectToEdit.table_number as number)
                            : 0,
                          tableId: objectToEdit
                            ? (objectToEdit._id as string)
                            : "",
                        })}
                        target="_blank"
                        className="break-all"
                      >
                        {GetTableLink({
                          token: objectToEdit
                            ? (objectToEdit.token as string)
                            : "",
                          tableNumber: objectToEdit
                            ? (objectToEdit.table_number as number)
                            : 0,
                          tableId: objectToEdit
                            ? (objectToEdit._id as string)
                            : "",
                        })}{" "}
                      </Link>
                    </div>
                  </div>
                </FormItem>
              </div>
              <Button type="submit" className="w-full">
                {updateTable.isPending ? (
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  "Udpate"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
