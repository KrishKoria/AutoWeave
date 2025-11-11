"use Client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  endpoint: z.string().url({ message: "Please Enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
  variable: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
});

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
}

export type HttpRequestFormValues = z.infer<typeof formSchema>;

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: DialogProps) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: defaultValues.endpoint || "",
      body: defaultValues.body || "",
      method: defaultValues.method || "GET",
      variable: defaultValues.variable || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variable: defaultValues.variable || "",
        endpoint: defaultValues.endpoint || "",
        body: defaultValues.body || "",
        method: defaultValues.method || "GET",
      });
    }
  }, [open, defaultValues, form]);

  const watchMethod = form.watch("method");
  const watchVariable = form.watch("variable") || "myApiCall";
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure Settings for HTTP Request Node
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 mt-4"
        >
          <Controller
            control={form.control}
            name="variable"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Variable Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="myApiCall"
                />
                <FieldDescription>
                  Use this name to reference the variable in subsequent nodes :{" "}
                  {`{{${watchVariable}.httpResponse.body}}`}
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="method"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Method</FieldLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select A Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  The Method used to make the HTTP Request
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="endpoint"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Endpoint URL</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                />
                <FieldDescription>
                  Static URL or use {"{{variables}}"} for simple values or{" "}
                  {"{{json variables}}"} to stringify objects
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {showBodyField && (
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Request Body</FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-[120px] font-mono text-small"
                    placeholder={
                      '{\n "userId" : "{{httpResponse.data.id}}", \n "name": "{{httpResponse.data.name}}", \n "items": "{{httpResponse.data.items}}" \n}'
                    }
                  />
                  <FieldDescription>
                    JSON with template variables. Use {"{{variables}}"} for
                    simple values or {"{{json variables}}"} to stringify objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
