interface EmptyStateProps {
  hasFiltersActive: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasFiltersActive, onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      {hasFiltersActive ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No results found</p>
          <p className="text-sm mb-4">
            Try using different filters or search terms
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-blue-600 hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <p className="text-lg">No items available</p>
      )}
    </div>
  );
}