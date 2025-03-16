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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
// import { toast } from "@/components/ui/use-toast";
import { GetColorMethodHelper } from "@/helper/GetColorMethod";
import { handleErrorApi } from "@/lib/utils";
import { useGetPermissionModule } from "@/queries/usePermission";
import { useCreateRoleMutation } from "@/queries/useRole";
import { RoleCreate, RoleCreateType } from "@/schemaValidations/role.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddRole({
  setIsCreated,
}: {
  setIsCreated: (values: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useGetPermissionModule();
  const [listPermission, setListPermission] = useState<
    Array<string> | undefined
  >([]);

  const [checkedModules, setCheckedModules] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedPermissions, setCheckedPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const CreateRole = useCreateRoleMutation();

  const FormCreateRole = useForm<RoleCreateType>({
    resolver: zodResolver(RoleCreate),
    defaultValues: {
      name: "",
      isActived: false,
      description: "",
      permissions: [],
    },
  });

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

        setCheckedPermissions((preCheckPermission: any) => ({
          ...preCheckPermission,
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
        setCheckedPermissions((preObjectCheck: any) => {
          return Object.keys(preObjectCheck).reduce((acc: any, key: string) => {
            if (!values.apiPermissions.some((id: any) => id._id === key)) {
              acc[key] = preObjectCheck[key]; //nếu id hiện tại không tồn tại trong object trước đó thì tiến hành thêm thêm object với this key vô
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

  const onSubmit = async () => {
    if (CreateRole.isPending) return;
    try {
      if (listPermission) {
        FormCreateRole.setValue("permissions", listPermission);
      }
      const data = RoleCreate.parse(FormCreateRole.getValues());
      console.log("datacreate", data);
      const createRole = await CreateRole.mutateAsync(data);
      if (createRole.status == 201) {
        setIsCreated(true);
        FormCreateRole.reset();
        setOpen(false);
        toast({
          description: createRole.payload.message,
          duration: 1200,
        });
      } else {
        toast({
          description: createRole.payload.message,
          duration: 1200,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: FormCreateRole.setError,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occue</div>;
  return (
    <>
      <Dialog
        onOpenChange={(isOpen) => {
          setOpen(isOpen); // Cập nhật state open
          if (!isOpen) {
            FormCreateRole.reset();
          }
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create new Role
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1300px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Create new role</DialogTitle>
            <DialogDescription>All the feild is required</DialogDescription>
          </DialogHeader>
          <Form {...FormCreateRole}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-employee-form"
              onSubmit={FormCreateRole.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <div className="flex gap-3 flex-wrap sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
                  <FormField
                    control={FormCreateRole.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="name">Tên</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Input id="name" className="w-full" {...field} />
                            <FormMessage></FormMessage>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={FormCreateRole.control}
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
                  <FormField
                    control={FormCreateRole.control}
                    name="isActived"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="description">Status</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Select
                              defaultValue={"false"}
                              onValueChange={(val) =>
                                FormCreateRole.setValue(
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
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {/* <FormMessage /> */}
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={FormCreateRole.control}
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
                        {data &&
                          data.map((item: any, index: any) => (
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
                                                <div className="flex items-center justify-center">
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
                                                  <p style={{ margin: "0" }}>
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
              <Button type="submit" disabled={CreateRole.isPending}>
                {CreateRole.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                Add</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
