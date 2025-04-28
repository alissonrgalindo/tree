import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useAssets, useLocations } from "@/hooks/useAssetsAndLocations";
import { buildTree } from "@/utils/buildTree";
import { filterTree, filterTreeWithCriteria } from "@/utils/filterTree";
import { TreeItem, ExtendedTreeNode } from "./TreeItem";
import { TreeFilters } from "./TreeFilters";

import SearchIcon from "@/assets/icons/search.svg";
import CloseIcon from "@/assets/icons/close.svg";

export function AssetTree({ companyId }: { companyId: string }) {
  const { data: locations, isLoading: loadingLocations } =
    useLocations(companyId);
  const { data: assets, isLoading: loadingAssets } = useAssets(companyId);

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filterEnergySensors, setFilterEnergySensors] = useState(false);
  const [filterCriticalStatus, setFilterCriticalStatus] = useState(false);
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
    let result = filterTree(tree, debouncedSearch) as ExtendedTreeNode[];

    if (filterEnergySensors || filterCriticalStatus) {
      result = filterTreeWithCriteria(result, {
        energySensors: filterEnergySensors,
        criticalStatus: filterCriticalStatus,
      });
    }

    return result;
  }, [tree, debouncedSearch, filterEnergySensors, filterCriticalStatus]);

  const handleFilterEnergySensors = useCallback(() => {
    setFilterEnergySensors((prev) => !prev);
  }, []);

  const handleFilterCriticalStatus = useCallback(() => {
    setFilterCriticalStatus((prev) => !prev);
  }, []);

  useEffect(() => {
    if (selectedId && treeContainerRef.current) {
      const selectedElement = treeContainerRef.current.querySelector(
        `[data-id="${selectedId}"]`
      );
      if (selectedElement) {
        const containerRect = treeContainerRef.current.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();

        if (
          elementRect.top < containerRect.top ||
          elementRect.bottom > containerRect.bottom
        ) {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [selectedId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setSearch("");
        (e.currentTarget as HTMLInputElement).blur();
      }
    },
    []
  );

  if (loadingLocations || loadingAssets) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-gray-500 flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <span>Loading tree...</span>
        </div>
      </div>
    );
  }

  if (filteredTree.length === 0) {
    return (
      <div className="w-[479px] h-full border-r p-4 bg-white border-gray-200">
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search Asset or Location"
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {!search && (
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="absolute right-3 top-3.5 text-gray-400"
              aria-hidden="true"
            />
          )}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600 w-[16px] h-[16px]"
            >
              <img
                src={CloseIcon}
                alt="Close Icon"
                className="absolute right-0 top-0 text-gray-400 w-[16px] h-[16px]"
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <div className="mb-4">
          <TreeFilters
            onFilterEnergySensors={handleFilterEnergySensors}
            onFilterCriticalStatus={handleFilterCriticalStatus}
            isEnergySensorsActive={filterEnergySensors}
            isCriticalStatusActive={filterCriticalStatus}
          />
        </div>

        <div className="text-center py-12 text-gray-500">
          {search || filterEnergySensors || filterCriticalStatus ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No results found</p>
              <p className="text-sm mb-4">
                Try using different filters or search terms
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterEnergySensors(false);
                  setFilterCriticalStatus(false);
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <p className="text-lg">No items available</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[479px] h-full border-r bg-white flex flex-col border-gray-200">
      <div className="px-4 py-4 border border-gray-200 border-r-0">
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar Ativo ou Local"
            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search asset tree"
          />
          {!search && (
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="absolute right-3 top-3.5 text-gray-400"
              aria-hidden="true"
            />
          )}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600 w-[16px] h-[16px]"
            >
              <img
                src={CloseIcon}
                alt="Close Icon"
                className="absolute right-0 top-0 text-gray-400 w-[16px] h-[16px]"
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <div>
          <TreeFilters
            onFilterEnergySensors={handleFilterEnergySensors}
            onFilterCriticalStatus={handleFilterCriticalStatus}
            isEnergySensorsActive={filterEnergySensors}
            isCriticalStatusActive={filterCriticalStatus}
          />
        </div>
      </div>

      <div
        ref={treeContainerRef}
        className="flex-grow overflow-y-auto p-4 pb-16 border border-gray-200 border-t-0 border-r-0"
        style={{
          maxHeight: "calc(100vh - 140px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E0 #F7FAFC",
        }}
      >
        <ul
          className="space-y-1"
          role="tree"
          aria-label="Asset and location tree"
        >
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
