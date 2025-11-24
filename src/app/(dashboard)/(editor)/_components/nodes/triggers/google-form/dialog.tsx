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
import { generateGoogleFormScript } from "./utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormDialog = ({ open, onOpenChange }: DialogProps) => {
  const params = useParams();
  const workflowId = params.workflowID as string;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const webHookURL = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;
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
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use This Webhook URL to connect your Google Form's Apps Script to
            trigger this flow upon form submission.
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
              <li>Create a Google Form</li>
              <li>
                Open the form, click on the three dots (More) in the top right
                corner, and select "Script editor."
              </li>
              <li>In the Script editor, paste the provided Apps Script code</li>
              <li>
                Replace the WEBHOOK_URL with the provided Webhook URL above and
                save the script.
              </li>
              <li>
                Set up a trigger in the Script editor by selecting "Triggers"
                &gt; "Add Triggers" to run the function on form submission.
              </li>
              <li>
                Authorize the script to access your Google Form when prompted.
              </li>
              <li>
                Submit a test response to your Google Form to ensure the webhook
                is working correctly.
              </li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Google Apps Script Code</h4>
            <Button
              type="button"
              variant={"outline"}
              onClick={async () => {
                const script = generateGoogleFormScript(webHookURL);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Script copied to clipboard");
                } catch (error) {
                  toast.error("Failed to copy script");
                }
              }}
            >
              <CopyIcon className="size-4 mr-2" />
              Copy Script to Clipboard
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook url and handles form submissions
            </p>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleFormData.respondentEmail}}"}
                </code>
                - The email address of the form respondent (if collected).
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleFormData.responses['Question Name']}}"}
                </code>
                - The response to a specific question, replace 'Question Name'
                with the actual question title.
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json googleFormData.responses}}"}
                </code>
                - A JSON object containing all question-response pairs from the
                form submission.
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
