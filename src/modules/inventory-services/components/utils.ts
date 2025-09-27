import { AlertTriangle, Building, Car, CheckCircle, Package, Warehouse, Wrench } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
    case "active":
      return "status-success";
    case "low_stock":
      return "status-warning";
    case "out_of_stock":
    case "inactive":
      return "status-error";
    default:
      return "status-info";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "available":
    case "active":
      return CheckCircle;
    case "low_stock":
    case "out_of_stock":
      return AlertTriangle;
    default:
      return Package;
  }
};

export const getLocationIcon = (locationType: string) => {
  switch (locationType) {
    case "warehouse":
      return Building;
    case "vehicle":
      return Car;
    default:
      return Warehouse;
  }
};

export const getTypeIcon = (type: string) => {
  return type === "service" ? Wrench : Package;
};

export type InventoryServiceItem = any;
