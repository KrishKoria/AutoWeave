import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export function useSubscription() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
}

export const useActiveSubscription = () => {
  const { data: subscriptionState, isLoading, ...rest } = useSubscription();
  const hasActiveSubscription =
    subscriptionState?.activeSubscriptions &&
    subscriptionState.activeSubscriptions.length > 0;
  return {
    subscription: subscriptionState?.activeSubscriptions?.[0],
    isLoading,
    hasActiveSubscription,
    ...rest,
  };
};
