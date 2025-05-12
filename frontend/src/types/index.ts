// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Demand {
  id: number;
  name: string;
  description?: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone?: string;
  openingHours?: string;
  LocationDemand?: LocationDemand[];
}

export interface LocationDemand {
  id: number;
  locationId: number;
  demandId: number;
  demand?: Demand;
}
