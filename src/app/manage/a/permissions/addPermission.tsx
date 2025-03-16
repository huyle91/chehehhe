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
import { APIrequest, APIrequestValues } from "@/constants/type";
import { getMethodAPI, handleErrorApi } from "@/lib/utils";
import {
  useCreatePermissionMutation,
  useGetPermissionModule,
} from "@/queries/usePermission";
import {
  PermissionCrateType,
  PermissionCreate,
} from "@/schemaValidations/permission.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
export default function AddPermission({
  setCreate,
}: {
  setCreate: (values: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data } = useGetPermissionModule();
  const createPermission = useCreatePermissionMutation();
  const FormCreatePermission = useForm<PermissionCrateType>({
    resolver: zodResolver(PermissionCreate),
    defaultValues: {
      name: "",
      api_path: "",
      method: APIrequest.Get,
      module: "",
    },
  });

  const onSubmit = async (data: PermissionCrateType) => {
    if (createPermission.isPending) return;
    try {
      const resCreate = await createPermission.mutateAsync(data);
      if (resCreate && resCreate.payload) {
        setCreate(true);
        FormCreatePermission.reset();
        setOpen(false);
        toast({
          description: resCreate.payload.message,
          duration: 1200,
        });
      } else {
        toast({
          description: "permission already exist",
          duration: 1200,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormCreatePermission.setError,
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
            FormCreatePermission.reset();
          }
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create new permission
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Create new permission</DialogTitle>
            <DialogDescription>All fields is required</DialogDescription>
          </DialogHeader>
          <Form {...FormCreatePermission}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-employee-form"
              onSubmit={FormCreatePermission.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormCreatePermission.control}
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
                  control={FormCreatePermission.control}
                  name="api_path"
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
                <FormField
                  control={FormCreatePermission.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="description">API method</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {APIrequestValues &&
                                APIrequestValues.map((status, index) => (
                                  <SelectItem key={index} value={status}>
                                    {getMethodAPI(status)}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={FormCreatePermission.control}
                  name="module"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="description">API module</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose module" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {data &&
                                data.map((moduleItem, index) => (
                                  <SelectItem
                                    key={index}
                                    value={moduleItem.module}
                                  >
                                    {moduleItem.module}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={createPermission.isPending}>
                {createPermission.isPending && (
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                )}
                Create a permission
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
