import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useAssets, useLocations } from "@/hooks/useAssetsAndLocations";
import { buildTree } from "@/utils/buildTree";
import { filterTree } from "@/utils/filterTree";
import { TreeItem, ExtendedTreeNode } from "./TreeItem";

export function AssetTree({ companyId }: { companyId: string }) {
  const { data: locations, isLoading: loadingLocations } = useLocations(companyId);
  const { data: assets, isLoading: loadingAssets } = useAssets(companyId);

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const treeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const tree = useMemo(() => {
    if (!locations || !assets) return [];
    return buildTree(locations, assets);
  }, [locations, assets]);

  const filteredTree = useMemo(() => {
    return filterTree(tree, debouncedSearch) as ExtendedTreeNode[];
  }, [tree, debouncedSearch]);

  useEffect(() => {
    if (selectedId && treeContainerRef.current) {
      const selectedElement = treeContainerRef.current.querySelector(`[data-id="${selectedId}"]`);
      if (selectedElement) {
        const containerRect = treeContainerRef.current.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();
        
        if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [selectedId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearch("");
      (e.currentTarget as HTMLInputElement).blur();
    }
  }, []);

  if (loadingLocations || loadingAssets) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-gray-500 flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <span>Carregando árvore...</span>
        </div>
      </div>
    );
  }

  if (filteredTree.length === 0) {
    return (
      <div className="w-[479px] h-full border-r p-4 bg-white">
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar Ativo ou Local"
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg 
            className="absolute left-2.5 top-2.5 text-gray-400" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="text-center py-12 text-gray-500">
          {search ? (
            <>
              <p className="text-lg mb-2">Nenhum resultado encontrado</p>
              <p className="text-sm">Tente usar termos diferentes na busca</p>
            </>
          ) : (
            <p className="text-lg">Nenhum item disponível</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[479px] h-full border-r bg-white flex flex-col border-gray-200">
      <div className="px-4 py-4 border border-gray-200 border-r-0">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar Ativo ou Local"
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Buscar na árvore de ativos"
          />
          <svg 
            className="absolute left-2.5 top-2.5 text-gray-400" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              aria-label="Limpar busca"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div 
        ref={treeContainerRef}
        className="flex-grow overflow-y-auto p-4 pb-16 border border-gray-200 border-t-0 border-r-0"
        style={{ 
          maxHeight: 'calc(100vh - 80px)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC'
        }}
      >
        <ul className="space-y-1" role="tree" aria-label="Árvore de ativos e locais">
          {filteredTree.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}