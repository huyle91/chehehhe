"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useGetCategory } from "@/queries/useCategory";
import { useUpdateDishMutation } from "@/queries/useDish";
import { useUploadMediaMutation } from "@/queries/useMedia";
import { CategoryItemsType } from "@/schemaValidations/category.schema";
import {
  UdpateDishForm,
  UpdateDishFormType,
  UpdateDishType,
} from "@/schemaValidations/dish.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function DishEdit({
  id,
  setID,
  objectToEdit,
  isUpdate,
}: {
  id: string | undefined;
  setID: (values: string | undefined) => void;
  objectToEdit: UpdateDishType;
  isUpdate: (values: boolean) => void;
}) {
  const [idCategory, setIdCategory] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [FilterNameCategory, setFilterNameCategory] = useState<string>("");
  const [inputName, setInputName] = useState<string>("");
  const imageInputRefImage = useRef<HTMLInputElement | null>(null);
  const imageInputRefCategory = useRef<HTMLInputElement | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const useMedia = useUploadMediaMutation();
  const updateDish = useUpdateDishMutation();
  const { data: dataCategory, isLoading } = useGetCategory(1, 100, {
    filter: FilterNameCategory
      ? `filter=${encodeURIComponent(JSON.stringify({ name: { $regex: FilterNameCategory, $options: "i" } }))}`
      : "",
    sort: "",
  });

  const FormUpdateDish = useForm<UpdateDishFormType>({
    resolver: zodResolver(UdpateDishForm), //use zodResolver to validate
    defaultValues: {
      name: "",
      description: "",
      dishId: "",
      category: "",
      image: "",
    },
  });

  useEffect(() => {
    const FillForm = () => {
      if (objectToEdit) {
        setIdCategory(objectToEdit.category._id);
        FormUpdateDish.setValue("name", objectToEdit.name),
          FormUpdateDish.setValue("description", objectToEdit.description);
        FormUpdateDish.setValue("dishId", objectToEdit.dishId),
          FormUpdateDish.setValue("category", objectToEdit.category.name);
        FormUpdateDish.setValue("image", objectToEdit.image)
      }
    };
    FillForm();
  }, [objectToEdit]);

  const onSubmit = async (data: UpdateDishFormType) => {
    try {
      if (updateDish.isPending) return;
      if (id) {
        const newDataUpdate = {
          name: data.name,
          description: data.description,
          dishId: id,
          category: idCategory,
          image: data.image,
        };
        let bodyDish = newDataUpdate;
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadImageResult = await useMedia.mutateAsync({
            folderType: "dishes",
            file: formData,
          });
          const imgUrl = uploadImageResult.payload.data.file_url;
          bodyDish = {
            ...newDataUpdate,
            image: imgUrl,
          };
        }

        const resUpdate = await updateDish.mutateAsync(bodyDish);

        // console.log("dataupdatecate", resUpdate);
        if (resUpdate && resUpdate.payload) {
          setID(undefined);
          FormUpdateDish.reset();
          isUpdate(true);
          toast({
            description: "update dish success",
            duration: 1200,
          });
        } else {
          toast({
            description: "update dish failed",
            duration: 1200,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      handleErrorApi({
        error,
        setError: FormUpdateDish.setError,
      });
    }
  };

  const image = FormUpdateDish.watch("image");
  const name = FormUpdateDish.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);

  // Hàm debounce chung
  const handleDebounceSearch = (
    inputValue: string,
    setFilter: (value: string) => void,
    setPopoverOpen: (value: boolean) => void,
    delay: number = 1000
  ) => {
    const debounceTimer = setTimeout(() => {
      setFilter(inputValue); // Cập nhật filter ngay cả khi rỗng
      if (inputValue) {
        setPopoverOpen(true); // Chỉ mở popover nếu có giá trị
      } else {
        setPopoverOpen(false); // Đóng popover khi input rỗng
      }
    }, delay);

    return () => clearTimeout(debounceTimer);
  };

  useEffect(() => {
    const cleanupRes = handleDebounceSearch(
      inputName,
      setFilterNameCategory,
      setIsPopoverOpen,
      1500
    );
    return () => cleanupRes();
  }, [inputName]);

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputName(newValue);
    FormUpdateDish.setValue("category", newValue); // Đồng bộ với form
  };

  // Handle chọn item từ popup
  const handleSelectItem = (item: CategoryItemsType) => {
    setIdCategory(item._id);
    setInputName(item.name);
    FormUpdateDish.setValue("category", item.name); // Cập nhật giá trị form
    setFilterNameCategory(""); // Reset filter để không giữ kết quả cũ
    setIsPopoverOpen(false); // Đóng popover
  };

  return (
    <>
      <Dialog
        open={Boolean(id)}
        onOpenChange={(value) => {
          if (!value) {
            setID(undefined);
            // FormUpdateDish.reset()
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
            <DialogDescription>
              Fields name, Description is not required
            </DialogDescription>
          </DialogHeader>
          <Form {...FormUpdateDish}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-employee-form"
              onSubmit={FormUpdateDish.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={FormUpdateDish.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-start justify-start">
                        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                          <AvatarImage src={previewAvatarFromFile} />
                          <AvatarFallback className="rounded-none">
                            {name || "Avatar"}
                          </AvatarFallback>
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={imageInputRefImage}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFile(file);
                              field.onChange(
                                "https://api.scanorderly.com" + field.name
                              );
                            }
                          }}
                        />
                        <button
                          className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                          type="button"
                          onClick={() => imageInputRefImage.current?.click()}
                        >
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ">
                  <FormField
                    control={FormUpdateDish.control}
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
                    control={FormUpdateDish.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="email">Desciption</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Input id="api" className="w-full" {...field} />
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={FormUpdateDish.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                          <Label htmlFor="search">Category</Label>
                          <div className="col-span-3 w-full space-y-2">
                            <Popover
                              open={isPopoverOpen}
                              onOpenChange={setIsPopoverOpen}
                            >
                              {/* Input tìm kiếm */}
                              <PopoverTrigger className="w-full">
                                <Input
                                  id="search"
                                  className="w-full"
                                  placeholder="input category..."
                                  {...field}
                                  onChange={(e) => {
                                    handleChange(e);
                                    field.onChange(e.target.value); // Đồng bộ với form
                                  }}
                                  ref={imageInputRefCategory}
                                />
                              </PopoverTrigger>
                              <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-60 overflow-auto">
                                {isLoading ? (
                                  <div className="p-2 text-sm text-gray-500">
                                    Finding...
                                  </div>
                                ) : dataCategory &&
                                  dataCategory?.result.length > 0 ? (
                                  dataCategory.result.map(
                                    (item: CategoryItemsType) => (
                                      <div
                                        key={item._id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                          setIdCategory(item._id);
                                          handleSelectItem(item);
                                          field.onChange(item.name); // Cập nhật giá trị form
                                        }}
                                      >
                                        {item.name}
                                      </div>
                                    )
                                  )
                                ) : (
                                  inputName && (
                                    <div className="p-2 text-sm text-gray-500">
                                      cannot find category
                                    </div>
                                  )
                                )}
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={updateDish.isPending}>
                {
                  updateDish.isPending && (
                    <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                  )
                }
                Update
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
