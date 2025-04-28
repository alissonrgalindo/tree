import { ExtendedTreeNode } from "@/utils/buildTree";

export function filterTree(
  nodes: ExtendedTreeNode[],
  search: string
): ExtendedTreeNode[] {
  if (!search.trim()) return nodes;

  const lowerSearch = search.toLowerCase();

  function filterNode(node: ExtendedTreeNode): ExtendedTreeNode | null {
    const matches = node.name.toLowerCase().includes(lowerSearch);
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is ExtendedTreeNode => child !== null);

    if (matches || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }

  return nodes.map(filterNode).filter((n): n is ExtendedTreeNode => n !== null);
}

interface FilterCriteria {
  energySensors: boolean;
  criticalStatus: boolean;
}

export function filterTreeWithCriteria(
  nodes: ExtendedTreeNode[],
  criteria: FilterCriteria
): ExtendedTreeNode[] {
  if (!criteria.energySensors && !criteria.criticalStatus) {
    return nodes;
  }

  function nodeOrDescendantsMatch(node: ExtendedTreeNode): boolean {
    const matchesEnergySensor =
      criteria.energySensors && node.sensorType === "energy";
    const matchesCriticalStatus =
      criteria.criticalStatus && node.status === "alert";

    if (matchesEnergySensor || matchesCriticalStatus) {
      return true;
    }

    return node.children.some((child) =>
      nodeOrDescendantsMatch(child as ExtendedTreeNode)
    );
  }

  function buildPathToMatchingNodes(
    node: ExtendedTreeNode
  ): ExtendedTreeNode | null {
    if (nodeOrDescendantsMatch(node)) {
      const filteredChildren = node.children
        .map((child) => buildPathToMatchingNodes(child as ExtendedTreeNode))
        .filter((child): child is ExtendedTreeNode => child !== null);

      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }

  return nodes
    .map(buildPathToMatchingNodes)
    .filter((node): node is ExtendedTreeNode => node !== null);
}
