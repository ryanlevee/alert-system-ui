import CollapsibleSidebar from '../Sidebar'; // Assuming Sidebar.tsx is in the same directory
import React, { useState, useCallback, JSX, EventHandler, MouseEventHandler } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Import leaflet.heat plugin
import data from '../../../backend/data.json';
import { LatLngExpression, Marker as LeafletMarker, IconOptions, Layer } from 'leaflet';
// import * as HeatmapJS from 'heatmap.js'; // Import heatmap.js core library
// import HeatmapOverlay from 'leaflet-heatmap'; // Import Leaflet HeatmapOverlay plugin  (adjust if import fails)
import HeatmapOverlay from 'keli-heatmap.js/plugins/leaflet-heatmap';
import Select from 'react-select';

// Fix for Leaflet marker icon issue in Vite/Webpack:
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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

type EventCategory =
    | { Safety: SafetyEventDetails; }
    | { Weather: WeatherEventDetails; }
    | { Operations: OperationsEventDetails; }
    | { Disaster: DisasterEventDetails; };

const eventData = data as EventCategory[];
interface LeafletIcon extends L.Icon { }

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 35],
    popupAnchor: [1, -34],
}) as LeafletIcon;

L.Marker.prototype.options.icon = DefaultIcon;


function renderPoints(defaultZIndexOffset: number, hoverZIndexOffset: number): React.ReactNode {
    return eventData.map((event: EventCategory, index: number) => {
        const category = Object.keys(event)[0] as keyof EventCategory;
        const eventDetails = event[category] as EventDetailsBase;

        if (!eventDetails || typeof eventDetails.latitude !== 'number' || typeof eventDetails.longitude !== 'number') {
            return null;
        }

        return (
            <Marker
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
    });
}


function App(): JSX.Element {
    const [isPointsVisible, setIsPointsVisible] = useState<boolean>(true); // Default points to visible
    const [isHeatmapVisible, setIsHeatmapVisible] = useState<boolean>(true); // Default heatmap to hidden
    const [heatmapCategory, setHeatmapCategory] = useState<string | null>(null);
    const [heatmapEventType, setHeatmapEventType] = useState<string | null>(null);

    const handleCategoryChange = useCallback((event: HTMLInputElement) => {
        setHeatmapCategory(event.value);
        setHeatmapEventType(null);
    }, []);

    const handleEventTypeChange = useCallback((event: HTMLInputElement) => {
        setHeatmapEventType(event.value);
    }, []);

    // const availableCategories = React.useMemo(() => {
    //     return ["Categories", ...Array.from(new Set(eventData.map(event => Object.keys(event)[0])))];
    // }, [eventData]);

    const availableCategories = React.useMemo(() => {
        return [...Array.from(new Set(eventData.map((event) => Object.keys(event)[0])))].map((event) => ({
            value: event,
            label: event,
        }));
    }, [eventData]);

    // const availableEventTypes = React.useMemo(() => {
    //     if (!heatmapCategory || heatmapCategory === "Categories") return ["Event Types"];
    //     const types = eventData
    //         .filter(event => Object.keys(event)[0] === heatmapCategory)
    //         .map(event => event[heatmapCategory as keyof EventCategory]!.type);
    //     return ["Event Types", ...Array.from(new Set(types))];
    // }, [eventData, heatmapCategory]);

    const availableEventTypes = React.useMemo(() => {
        if (!heatmapCategory) return [];
        const types = eventData
            .filter(event => Object.keys(event)[0] === heatmapCategory)
            .map(event => event[heatmapCategory as keyof EventCategory]!.type);
        return [...Array.from(new Set(types))].map((event) => ({
            value: event,
            label: event,
        }));
    }, [eventData, heatmapCategory]);

    if (!eventData || !Array.isArray(eventData)) {
        return <p>Error loading event data or data is not in the correct format.</p>;
    }

    const center: [number, number] = [34.0522, -118.2437];
    const zoomLevel: number = 12;
    const defaultZIndexOffset: number = 0;
    const hoverZIndexOffset: number = 1000;

    const handlePointsToggle = useCallback((visible: boolean) => {
        setIsPointsVisible(visible);
    }, []);

    const handleHeatmapToggle = useCallback((visible: boolean) => {
        setIsHeatmapVisible(visible);
    }, []);


    function MapEventListeners() {
        // const map = useMap();
        useMapEvents({
            overlayadd: (e) => {
                if (e.name === 'Heatmap') {
                    handleHeatmapToggle(true); // Turn heatmap ON
                } else if (e.name === 'Points') {
                    handlePointsToggle(true); // Turn points ON
                }
            },
            overlayremove: (e) => {
                if (e.name === 'Heatmap') {
                    handleHeatmapToggle(false); // Turn heatmap OFF
                } else if (e.name === 'Points') {
                    handlePointsToggle(false); // Turn points OFF
                }
            },
        });
        return null;
    }

    return (

        <div className="app-container" > {/* Optional app container for layout */}
            <CollapsibleSidebar>
                {/* Optional: CollapsibleSidebar Content - if you need extra content in the collapsibleSidebar */}
                {/* <p>Additional CollapsibleSidebar Content</p> */}
            </CollapsibleSidebar>

            <div className="main-content" >

                <h1>Event Map with Layer Control</h1>

                <div id='heatmap-select-container-outer'> {/* ADDED hidden attribute here */}

                    {isHeatmapVisible && (
                        <div id="heatmap-select-container-inner">
                            <div>
                                <Select options={availableCategories} id="category-select" onChange={handleCategoryChange} placeholder="Category" />
                                {/* <Select id="category-select" value={heatmapCategory || "Categories"} onChange={handleCategoryChange}>
                                    {availableCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Select> */}
                            </div>
                            {availableEventTypes && (
                                <div>
                                    <Select options={availableEventTypes} id="event-type-select" onChange={handleEventTypeChange} disabled={!heatmapCategory || heatmapCategory === "Categories"}
                                        placeholder="Event Type"
                                        noOptionsMessage={function noOptionsMessage() {
                                            return "Select Category";
                                        }}
                                    />
                                    {/* <Select id="event-type-select" value={heatmapEventType || "Event Types"} onChange={handleEventTypeChange} disabled={!heatmapCategory || heatmapCategory === "Categories"}>
                                    {availableEventTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Select> */}
                                </div>)}
                        </div>
                    )}
                </div>

                <MapContainer center={center as LatLngExpression} zoom={zoomLevel} >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <MapEventListeners />

                    <LayersControl position="topright">
                        {/* Points Layer */}
                        <LayersControl.Overlay
                            name="Points"
                            checked={isPointsVisible} // Bind to isPointsVisible
                        >
                            <LayerGroup>
                                {renderPoints(defaultZIndexOffset, hoverZIndexOffset)}
                            </LayerGroup>
                        </LayersControl.Overlay>

                        <LayersControl.Overlay
                            name="Heatmap"
                            checked={isHeatmapVisible} // Bind to isHeatmapVisible
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

                </MapContainer>
            </div>
        </div>
    );
}


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
            const eventDetails = event[categoryKey] as EventDetailsBase;

            const categoryMatch = !selectedCategory || selectedCategory === "Categories" || categoryKey === selectedCategory;
            const eventTypeMatch = !selectedEventType || selectedEventType === "Event Types" || eventDetails.type === selectedEventType;

            return categoryMatch && eventTypeMatch;
        });

        return filteredEvents.map((event, index) => {
            const categoryKey = Object.keys(event)[0];
            const eventDetails = event[categoryKey] as EventDetailsBase;
            return {
                lat: eventDetails.latitude,
                lng: eventDetails.longitude,
                count: index == filteredEvents.length - 1 ? 1 : .8
            };
        });
    }, [eventData, selectedCategory, selectedEventType]);


    React.useEffect(() => {
        // console.log("HeatmapLayer useEffect - isVisible:", isVisible, "heatmapData.length:", heatmapData.length);

        if (isVisible && heatmapData.length > 0) {
            try {
                const config = {
                    radius: 0.005,
                    maxOpacity: .6,
                    blur: .95,
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


export default App;
