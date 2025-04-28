import { useState } from "react";
import { Header } from "@/components/Header";
import { AssetTree } from "@/components/AssetTree";


function App() {
  const [companyId, setCompanyId] = useState<string>("");

  return (
    <div className="flex flex-col h-screen">
      <Header selectedCompanyId={companyId} onSelectCompany={setCompanyId} />
      <main className="flex flex-1 overflow-hidden">
        {companyId ? (
          <AssetTree companyId={companyId} />
        ) : (
          <div className="m-auto text-gray-500">Select a unit</div>
        )}
      </main>
    </div>
  )
}

export default App
