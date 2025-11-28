"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeDialog = ({ open, onOpenChange }: DialogProps) => {
  const params = useParams();
  const workflowId = params.workflowID as string;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const webHookURL = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webHookURL);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use This Webhook URL to connect your Stripe account to trigger this
            flow upon relevant events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className=" flex gap-2">
              <Input
                id="webhook-url"
                value={webHookURL}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={copyToClipboard} type="button">
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup Instructions</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard</li>
              <li>Navigate to Developers &gt; Webhooks &gt; Add endpoint</li>
              <li>
                Paste the copied Webhook URL above into the "Endpoint URL"
                field.
              </li>
              <li>
                Select the specific events you want to listen for (e.g.,
                payment_intent.succeeded), or choose to listen to all events.
              </li>
              <li>
                Copy and Save the signing secret provided by Stripe after
                creating the webhook endpoint. You will need this to verify
                incoming events.
              </li>
            </ol>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>
                : The amount involved in the Stripe event.
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>
                : The currency used in the Stripe event.
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>
                : The ID of the customer associated with the event.
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>
                : The type of Stripe event that triggered the webhook.
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>
                : The full JSON payload of the Stripe event.
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
