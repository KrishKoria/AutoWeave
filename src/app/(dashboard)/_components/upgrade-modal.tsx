"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { useActiveSubscription } from "../_hooks/use-subscriptions";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function UpgradeModal({
  open,
  onOpenChange,
}: UpgradeModalProps) {
  const { subscription, hasActiveSubscription } = useActiveSubscription();

  const handleUpgrade = () => {
    if (!hasActiveSubscription) {
      // No subscription - upgrade to Plus
      authClient.checkout({ slug: "AutoWeave Plus" });
    } else if (
      subscription?.productId === "0e169001-363a-47f3-97c9-eb633b904557"
    ) {
      // Has Plus subscription - upgrade to Pro via Customer Portal
      authClient.customer.portal();
    }
  };

  const upgradePlan = !hasActiveSubscription
    ? "AutoWeave Plus"
    : subscription?.productId === "0e169001-363a-47f3-97c9-eb633b904557"
    ? "AutoWeave Pro"
    : "a higher plan";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
          <AlertDialogDescription>
            To create more workflows, please upgrade to {upgradePlan}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpgrade}>
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
