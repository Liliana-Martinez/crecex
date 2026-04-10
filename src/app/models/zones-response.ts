import { Promoter, Zone } from "./Zone";

export interface ZonesResponse {
    availableZones: Zone[];
    promoters: Promoter[];
    supervisors: any[];
    assignedZones: Zone[];
}
export interface AssignedZonesResponse {
    assignedZones: Zone[];
}
