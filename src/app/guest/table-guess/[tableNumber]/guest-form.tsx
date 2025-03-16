"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGuestLoginMutation } from "@/queries/useGuest";
import { toast } from "@/components/ui/use-toast";
import { useAppContext } from "@/components/app-provider";
import { GuestLoginBody, GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import { LoaderCircle } from "lucide-react";
import { handleErrorApi } from "@/lib/utils";

export default function GuestLoginForm() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");
  const router = useRouter();
  const loginMutation = useGuestLoginMutation();
  const { setGuest } = useAppContext();

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      username: '',
      token: token || '',
      table: tableId?.toString() || '',
    }
  });

  useEffect(() => {
    if (!token || !tableId) {
      router.push("/");
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Missing authentication information. Please try again.",
      });
    }
  }, [token, tableId, router]);

  async function onSubmit(values: GuestLoginBodyType) {
    if (loginMutation.isPending) return;

    try {
      const result = await loginMutation.mutateAsync(values);
      setGuest(result.payload.data.guest);
      toast({
        title: "Login Successful",
        description: "Welcome to my hotpot...",
      });
      router.push("/guest/menu");
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Order System Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4 w-full mt-4"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
          >
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="username" className="text-lg">Customer Name</Label>
                      <Input
                        id="username"
                        type="text"
                        required
                        {...field}
                        className="p-3 text-lg h-12"
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={loginMutation.isPending}>
                {loginMutation.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}