"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address, please provide a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormData) => {
    console.log("Logging in with data:", data);
  };
  const isPending = form.formState.isSubmitting;
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>
            Please enter your credentials to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form-main"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant={"outline"}
                  className="w-full"
                  type="button"
                  disabled={isPending}
                >
                  Continue with Github
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full"
                  type="button"
                  disabled={isPending}
                >
                  Continue with Google
                </Button>
              </div>
              <div className="grid gap-6">
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="email"
                        className="border rounded-md px-3 py-2"
                        placeholder="m@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        type="password"
                        className="border rounded-md px-3 py-2"
                        placeholder="********"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-small">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="underline underline-offset-4 text-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
