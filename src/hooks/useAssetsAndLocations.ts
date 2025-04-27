import { useQuery } from "@tanstack/react-query";

export function useLocations(companyId: string) {
  return useQuery({
    queryKey: ["locations", companyId],
    queryFn: async () => {
      const res = await fetch(`https://fake-api.tractian.com/companies/${companyId}/locations`);
      if (!res.ok) throw new Error("Failed to fetch locations");
      return res.json();
    },
    enabled: !!companyId
  });
}

export function useAssets(companyId: string) {
  return useQuery({
    queryKey: ["assets", companyId],
    queryFn: async () => {
      const res = await fetch(`https://fake-api.tractian.com/companies/${companyId}/assets`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      return res.json();
    },
    enabled: !!companyId
  });
}
