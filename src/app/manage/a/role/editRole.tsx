"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { GetColorMethodHelper } from "@/helper/GetColorMethod";
import { handleErrorApi } from "@/lib/utils";
import { useGetPermissionModule } from "@/queries/usePermission";
import { useGetRoleByID, useUpdateRoleMutation } from "@/queries/useRole";
import { RoleUpdate, RoleUpdateType } from "@/schemaValidations/role.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
export default function EditRole({
  id,
  setId,
  isUpdateRole,
}: {
  id?: string | undefined;
  setId: (value: string | undefined) => void;
  onSubmitSuccess?: () => void;
  isUpdateRole: (values: boolean) => void;
}) {
  const { data: dataPermission, isLoading } = useGetPermissionModule();
  const { data: dataRoleID, isSuccess } = useGetRoleByID(id ?? "");

  const [listPermission, setListPermission] = useState<
    Array<string> | undefined
  >();
  // const [listOldPermission,setlistOldPermission] = useState<Array<object>>(dataRoleID?.payload.data.result.permissions ?? [])

  const [checkedModules, setCheckedModules] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedPermissions, setCheckedPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const FormUpdateRole = useForm<RoleUpdateType>({
    resolver: zodResolver(RoleUpdate),
    defaultValues: {
      name: "",
      isActived: false,
      description: "",
      permissions: [],
    },
  });
  const updateRole = useUpdateRoleMutation();
  const onSubmit = async () => {
    if (updateRole.isPending) return;
    try {
      if (listPermission) {
        FormUpdateRole.setValue("permissions", listPermission);
      }
      const data = {
        _id: id as string,
        name: FormUpdateRole.getValues("name"),
        isActived: FormUpdateRole.getValues("isActived") as boolean,
        description: FormUpdateRole.getValues("description") as string,
        permissions: FormUpdateRole.getValues("permissions"),
      };

      const UpdateRole = await updateRole.mutateAsync(data);
      if (UpdateRole.status == 200) {
        FormUpdateRole.reset();
        setId(undefined);
        isUpdateRole(true);
        toast({
          description: UpdateRole.payload.message,
          duration: 1200,
        });
      }
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: FormUpdateRole.setError,
      });
    }
  };

  const handleAddPermissionFollowModule = (values: any) => {
    setCheckedModules((prev) => {
      const isModuleChecked = !prev[values.module];

      // Nếu module được chọn, thêm tất cả các permission vào listPermission
      if (isModuleChecked) {
        const newCheckedPermissions = values.apiPermissions.reduce(
          (acc: any, permission: any) => {
            acc[permission._id] = true;
            return acc;
          },
          {}
        );

        setCheckedPermissions((preCheckPermissions: any) => ({
          ...preCheckPermissions,
          ...newCheckedPermissions,
        }));

        // Thêm tất cả các permission của module vào listPermission
        setListPermission((preIDPer: any) => {
          const updatePreIDPer = preIDPer || [];
          const allPermissions = values.apiPermissions.map(
            (permission: any) => permission._id
          );

          // Lọc bỏ các permission đã có trong updatePreIDPer
          const uniquePermissions = allPermissions.filter(
            (permission: any) => !updatePreIDPer.includes(permission)
          );

          // Thêm các permission mới vào listPermission mà không trùng lặp
          return [...updatePreIDPer, ...uniquePermissions];
        });
      } else {
        // Chỉ xóa các permissions của module hiện tại khỏi checkedPermissions
        setCheckedPermissions((prevChecked: any) => {
          return Object.keys(prevChecked).reduce((acc: any, key: string) => {
            if (!values.apiPermissions.some((id: any) => id._id === key)) {
              acc[key] = prevChecked[key];
            }
            return acc;
          }, {});
        });

        // Xóa tất cả permission của module khỏi listPermission khi module bị tắt
        setListPermission((preIDPer: any) => {
          const updatePreIDPer = preIDPer || [];
          const allPermissions = values.apiPermissions.map(
            (permission: any) => permission._id
          );
          return updatePreIDPer.filter(
            (id: string) => !allPermissions.includes(id)
          ); // Loại bỏ tất cả permission của module
        });
      }

      return {
        ...prev,
        [values.module]: isModuleChecked,
      };
    });
  };

  const handleAddPermissionFollowMethod = (values: string, module: string) => {
    setCheckedModules((prev) => {
      const updatedModules = { ...prev };
      delete updatedModules[module]; // Tắt module chỉ tại vị trí này
      return updatedModules;
    });
    setCheckedPermissions((prev) => ({
      // Lưu trạng thái của từng permission
      ...prev,
      [values]: !prev[values], // Tắt hoặc bật permission cụ thể
    }));

    setListPermission((preIDPer: any) => {
      if (preIDPer && preIDPer.includes(values)) {
        // Nếu permission đã có trong listPermission, xóa nó khỏi danh sách
        return preIDPer.filter((id: string) => id !== values);
      } else {
        // Nếu permission chưa có trong listPermission, thêm nó vào danh sách
        return [...preIDPer, values];
      }
    });
  };
  const getData = (dataRes: any) => {
    if (dataRes) {
      FormUpdateRole.reset({
        name: dataRes.data.name,
        isActived: dataRes.data.isActived,
        description: dataRes.data.description,
      });
      if (dataRes.data.permissions) {
        const newCheckedModules = dataRes.data.permissions.reduce(
          (acc: any, permission: any) => {
            acc[permission.module] = true;
            return acc;
          },
          {}
        );
        setCheckedModules(newCheckedModules);
        const newCheckedPermissions = dataRes.data.permissions.reduce(
          (acc: any, permission: any) => {
            acc[permission._id] = true;
            return acc;
          },
          {}
        );
        setCheckedPermissions(newCheckedPermissions);
        const allPermissions = dataRes.data.permissions.map(
          (permission: any) => permission._id
        );
        setListPermission(allPermissions);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      getData(dataRoleID?.payload);
    }
  }, [id, dataRoleID, isSuccess]);

  if (isLoading) {
    return <div>loading......</div>;
  }

  return (
    <>
      <Dialog
        open={Boolean(id)}
        onOpenChange={(value) => {
          if (!value) {
            setId(undefined);
            FormUpdateRole.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[1300px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Update </DialogTitle>
            <DialogDescription>
              All feilds name, api, method, module is not require
            </DialogDescription>
          </DialogHeader>
          <Form {...FormUpdateRole}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-employee-form"
              onSubmit={FormUpdateRole.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <div className="flex gap-3 flex-wrap sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
                  <FormField
                    control={FormUpdateRole.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="name">Name</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Input id="name" className="w-full" {...field} />
                            <FormMessage></FormMessage>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={FormUpdateRole.control}
                    name="isActived"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="description">Status</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Select
                              value={String(
                                FormUpdateRole.getValues("isActived")
                              )}
                              onValueChange={(val) =>
                                FormUpdateRole.setValue(
                                  "isActived",
                                  val === "true"
                                )
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="choose status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem
                                  value="true"
                                  className="text-green-500"
                                >
                                  Active
                                </SelectItem>
                                <SelectItem
                                  value="false"
                                  className="text-red-500"
                                >
                                  In active
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {/* <FormMessage /> */}
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={FormUpdateRole.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="email">Description</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Input id="module" className="w-full" {...field} />
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={FormUpdateRole.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                      <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                          <CardTitle>Permissions</CardTitle>
                          <CardDescription>
                            Permission is used with this role
                          </CardDescription>
                        </CardHeader>
                        {dataPermission &&
                          dataPermission.map((item: any, index: any) => (
                            <CardContent key={index}>
                              <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                  <AccordionTrigger>
                                    {item.module}
                                  </AccordionTrigger>
                                  <Switch
                                    checked={!!checkedModules[item.module]}
                                    id={`permission-${item.module}`}
                                    onClick={() =>
                                      handleAddPermissionFollowModule(item)
                                    }
                                  />
                                  <AccordionContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                      {item.apiPermissions.map(
                                        (itemPermission: any, index: any) => {
                                          return (
                                            <Card
                                              key={index}
                                              x-chunk="dashboard-06-chunk-0"
                                              style={{ marginTop: "5px" }}
                                            >
                                              <CardContent className="grid grid-cols-[4fr_8fr] justify-items-center align-items-center pt-4 gap-2 sm:grid-cols-[1fr_2fr] md:grid-cols-[2fr_10fr]">
                                                <div className=" flex items-center justify-center">
                                                  <Switch
                                                    checked={
                                                      !!checkedPermissions[
                                                      itemPermission._id
                                                      ]
                                                    }
                                                    onClick={() =>
                                                      handleAddPermissionFollowMethod(
                                                        itemPermission._id,
                                                        item.module
                                                      )
                                                    }
                                                    id={`permission-module-${itemPermission._id}`}
                                                  />
                                                </div>
                                                <div
                                                  style={{ marginLeft: "5px" }}
                                                >
                                                  <p style={{ margin: "0" }}>
                                                    {itemPermission.name}
                                                  </p>
                                                  <p
                                                    style={{
                                                      margin: "0",
                                                      // overflow: "hidden",
                                                      // textOverflow:"ellipsis",
                                                      // width:"20px"
                                                    }}
                                                  >
                                                    <GetColorMethodHelper
                                                      method={
                                                        itemPermission.method
                                                      }
                                                    />
                                                  </p>
                                                  <p>
                                                    {itemPermission.api_path}
                                                  </p>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          );
                                        }
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </CardContent>
                          ))}
                      </Card>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={updateRole.isPending}>
                {updateRole.isPending && (
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                )}
                Update</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
