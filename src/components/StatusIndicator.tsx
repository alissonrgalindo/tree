import React from "react";
import PowerIcon from "@/assets/icons/power.svg";


interface StatusIndicatorProps {
  status?: "operating" | "alert" | "warning" | string | null;
  sensorType?: "energy" | "vibration" | string | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  sensorType,
}) => {
  if (!status && !sensorType) return null;

  if (status && !sensorType) {
    return <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />;
  }

  if (status && sensorType) {
    if (sensorType === "energy") {
      return (
        <img
              src={PowerIcon}
              alt="Power Icon"
              className="w-[9px]"
              aria-hidden="true"
            />
      );
    }

    return <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />;
  }

  return null;
};

function getStatusColor(status: string | null | undefined): string {
  switch (status) {
    case "operating":
      return "bg-green-500";
    case "alert":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
}
