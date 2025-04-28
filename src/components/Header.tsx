import { useCompanies } from "@/hooks/useCompanies";

interface HeaderProps {
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
}

export function Header({ selectedCompanyId, onSelectCompany }: HeaderProps) {
  const { data: companies, isLoading } = useCompanies();

  if (isLoading) return <div>Loading companies...</div>;

  return (
    <header className="flex items-center justify-between p-4 bg-blue-700 text-white">
      <h1 className="text-lg font-bold">Tractian Assets</h1>
      <div className="flex gap-2">
        {companies?.map((company) => (
          <button
            key={company.id}
            onClick={() => onSelectCompany(company.id)}
            className={`px-3 py-1 rounded ${selectedCompanyId === company.id ? 'bg-blue-900' : 'bg-blue-600'}`}
          >
            {company.name} Unit
          </button>
        ))}
      </div>
    </header>
  );
}