import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

export function useCurrentUser() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
