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
  useGetPermissionModule,
  useUpdatePermissionMutation,
} from "@/queries/usePermission";
import {
  PermissionUpdate,
  PermissionUpdateType,
} from "@/schemaValidations/permission.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditPermission({
  id,
  setID,
  objectToEdit,
  isUpdate,
}: {
  id: string | undefined;
  setID: (values: string | undefined) => void;
  objectToEdit: PermissionUpdateType;
  // setObjectToEdit: (values: PermissionUpdateType) => void;
  isUpdate: (values: boolean) => void;
}) {
  const { data } = useGetPermissionModule();
  const updatePermission = useUpdatePermissionMutation();
  const FormUpdatePermission = useForm<PermissionUpdateType>({
    resolver: zodResolver(PermissionUpdate), //use zodResolver to validate
    defaultValues: {
      name: "",
      api_path: "",
      method: APIrequest.Get,
      module: "",
    },
  });

  useEffect(() => {
    const FillForm = () => {
      if (objectToEdit) {
        FormUpdatePermission.setValue("name", objectToEdit.name),
          FormUpdatePermission.setValue("api_path", objectToEdit.api_path),
          FormUpdatePermission.setValue("method", objectToEdit.method),
          FormUpdatePermission.setValue("module", objectToEdit.module);
      }
    };
    FillForm();
  }, [objectToEdit]);

  const onSubmit = async (data: PermissionUpdateType) => {
    if (updatePermission.isPending) return;
    try {
      if (id) {
        const newDataUpdate = {
          _id: id,
          name: data.name,
          api_path: data.api_path,
          method: data.method,
          module: data.module,
        };
        const resUpdate = await updatePermission.mutateAsync(newDataUpdate);
        console.log("dataupdatepermission", resUpdate);
        if (resUpdate && resUpdate.payload) {
          setID(undefined);
          FormUpdatePermission.reset();
          isUpdate(true)
          toast({
            description: "update permission success",
            duration: 1200,

          });
        } else {
          toast({
            description: "update permission failed",
            duration: 1200,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormUpdatePermission.setError,
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
            FormUpdatePermission.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Update </DialogTitle>
            <DialogDescription>
              Fields name, api, method, module is not required
            </DialogDescription>
          </DialogHeader>
          <Form {...FormUpdatePermission}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              onSubmit={FormUpdatePermission.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormUpdatePermission.control}
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
                  control={FormUpdatePermission.control}
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
                  control={FormUpdatePermission.control}
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
                  control={FormUpdatePermission.control}
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
              <Button type="submit" disabled={updatePermission.isPending}>
                {updatePermission.isPending && (
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
