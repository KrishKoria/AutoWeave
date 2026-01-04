"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  webhookUrl: z
    .string()
    .min(1, { message: "Webhook URL is required" })
    .url({ message: "Please enter a valid URL" }),
  message: z.string().min(1, { message: "Message content is required" }),
  channel: z.string().optional(),
  username: z.string().optional(),
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
  defaultValues?: Partial<SlackFormValues>;
}

export type SlackFormValues = z.infer<typeof formSchema>;

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: DialogProps) => {
  const form = useForm<SlackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: defaultValues.webhookUrl || "",
      message: defaultValues.message || "",
      channel: defaultValues.channel || "",
      username: defaultValues.username || "",
      variable: defaultValues.variable || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        webhookUrl: defaultValues.webhookUrl || "",
        message: defaultValues.message || "",
        channel: defaultValues.channel || "",
        username: defaultValues.username || "",
        variable: defaultValues.variable || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariable = form.watch("variable") || "slackMessage";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Message</DialogTitle>
          <DialogDescription>
            Configure settings to send a message to Slack
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
                  placeholder="slackMessage"
                />
                <FieldDescription>
                  Use this name to reference the response:{" "}
                  {`{{${watchVariable}.success}}`}
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="webhookUrl"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Slack Webhook URL</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="https://hooks.slack.com/services/..."
                  type="url"
                />
                <FieldDescription>
                  Get this from your Slack workspace settings under Apps →
                  Incoming Webhooks
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Message Content</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className="min-h-[120px] font-mono text-sm"
                  placeholder="New submission from {{formResponse.name}}"
                />
                <FieldDescription>
                  Use {"{{variables}}"} for simple values or{" "}
                  {"{{json variables}}"} to stringify objects
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="channel"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Channel (Optional)</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="#general"
                />
                <FieldDescription>
                  Override the default channel (e.g., #general or @username)
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Username (Optional)</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="AutoWeave Bot"
                />
                <FieldDescription>
                  Custom username for the webhook message
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
