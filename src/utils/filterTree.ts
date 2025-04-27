import { ExtendedTreeNode } from "@/utils/buildTree";

export function filterTree(nodes: ExtendedTreeNode[], search: string): ExtendedTreeNode[] {
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
        children: filteredChildren
      };
    }

    return null;
  }

  return nodes.map(filterNode).filter((n): n is ExtendedTreeNode => n !== null);
}