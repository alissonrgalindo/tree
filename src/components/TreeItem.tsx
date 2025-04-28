import { useState, useCallback, memo } from "react";
import { TreeNode } from "@/types";
import { StatusIndicator } from "./StatusIndicator";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import LocationIcon from "@/assets/icons/location.svg";
import CubeIcon from "@/assets/icons/cube.svg";
import CodepenIcon from "@/assets/icons/codepen.svg";

export interface ExtendedTreeNode extends TreeNode {
  parentType?: TreeNode["type"];
}

interface TreeItemProps {
  node: ExtendedTreeNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  level?: number;
}

const TreeItemIcon = memo(({ type, isSelected }: { type: TreeNode["type"], isSelected: boolean }) => (
  <img
    src={getIcon(type)}
    alt={type}
    className={`w-[22px] h-[22px] ${isSelected ? "filter brightness-0 invert" : ""}`}
    aria-hidden="true"
  />
));

const ChevronIcon = memo(({ expanded, isSelected }: { expanded: boolean, isSelected: boolean }) => (
  <div className="flex items-center justify-center w-3 h-3">
    <img
      src={ChevronDownIcon}
      alt={expanded ? "Collapse" : "Expand"}
      className={`w-3 h-3 transition-transform duration-300 ${
        expanded ? "rotate-0" : "-rotate-90"
      } ${isSelected ? "filter brightness-0 invert" : ""}`}
      aria-hidden="true"
    />
  </div>
));

const VerticalLine = memo(() => (
  <div className="absolute top-[28px] left-[14px] h-[calc(100%-28px)] w-px bg-gray-200"></div>
));

export const TreeItem = memo(function TreeItem({
  node,
  selectedId,
  onSelect,
  level = 0,
}: TreeItemProps) {
  const [expanded, setExpanded] = useState(level < 2);

  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isLeaf = !hasChildren;
  const isLocation = node.type === "location";
  const isFirstLevel = level === 0;
  const isSecondLevel = level === 1;

  const handleItemClick = useCallback(() => {
    if (isLeaf) {
      onSelect(node.id);
    } else {
      setExpanded((prev) => !prev);
      if (!expanded) {
        onSelect(node.id);
      }
    }
  }, [isLeaf, onSelect, node.id, expanded]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleItemClick();
      } else if (e.key === "ArrowRight" && hasChildren && !expanded) {
        e.preventDefault();
        setExpanded(true);
      } else if (e.key === "ArrowLeft" && hasChildren && expanded) {
        e.preventDefault();
        setExpanded(false);
      }
    },
    [handleItemClick, hasChildren, expanded]
  );

  const marginLeft = level * 8;
  const groupId = `tree-group-${node.id}`;
  
  const itemClasses = `
    flex items-center gap-2 py-1 px-2 pr-2 rounded cursor-pointer 
    transition-colors duration-200
    ${isSelected
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "hover:bg-gray-100"
    } focus:outline-none focus:ring-2 focus:ring-blue-400
  `;

  return (
    <li
      className="relative"
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
      aria-controls={hasChildren ? groupId : undefined}
      data-id={node.id}
    >
      <div
        style={{ marginLeft }}
        className={itemClasses}
        onClick={handleItemClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-selected={isSelected}
        aria-level={level + 1}
        aria-label={`${node.name}, ${node.type}`}
      >
        {hasChildren && <ChevronIcon expanded={expanded} isSelected={isSelected} />}
        {!hasChildren && isSecondLevel && <div className="w-3" />}

        {isLocation && isFirstLevel && <VerticalLine />}

        <TreeItemIcon type={node.type} isSelected={isSelected} />

        <span className="text-sm truncate">{node.name}</span>

        <div className={`${isSelected ? "text-white" : ""}`}>
          <StatusIndicator status={node.status} sensorType={node.sensorType} />
        </div>
      </div>

      {expanded && hasChildren && (
        <ul
          id={groupId}
          className="pl-4 flex flex-col gap-1 transition-all duration-200 ease-in-out mt-1"
          role="group"
        >
          {sortTreeNodes(node.children).map((child) => (
            <TreeItem
              key={child.id}
              node={child as ExtendedTreeNode}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

function getIcon(type: TreeNode["type"]) {
  switch (type) {
    case "location":
      return LocationIcon;
    case "asset":
      return CubeIcon;
    case "component":
      return CodepenIcon;
    default:
      return "";
  }
}

function sortTreeNodes(nodes: TreeNode[]) {
  return [...nodes].sort((a, b) => {
    const order = { location: 0, asset: 1, component: 2 };
    return order[a.type] - order[b.type];
  });
}