"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";
import Image from "next/image";

const FormLogin = () => {
  const { register, handleSubmit } = useForm(); // Add register to useForm
  const router = useRouter();

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result.error) {
      console.error("Login failed:", result.error);
      toast.error("Login failed!");
    } else {
      router.push("/dashboard");
      toast.success("Login successful!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16 md:w-24 md:h-24 ">
          <Image
            src="/logo-umbjm.png"
            alt="UMBJM Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <a className="text-xl text-center text-neutral-50">
          UMBJM Inventory Management
        </a>
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex justify-center">Login</CardTitle>
          <CardDescription>
            Enter your username and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                {...register("username")} // Register the input
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")} // Register the input
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormLogin;
