"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Button,
} from "@/shared/ui-kit";
import { classNames } from "@/shared/utils/classNames";

import { Controller, useForm } from "react-hook-form";
import { LoginFormType, loginValidationSchema } from "../lib/validation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useLogin } from "@/shared/api/auth";
import { useAuth } from "@/shared/providers/auth";
import { setAuthTokens } from "@/shared/axios/utils";
import { STORAGE_KEYS } from "@/shared/constants/auth.constants";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const loginMutation = useLogin();
  const { setIsAuth } = useAuth();

  const methods = useForm<LoginFormType>({
    resolver: standardSchemaResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit, setError } = methods;

  const handleLoginSubmit = (data: LoginFormType) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setAuthTokens(data);
        setIsAuth(true);
        localStorage.setItem(STORAGE_KEYS.isAuth, JSON.stringify(true));
      },
      onError: (error) => {
        setError("email", {
          type: "custom",
          message: error.response?.data.error ?? "Something went wrong",
        });
      },
    });
  };

  return (
    <div className={classNames("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLoginSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={field.value}
                      error={fieldState.error?.message}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Controller
                  control={control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Input
                      id="password"
                      type="password"
                      required
                      value={field.value}
                      error={fieldState.error?.message}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
