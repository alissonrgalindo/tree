import { useQuery } from "@tanstack/react-query";
import { Company } from "@/types";

export function useCompanies() {
  return useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch("https://fake-api.tractian.com/companies");
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    }
  });
}