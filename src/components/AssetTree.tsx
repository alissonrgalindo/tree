import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useAssets, useLocations } from "@/hooks/useAssetsAndLocations";
import { buildTree } from "@/utils/buildTree";
import { filterTree, filterTreeWithCriteria } from "@/utils/filterTree";
import { TreeItem, ExtendedTreeNode } from "./TreeItem";
import { TreeFilters } from "./TreeFilters";
import { SearchInput } from "./SearchInput";
import { EmptyState } from "./EmptyState";
import { Loading } from "./Loading";

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

  const isLoading = loadingLocations || loadingAssets;
  const hasFiltersActive = !!search || filterEnergySensors || filterCriticalStatus;

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

  const handleClearSearch = useCallback(() => {
    setSearch("");
  }, []);

  const handleFilterEnergySensors = useCallback(() => {
    setFilterEnergySensors((prev) => !prev);
  }, []);

  const handleFilterCriticalStatus = useCallback(() => {
    setFilterCriticalStatus((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setFilterEnergySensors(false);
    setFilterCriticalStatus(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const FilterControls = (
    <>
      <SearchInput
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
        onClear={handleClearSearch}
      />
      <div className="mb-4">
        <TreeFilters
          onFilterEnergySensors={handleFilterEnergySensors}
          onFilterCriticalStatus={handleFilterCriticalStatus}
          isEnergySensorsActive={filterEnergySensors}
          isCriticalStatusActive={filterCriticalStatus}
        />
      </div>
    </>
  );

  if (filteredTree.length === 0) {
    return (
      <div className="w-[479px] h-full border-r p-4 bg-white border-gray-200">
        {FilterControls}
        <EmptyState 
          hasFiltersActive={hasFiltersActive}
          onClearFilters={handleClearFilters}
        />
      </div>
    );
  }

  return (
    <div className="w-[479px] h-full border-r bg-white flex flex-col border-gray-200">
      <div className="px-4 py-4 border border-gray-200 border-r-0">
        {FilterControls}
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