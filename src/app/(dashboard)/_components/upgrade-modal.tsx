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

const PLUS_PRODUCT_ID = "0e169001-363a-47f3-97c9-eb633b904557";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function UpgradeModal({
  open,
  onOpenChange,
}: UpgradeModalProps) {
  const { subscription, hasActiveSubscription } = useActiveSubscription();

  const isPlusSubscription = subscription?.productId === PLUS_PRODUCT_ID;

  // Check if user has Pro or Enterprise (any subscription that's not Plus)
  const hasProOrHigher = hasActiveSubscription && !isPlusSubscription;

  const handleUpgrade = () => {
    if (!hasActiveSubscription) {
      // No subscription - upgrade to Plus
      authClient.checkout({ slug: "AutoWeave Plus" });
    } else if (isPlusSubscription) {
      // Has Plus subscription - upgrade to Pro via Customer Portal
      authClient.customer.portal();
    } else if (hasProOrHigher) {
      // Has Pro or Enterprise - open Customer Portal to manage subscription
      authClient.customer.portal();
    }
  };

  const upgradePlan = !hasActiveSubscription
    ? "AutoWeave Plus"
    : isPlusSubscription
    ? "AutoWeave Pro"
    : "a higher plan";

  const description = hasProOrHigher
    ? "You're already on a Pro or higher plan. Visit the billing portal to manage your subscription or contact support for Enterprise upgrades."
    : `To create more workflows, please upgrade to ${upgradePlan}.`;

  const buttonText = hasProOrHigher ? "Manage Subscription" : "Upgrade Now";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasProOrHigher ? "Subscription Required" : "Upgrade Required"}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpgrade}>
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
