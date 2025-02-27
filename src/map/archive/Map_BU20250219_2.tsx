import 'leaflet/dist/leaflet.css';
import React, { JSX, useCallback, useState, useMemo, useEffect } from 'react';
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents, Map, Layer } from 'react-leaflet';
// import 'leaflet.heat'; // Import leaflet.heat plugin
import HeatmapOverlay from 'keli-heatmap.js/plugins/leaflet-heatmap';
import L, { LatLngExpression, Marker as LeafletMarker, IconOptions, PointExpression } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { FaBell } from 'react-icons/fa';
import Select, { ActionMeta, InputActionMeta, OptionsOrGroups, ValueMeta, SingleValue } from 'react-select';
import data from '../../../backend/data.json';
import Legend from './Legend'; // Adjust path if necessary

// Re-export Layer and Map for correct type usage in useMap, useMapEvents
export type { Layer, Map };


// Type definitions for the event data structure
interface EventDetailsBase {
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
}

interface SafetyEventDetails extends EventDetailsBase {
    law_enforcement_agency: string;
    law_enforcement_contact: string;
    affected_population: number;
    affected_infrastructure: string;
    casualties: number;
    injuries: number;
    evacuations: number;
    traffic_conditions: string;
}

interface WeatherEventDetails extends EventDetailsBase {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: string;
    precipitation: number;
    visibility: number;
    pressure: number;
    fire_department: string | null;
    fire_department_contact: string | null;
    affected_population: number;
    affected_infrastructure: string;
    evacuations: number;
    power_outages: number;
    road_closures: number;
    damage_estimate: number;
    forecast_accuracy: string;
    alert_source: string;
    alert_issued_time: string;
    alert_expiry_time: string;
}

interface OperationsEventDetails extends EventDetailsBase {
    utility_company: string;
    utility_company_contact: string;
    affected_population: number;
    affected_infrastructure: string;
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

interface DisasterEventDetails extends EventDetailsBase {
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
    affected_population: number;
    affected_infrastructure: string;
    casualties: number;
    injuries: number;
    evacuations: number;
    damage_estimate: number;
    impact_level: string;
    impact_financial: number;
    impact_environmental: string;
}

type EventCategoryType = 'Safety' | 'Weather' | 'Operations' | 'Disaster';

type EventCategory =
    | { Safety: SafetyEventDetails; }
    | { Weather: WeatherEventDetails; }
    | { Operations: OperationsEventDetails; }
    | { Disaster: DisasterEventDetails; };

const eventData = data as EventCategory[];
interface LeafletIcon extends L.Icon { }

let DefaultIcon = new L.Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12 as number, 35 as number] as PointExpression, // Explicitly type as PointExpression
    popupAnchor: [1 as number, -34 as number] as PointExpression, // Explicitly type as PointExpression
} as IconOptions) as LeafletIcon; // Type assertion for LeafletIcon

let GreenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12 as number, 35 as number] as PointExpression,
    popupAnchor: [1 as number, -34 as number] as PointExpression,
} as IconOptions) as LeafletIcon;


let PurpleIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12 as number, 35 as number] as PointExpression,
    popupAnchor: [1 as number, -34 as number] as PointExpression,
} as IconOptions) as LeafletIcon;


let RedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12 as number, 35 as number] as PointExpression,
    popupAnchor: [1 as number, -34 as number] as PointExpression,
} as IconOptions) as LeafletIcon;


function RenderMarkersTest({ defaultZIndexOffset, hoverZIndexOffset, eventData, selectedCategory, selectedEventType, isVisible }: {
    defaultZIndexOffset: number;
    hoverZIndexOffset: number;
    eventData: EventCategory[];
    selectedCategory: string | null;
    selectedEventType: string | null;
    isVisible: boolean;
}): JSX.Element | null {

    console.log('defaultZIndexOffset:', defaultZIndexOffset);
    console.log('hoverZIndexOffset:', hoverZIndexOffset);
    console.log('eventData:', eventData);
    console.log('selectedCategory:', selectedCategory);
    console.log('selectedEventType:', selectedEventType);
    console.log('isVisible:', isVisible);

    if (!isVisible) return null

    return eventData.map((event: EventCategory, index: number) => {
        const category = Object.keys(event)[0] as EventCategoryType; // More specific type
        // Corrected line: Type assertion to EventDetailsBase after indexing
        const eventDetails = event[category] as EventDetailsBase;

        if (!eventDetails || typeof eventDetails.latitude !== 'number' || typeof eventDetails.longitude !== 'number') {
            return null;
        }

        if (selectedCategory && category != selectedCategory) return null

        return (
            <Marker
                icon={(
                    category == 'Safety' ? DefaultIcon :
                        category == 'Weather' ? GreenIcon :
                            category == 'Operations' ? PurpleIcon :
                                category == 'Disaster' ? RedIcon :
                                    DefaultIcon
                )}
                key={index}
                position={[eventDetails.latitude, eventDetails.longitude] as [number, number]}
                zIndexOffset={defaultZIndexOffset}
                eventHandlers={{
                    mouseover: e => {
                        const marker = e.target as LeafletMarker;
                        marker.setZIndexOffset(hoverZIndexOffset);
                    },
                    mouseout: e => {
                        const marker = e.target as LeafletMarker;
                        marker.setZIndexOffset(defaultZIndexOffset);
                    }
                }}
            >
                <Popup>
                    <b>{eventDetails.type} ({category})</b><br />
                    {eventDetails.description}<br />
                    Severity: {eventDetails.severity_level}
                </Popup>
            </Marker>
        );
    })
}

// function renderMarkers(defaultZIndexOffset: number, hoverZIndexOffset: number): React.ReactNode {
//     return eventData.map((event: EventCategory, index: number) => {
//         const category = Object.keys(event)[0] as EventCategoryType; // More specific type
//         // Corrected line: Type assertion to EventDetailsBase after indexing
//         const eventDetails = event[category] as EventDetailsBase;

//         if (!eventDetails || typeof eventDetails.latitude !== 'number' || typeof eventDetails.longitude !== 'number') {
//             return null;
//         }

//         return (
//             <Marker
//                 icon={(
//                     category == 'Safety' ? DefaultIcon :
//                         category == 'Weather' ? GreenIcon :
//                             category == 'Operations' ? PurpleIcon :
//                                 category == 'Disaster' ? RedIcon :
//                                     DefaultIcon
//                 )}
//                 key={index}
//                 position={[eventDetails.latitude, eventDetails.longitude] as [number, number]}
//                 zIndexOffset={defaultZIndexOffset}
//                 eventHandlers={{
//                     mouseover: e => {
//                         const marker = e.target as LeafletMarker;
//                         marker.setZIndexOffset(hoverZIndexOffset);
//                     },
//                     mouseout: e => {
//                         const marker = e.target as LeafletMarker;
//                         marker.setZIndexOffset(defaultZIndexOffset);
//                     }
//                 }}
//             >
//                 <Popup>
//                     <b>{eventDetails.type} ({category})</b><br />
//                     {eventDetails.description}<br />
//                     Severity: {eventDetails.severity_level}
//                 </Popup>
//             </Marker>
//         );
//     });
// }

function HeatmapLayer({ eventData, selectedCategory, selectedEventType, isVisible }: {
    eventData: EventCategory[];
    selectedCategory: string | null;
    selectedEventType: string | null;
    isVisible: boolean;
}): JSX.Element | null {

    const map = useMap();

    const heatmapData = React.useMemo(() => {
        const filteredEvents = eventData.filter(event => {
            const categoryKey = Object.keys(event)[0];
            const eventDetails = event[categoryKey as EventCategoryType] as EventDetailsBase;

            const categoryMatch = !selectedCategory || categoryKey === selectedCategory;
            const eventTypeMatch = !selectedEventType || eventDetails.type === selectedEventType;

            return categoryMatch && eventTypeMatch;
        });

        return filteredEvents.map((event, index) => {
            const categoryKey = Object.keys(event)[0];
            const eventDetails = event[categoryKey as EventCategoryType] as EventDetailsBase;
            return {
                lat: eventDetails.latitude,
                lng: eventDetails.longitude,
                count: index == filteredEvents.length - 1 ? 1 : .8
            };
        });
    }, [eventData, selectedCategory, selectedEventType]);


    useEffect(() => {
        if (isVisible && heatmapData.length > 0) {
            try {
                const config = {
                    radius: 0.006,
                    maxOpacity: .65,
                    blur: .98,
                    scaleRadius: true,
                    useLocalExtrema: true,
                    latField: 'lat',
                    lngField: 'lng',
                    valueField: 'count',
                };

                const heatMapOverlay = new HeatmapOverlay(config);

                const mapDataSet = {
                    max: 25,
                    data: heatmapData
                };

                heatMapOverlay.setData(mapDataSet);

                map.addLayer(heatMapOverlay);

                return () => {
                    map.removeLayer(heatMapOverlay);
                };
            } catch (error) {
                console.error("Error creating or adding HeatmapOverlay:", error);
            }
        } else if (!isVisible) {
            map.eachLayer(layer => {
                if (layer instanceof HeatmapOverlay) {
                    map.removeLayer(layer);
                }
            });
        }
        return () => { };
    }, [map, heatmapData, isVisible]);

    return null;
}

// function MapComponent(): JSX.Element {
const MapComponent: React.FC = () => {
    const [isMarkersVisible, setIsMarkersVisible] = useState<boolean>(true); // Default markers to visible
    const [isHeatmapVisible, setIsHeatmapVisible] = useState<boolean>(true); // Default heatmap to hidden
    const [heatmapCategory, setHeatmapCategory] = useState<string | null>(null);
    const [heatmapEventType, setHeatmapEventType] = useState<string | null>(null);

    const handleCategoryChange = useCallback(
        (newValue: SingleValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => {
            setHeatmapCategory(newValue?.value || null);
        },
        [heatmapCategory, heatmapEventType]
    );

    useEffect(() => {
        setHeatmapEventType(null);
    }, [heatmapCategory]);

    const handleEventTypeChange = useCallback(
        (newValue: SingleValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => {
            setHeatmapEventType(newValue?.value || null);
        },
        [heatmapEventType]
    );

    const availableCategories = React.useMemo(() => {
        return [...Array.from(new Set(eventData.map((event) => Object.keys(event)[0])))].map((event) => ({
            value: event,
            label: event,
        }));
    }, [eventData]);

    const availableEventTypes = React.useMemo(() => {
        // if (!heatmapCategory) return [];

        const categoryEventTypesAll = eventData.reduce((acc, event) => {
            if (!Object.keys(event).includes(heatmapCategory)) return acc;
            acc.push(Object.values(event)[0].type);
            return acc;
        }, []);

        const categoryEventTypes = [...new Set(categoryEventTypesAll)];

        if (!Array.isArray(categoryEventTypes)) return [];

        return categoryEventTypes.map(type => ({ value: type, label: type }));
    }, [eventData, heatmapCategory]);

    if (!eventData || !Array.isArray(eventData)) {
        return <p>Error loading event data or data is not in the correct format.</p>;
    }

    const center: [number, number] = [34.0522, -118.2437];
    const zoomLevel: number = 11;
    const defaultZIndexOffset: number = 0;
    const hoverZIndexOffset: number = 1000;

    const handleMarkersToggle = useCallback((visible: boolean) => {
        setIsMarkersVisible(visible);
    }, []);

    const handleHeatmapToggle = useCallback((visible: boolean) => {
        setIsHeatmapVisible(visible);
    }, []);

    function MapEventListeners() {
        useMapEvents({
            overlayadd: (e) => {
                if (e.name === 'Heatmap') {
                    handleHeatmapToggle(true);
                } else if (e.name === 'Markers') {
                    handleMarkersToggle(true);
                }
            },
            overlayremove: (e) => {
                if (e.name === 'Heatmap') {
                    handleHeatmapToggle(false);
                } else if (e.name === 'Markers') {
                    handleMarkersToggle(false);
                }
            },
        });
        return null;
    }

    return (

        <div className="map-container">

            <h4>React Demo &#8250; <span>Map View</span></h4>

            <h2>map</h2>

            <div id="top-container">
                <div id='heatmap-select-container-outer'>
                    {/* {isHeatmapVisible && ( */}
                    <div id="heatmap-select-container-inner">
                        <div>
                            <Select
                                options={availableCategories}
                                id="category-select"
                                onChange={handleCategoryChange}
                                placeholder="Category..."
                                isClearable={true}
                                value={heatmapCategory ? { value: heatmapCategory, label: heatmapCategory } : null} // ADD THIS LINE
                            />
                        </div>
                        {!!availableEventTypes.length && (
                            <div>
                                <Select
                                    options={availableEventTypes}
                                    id="event-type-select"
                                    onChange={handleEventTypeChange}
                                    isDisabled={!heatmapCategory || heatmapCategory === "Categories"}
                                    placeholder="Event Type..."
                                    isClearable={true}
                                    value={heatmapEventType ? { value: heatmapEventType, label: heatmapEventType } : null} // ADD THIS LINE
                                />
                            </div>
                        )}
                    </div>
                    {/* )} */}
                </div>

                <div id="create-alert-btn-container">
                    <button id="create-alert-btn"><FaBell />Create Alert</button>
                </div>
            </div>

            <MapContainer center={center as LatLngExpression} zoom={zoomLevel} >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapEventListeners />

                <LayersControl position="topright">

                    <LayersControl.Overlay
                        name="Markers"
                        checked={isMarkersVisible}
                    >
                        <LayerGroup>
                            <RenderMarkersTest
                                defaultZIndexOffset={defaultZIndexOffset}
                                hoverZIndexOffset={hoverZIndexOffset}
                                isVisible={isMarkersVisible}
                                eventData={eventData}
                                selectedCategory={heatmapCategory}
                                selectedEventType={heatmapEventType}

                            />
                            {/* {renderMarkers(
                                defaultZIndexOffset, hoverZIndexOffset
                                )} */}
                        </LayerGroup>
                    </LayersControl.Overlay>

                    <LayersControl.Overlay
                        name="Heatmap"
                        checked={isHeatmapVisible}
                    >
                        <LayerGroup>
                            <HeatmapLayer
                                isVisible={isHeatmapVisible}
                                eventData={eventData}
                                selectedCategory={heatmapCategory}
                                selectedEventType={heatmapEventType}
                            />
                        </LayerGroup>
                    </LayersControl.Overlay>

                </LayersControl>

                <Legend
                    defaultIcon={DefaultIcon}
                    greenIcon={GreenIcon}
                    purpleIcon={PurpleIcon}
                    redIcon={RedIcon}
                />

            </MapContainer>
        </div>
    );
};

export default MapComponent;
