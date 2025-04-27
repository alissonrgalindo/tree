export interface Company {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Asset {
  id: string;
  name: string;
  parentId?: string | null;
  locationId?: string | null;
  sensorId?: string;
  sensorType?: 'energy' | 'vibration' | null;
  status?: 'operating' | 'alert' | null;
  gatewayId?: string;
}

export interface TreeNode {
  id: string;
  name: string;
  type: "location" | "asset" | "component";
  status?: "operating" | "alert" | null;
  sensorType?: "energy" | "vibration" | null;
  children: TreeNode[];
  parentType?: "location" | "asset" | "component";
}
