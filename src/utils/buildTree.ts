import { Asset, Location, TreeNode } from "@/types";

export interface ExtendedTreeNode extends TreeNode {
  parentType?: TreeNode["type"];
}

export function buildTree(locations: Location[], assets: Asset[]): ExtendedTreeNode[] {
  const locationMap = new Map<string, ExtendedTreeNode>();
  const assetMap = new Map<string, ExtendedTreeNode>();

  locations.forEach((loc) => {
    locationMap.set(loc.id, {
      id: loc.id,
      name: loc.name,
      type: "location",
      children: []
    });
  });

  assets.forEach((asset) => {
    const node: ExtendedTreeNode = {
      id: asset.id,
      name: asset.name,
      type: asset.sensorType ? "component" : "asset",
      status: asset.status ?? null,
      sensorType: asset.sensorType ?? null,
      children: []
    };
    assetMap.set(asset.id, node);
  });

  const roots: ExtendedTreeNode[] = [];

  assets.forEach((asset) => {
    const node = assetMap.get(asset.id);
    if (!node) return;

    if (asset.parentId) {
      const parent = assetMap.get(asset.parentId);
      if (parent) {
        node.parentType = parent.type;
        parent.children.push(node);
      }
    } else if (asset.locationId) {
      const parent = locationMap.get(asset.locationId);
      if (parent) {
        node.parentType = "location";
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  locations.forEach((loc) => {
    const node = locationMap.get(loc.id);
    if (!node) return;

    if (loc.parentId) {
      const parent = locationMap.get(loc.parentId);
      if (parent) {
        node.parentType = "location";
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}