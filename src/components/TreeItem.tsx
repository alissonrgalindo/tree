import { useState, useMemo, useCallback } from "react";
import { TreeNode } from "@/types";
import { StatusIndicator } from "./StatusIndicator";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import LocationIcon from "@/assets/icons/location.svg";
import CubeIcon from "@/assets/icons/Cube.svg";
import CodepenIcon from "@/assets/icons/Codepen.svg";

export interface ExtendedTreeNode extends TreeNode {
  parentType?: TreeNode["type"];
}

interface TreeItemProps {
  node: ExtendedTreeNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  level?: number;
}

export function TreeItem({ node, selectedId, onSelect, level = 0 }: TreeItemProps) {
  const [expanded, setExpanded] = useState(level < 2);
  
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isLeaf = !hasChildren;

  const { hasSelectedDescendant, selectedDescendantIndex } = useMemo(() => {
    const hasSelected = node.children.some(
      (child) => child.id === selectedId || hasAnySelected(child, selectedId)
    );
    
    const index = hasSelected 
      ? node.children.findIndex(
          (child) => child.id === selectedId || hasAnySelected(child, selectedId)
        )
      : -1;
    
    return { hasSelectedDescendant: hasSelected, selectedDescendantIndex: index };
  }, [node.children, selectedId]);

  const verticalLineConfig = useMemo(() => {
    const shouldShowForLocation = node.type === "location" && hasChildren && expanded;
    
    const shouldShowForAsset = node.type === "asset" && hasSelectedDescendant;
    
    const shouldShow = shouldShowForLocation || shouldShowForAsset;
    
    let height = 0;
    if (node.type === "asset" && hasSelectedDescendant && selectedDescendantIndex !== -1) {
      height = 22 * (selectedDescendantIndex + 1);
    }
    
    return {
      shouldShow,
      height: height || undefined,
      bottom: node.type === "location" ? 0 : undefined
    };
  }, [node.type, expanded, hasChildren, hasSelectedDescendant, selectedDescendantIndex]);

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [handleItemClick, hasChildren, expanded]);

  return (
    <li 
      className="relative pl-1" 
      role="treeitem" 
      aria-expanded={hasChildren ? expanded : undefined}
      data-id={node.id}
    >
      {verticalLineConfig.shouldShow && (
        <div
          className="absolute left-[17px] top-6 w-px bg-gray-200"
          style={{
            height: verticalLineConfig.height,
            bottom: verticalLineConfig.bottom,
          }}
        />
      )}

      {node.type === "component" && isSelected && node.parentType === "asset" && (
        <div className="absolute left-[-2px] top-1/2 w-[26px] h-px bg-gray-200" />
      )}

      <div
        className={`flex items-center gap-2 py-1 px-2 pr-2 rounded cursor-pointer ${
          isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-100"} ${level > 1 && "ml-5"}`}
        onClick={handleItemClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-selected={isSelected}
        aria-level={level + 1}
        aria-label={`${node.name}, ${node.type}`}
      >
        {hasChildren && (
          <div className="flex items-center justify-center w-3 h-3">
            <img
              src={ChevronDownIcon}
              alt={expanded ? "Collapse" : "Expand"}
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
              aria-hidden="true"
            />
          </div>
        )}
        {!hasChildren && level === 1 && <div className="w-3" />}

        <img
          src={getIcon(node.type)}
          alt={node.type}
          className={`w-[22px] h-[22px] ${isSelected ? "filter brightness-0 invert" : ""}`}
          aria-hidden="true"
        />

        <span className="text-sm truncate">{node.name}</span>
        
        <div className="flex-grow"></div>
        
        <div className={`${isSelected ? "text-white" : ""}`}>
          <StatusIndicator status={node.status} sensorType={node.sensorType} />
        </div>
      </div>

      {expanded && hasChildren && (
        <ul className="pl-4 flex flex-col gap-1" role="group">
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
}

function getIcon(type: TreeNode["type"]) {
  switch (type) {
    case "location": return LocationIcon;
    case "asset": return CubeIcon;
    case "component": return CodepenIcon;
    default: return "";
  }
}

function sortTreeNodes(nodes: TreeNode[]) {
  return [...nodes].sort((a, b) => {
    const order = { location: 0, asset: 1, component: 2 };
    return order[a.type] - order[b.type];
  });
}

function hasAnySelected(node: TreeNode, selectedId: string | null): boolean {
  if (node.id === selectedId) return true;
  return node.children.some((child) => hasAnySelected(child, selectedId));
}