export interface Location {
  address: string;
  lat: number;
  long: number;
}

export interface GrowingArea {
  wateringType: string;
  wateringSchedule: string;
  area: number;
  rowCount: number;
  plantCountPerRow: number;
  plantSpacing: number;
  rowSpacing: number;
}

export interface Zone {
  key?: string | number;
  name: string;
  zoneId?: string;
  systemType: string;
  area: number;
  growingArea: GrowingArea;
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Nursery {
  key?: string | number;
  nurseryId?: string;
  name: string;
  type: string;
  wateringType: string;
  wateringSchedule: string;
  germinationType: string;
  area: number;
  seedCount: number;
  germinationArea: number;
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Polyhouse {
  key?: string | number;
  polyhouseId?: string;
  name: string;
  structureExpectedLife: number;
  plasticExpectedLife: number;
  zones?: Zone[];
  nurseries?: Nursery[];
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Reservoir {
  reservoirId?: string;
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

export interface DilutionRatio {
  numerator: number;
  denominator: number;
}

export interface Nutrient {
  type: string;
  dilutionRatio: DilutionRatio;
}

export interface Device {
  deviceId?: string;
  name: string;
  description: string;
  status: string;
  lastPingPacketReceived: string;
  state: string;
}

export interface Farm {
  id?: string;
  farmId: string;
  organisationId?: string;
  name: string;
  area: number;
  cultivableArea: number;
  location?: Location;
  polyhouses1?: Polyhouse[];
  reservoirs?: Reservoir[];
  nutrient: Nutrient;
  device?: Device | null; 
  state?: string;
  createdBy?: string;
  updatedBy?: string;
  createdDate?: string;
  updatedDate?: string;
}

