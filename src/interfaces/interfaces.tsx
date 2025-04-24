import categoryIndex from '../../backend/categoryIndex.json';
import data from '../../backend/data.json';

export interface EventDetailsBase {
    uid: number;
    event_id: string;
    record_id: number;
    type: string;
    description: string;
    status: string;
    event_date: string;
    event_location: string;
    latitude: number;
    longitude: number;
    severity_level: string;
    reported_by: string;
    report_date: string;
    response_team: string;
    response_time: string;
    resolution_time: string | null;
    response_actions: string;
    media_coverage: string;
    ip_address: string;
    weather_conditions?: string;
    affected_population: number;
    affected_infrastructure: string;
}

export interface SafetyEventDetails extends EventDetailsBase {
    law_enforcement_agency: string;
    law_enforcement_contact: string;
    casualties: number;
    injuries: number;
    evacuations: number;
    traffic_conditions: string;
}

export interface WeatherEventDetails extends EventDetailsBase {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: string;
    precipitation: number;
    visibility: number;
    pressure: number;
    fire_department: string | null;
    fire_department_contact: string | null;
    evacuations: number;
    power_outages: number;
    road_closures: number;
    damage_estimate: number;
    forecast_accuracy: string;
    alert_source: string;
    alert_issued_time: string;
    alert_expiry_time: string;
}

export interface OperationsEventDetails extends EventDetailsBase {
    utility_company: string;
    utility_company_contact: string;
    service_disruption: string;
    duration: number;
    estimated_repair_time: string;
    outage_area: string;
    backup_services: string;
    cause: string;
    impact_level: string;
    impact_financial: number;
    impact_environmental: string;
}

export interface DisasterEventDetails extends EventDetailsBase {
    disaster_type: string;
    magnitude: number;
    depth: number;
    affected_area: string;
    duration: number;
    cause: string;
    fire_department: string;
    fire_department_contact: string;
    emergency_shelter: string;
    emergency_shelter_location: string;
    emergency_shelter_contact: string;
    casualties: number;
    injuries: number;
    evacuations: number;
    damage_estimate: number;
    impact_level: string;
    impact_financial: number;
    impact_environmental: string;
}

export type EventCategoryName =
    | 'Safety'
    | 'Weather'
    | 'Operations'
    | 'Disaster'
    // | ({ value: string, label: string; })
    | null;

export type EventCategory =
    | SafetyEventDetails
    | WeatherEventDetails
    | OperationsEventDetails
    | DisasterEventDetails;

// export const eventData = Object.entries(data).sort(([itemA, itemB]) => itemA.localeCompare(itemB))
//  as EventCategory[];

export const eventData = data as EventCategory[];

export const categories = categoryIndex;
