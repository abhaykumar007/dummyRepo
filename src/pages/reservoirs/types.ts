export interface Reservoir {
  reservoirId: string;
  name: string;
  reservoirCapacity: number;
  nutrientWaterReservoirCapacity: number;
  phReservoirCapacity: number;
  stockNutrientSolutionCapacity: number;
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
}
