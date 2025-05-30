interface TreeFiltersProps {
  onFilterEnergySensors: () => void;
  onFilterCriticalStatus: () => void;
  isEnergySensorsActive: boolean;
  isCriticalStatusActive: boolean;
}

export function TreeFilters({
  onFilterEnergySensors,
  onFilterCriticalStatus,
  isEnergySensorsActive,
  isCriticalStatusActive,
}: TreeFiltersProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onFilterEnergySensors}
        className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
          isEnergySensorsActive
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : "bg-gray-100 text-gray-700 border border-gray-200"
        }`}
        aria-pressed={isEnergySensorsActive}
        title="Toggle Energy Sensor Filter"
      >
        <span>Energy Sensor</span>
      </button>
      <button
        type="button"
        onClick={onFilterCriticalStatus}
        className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
          isCriticalStatusActive
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : "bg-gray-100 text-gray-700 border border-gray-200"
        }`}
        aria-pressed={isCriticalStatusActive}
        title="Toggle Critical Status Filter"
      >
        <span>Critical</span>
      </button>
    </div>
  );
}
