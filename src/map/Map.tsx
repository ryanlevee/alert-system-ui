import HeatmapOverlay from 'keli-heatmap.js/plugins/leaflet-heatmap';
import L, {
    IconOptions,
    LatLngExpression,
    Marker as LeafletMarker,
    PointExpression,
} from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import {
    LayerGroup,
    LayersControl,
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import Select, { ActionMeta, SingleValue } from 'react-select';
import Legend from './Legend';

import styled from 'styled-components';
import {
    EventCategory,
    EventCategoryName,
    eventData,
} from '../interfaces/interfaces';

interface LeafletIcon extends L.Icon {}

let DefaultIcon = new L.Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12 as number, 35 as number] as PointExpression,
    popupAnchor: [1 as number, -34 as number] as PointExpression,
} as IconOptions) as LeafletIcon;

let GreenIcon = new L.Icon({
    iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12 as number, 35 as number] as PointExpression,
    popupAnchor: [1 as number, -34 as number] as PointExpression,
} as IconOptions) as LeafletIcon;

let PurpleIcon = new L.Icon({
    iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12 as number, 35 as number] as PointExpression,
    popupAnchor: [1 as number, -34 as number] as PointExpression,
} as IconOptions) as LeafletIcon;

let RedIcon = new L.Icon({
    iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12 as number, 35 as number] as PointExpression,
    popupAnchor: [1 as number, -34 as number] as PointExpression,
} as IconOptions) as LeafletIcon;

const DataContainer = styled.div`
    padding: 20px;
`;

function RenderMarkers({
    defaultZIndexOffset,
    hoverZIndexOffset,
    eventData,
    selectedCategory,
    selectedEventType,
    isVisible,
}: {
    defaultZIndexOffset: number;
    hoverZIndexOffset: number;
    eventData: EventCategory[];
    selectedCategory: string | null;
    selectedEventType: string | null;
    isVisible: boolean;
}): React.ReactNode | null {
    if (!isVisible) return null;

    return eventData.map((event: EventCategory, index: number) => {
        const category = Object.keys(event)[0] as EventCategoryName;
        const eventDetails = event[category] as EventCategory;

        if (
            !eventDetails ||
            typeof eventDetails.latitude !== 'number' ||
            typeof eventDetails.longitude !== 'number'
        ) {
            return null;
        }

        if (selectedCategory && category != selectedCategory) return null;
        else if (selectedEventType && eventDetails.type != selectedEventType)
            return null;

        const markerIcon = (() => {
            switch (category) {
                case 'Safety':
                    return DefaultIcon;
                case 'Weather':
                    return GreenIcon;
                case 'Operations':
                    return PurpleIcon;
                case 'Disaster':
                    return RedIcon;
                default:
                    return DefaultIcon;
            }
        })();

        return (
            <Marker
                icon={markerIcon}
                key={index}
                position={
                    [eventDetails.latitude, eventDetails.longitude] as [
                        number,
                        number,
                    ]
                }
                zIndexOffset={defaultZIndexOffset}
                eventHandlers={{
                    mouseover: e => {
                        const marker = e.target as LeafletMarker;
                        marker.setZIndexOffset(hoverZIndexOffset);
                    },
                    mouseout: e => {
                        const marker = e.target as LeafletMarker;
                        marker.setZIndexOffset(defaultZIndexOffset);
                    },
                }}
            >
                <Popup>
                    <b>
                        {eventDetails.type} ({category})
                    </b>
                    <br />
                    {eventDetails.description}
                    <br />
                    Severity: {eventDetails.severity_level}
                </Popup>
            </Marker>
        );
    });
}

function HeatmapLayer({
    eventData,
    selectedCategory,
    selectedEventType,
    isVisible,
}: {
    eventData: EventCategory[];
    selectedCategory: string | null;
    selectedEventType: string | null;
    isVisible: boolean;
}): JSX.Element | null {
    const map = useMap();

    const heatmapData = React.useMemo(() => {
        const filteredEvents = eventData.filter(event => {
            const categoryKey = Object.keys(event)[0];
            const eventDetails = event[
                categoryKey as EventCategoryName
            ] as EventCategory;

            const categoryMatch =
                !selectedCategory || categoryKey === selectedCategory;
            const eventTypeMatch =
                !selectedEventType || eventDetails.type === selectedEventType;

            return categoryMatch && eventTypeMatch;
        });

        return filteredEvents.map((event, index) => {
            const categoryKey = Object.keys(event)[0];
            const eventDetails = event[
                categoryKey as EventCategoryName
            ] as EventCategory;
            return {
                lat: eventDetails.latitude,
                lng: eventDetails.longitude,
                count: index == filteredEvents.length - 1 ? 1 : 0.8,
            };
        });
    }, [eventData, selectedCategory, selectedEventType]);

    useEffect(() => {
        if (isVisible && heatmapData.length > 0) {
            try {
                const config = {
                    radius: 0.006,
                    maxOpacity: 0.65,
                    blur: 0.98,
                    scaleRadius: true,
                    useLocalExtrema: true,
                    latField: 'lat',
                    lngField: 'lng',
                    valueField: 'count',
                };

                const heatMapOverlay = new HeatmapOverlay(config);

                const mapDataSet = {
                    max: 25,
                    data: heatmapData,
                };

                heatMapOverlay.setData(mapDataSet);

                map.addLayer(heatMapOverlay);

                return () => {
                    map.removeLayer(heatMapOverlay);
                };
            } catch (error) {
                console.error(
                    'Error creating or adding HeatmapOverlay:',
                    error
                );
            }
        } else if (!isVisible) {
            map.eachLayer(layer => {
                if (layer instanceof HeatmapOverlay) {
                    map.removeLayer(layer);
                }
            });
        }
        return () => {};
    }, [map, heatmapData, isVisible]);

    return null;
}

type Props = { isNight: boolean };

const MapComponent: React.FC<Props> = props => {
    const [isMarkersVisible, setIsMarkersVisible] = useState<boolean>(true);
    const [isHeatmapVisible, setIsHeatmapVisible] = useState<boolean>(true);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [filterEventType, setFilterEventType] = useState<string | null>(null);

    const handleCategoryChange = useCallback(
        (
            newValue: SingleValue<{ value: string; label: string }>,
            actionMeta: ActionMeta<{ value: string; label: string }>
        ) => {
            setFilterCategory(newValue?.value || null);
        },
        [filterCategory, filterEventType]
    );

    useEffect(() => {
        setFilterEventType(null);
    }, [filterCategory]);

    const handleEventTypeChange = useCallback(
        (
            newValue: SingleValue<{ value: string; label: string }>,
            actionMeta: ActionMeta<{ value: string; label: string }>
        ) => {
            setFilterEventType(newValue?.value || null);
        },
        [filterEventType]
    );

    const availableCategories = React.useMemo(() => {
        return [
            ...Array.from(
                new Set(eventData.map(event => Object.keys(event)[0]))
            ),
        ].map(event => ({
            value: event,
            label: event,
        }));
    }, [eventData]);

    const availableEventTypes = React.useMemo(() => {
        const categoryEventTypesAll = eventData.reduce((acc, event) => {
            if (!Object.keys(event).includes(filterCategory)) return acc;
            acc.push(Object.values(event)[0].type);
            return acc;
        }, []);

        const categoryEventTypes = [...new Set(categoryEventTypesAll)];

        if (!Array.isArray(categoryEventTypes)) return [];

        return categoryEventTypes.map(type => ({ value: type, label: type }));
    }, [eventData, filterCategory]);

    if (!eventData || !Array.isArray(eventData)) {
        return (
            <p>
                Error loading event data or data is not in the correct format.
            </p>
        );
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
            overlayadd: e => {
                if (e.name === 'Heatmap') {
                    handleHeatmapToggle(true);
                } else if (e.name === 'Markers') {
                    handleMarkersToggle(true);
                }
            },
            overlayremove: e => {
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
        <DataContainer className="data-container">
            <div className="top-container">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>Map View</span>
                    </h4>
                    <h2 className="page-title">map</h2>
                </div>
                <div className="select-container">
                    <div id="filter-container-outer">
                        <div className="filter-container-inner">
                            <div>
                                <Select
                                    options={availableCategories}
                                    id="category-select"
                                    onChange={handleCategoryChange}
                                    placeholder="Category..."
                                    isClearable={true}
                                    value={
                                        filterCategory
                                            ? {
                                                  value: filterCategory,
                                                  label: filterCategory,
                                              }
                                            : null
                                    }
                                />
                            </div>
                            <div>
                                <Select
                                    options={availableEventTypes}
                                    id="event-type-select"
                                    onChange={handleEventTypeChange}
                                    isDisabled={
                                        !filterCategory ||
                                        filterCategory === 'Categories'
                                    }
                                    placeholder="Event Type..."
                                    isClearable={true}
                                    value={
                                        filterEventType
                                            ? {
                                                  value: filterEventType,
                                                  label: filterEventType,
                                              }
                                            : null
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div id="create-alert-btn-container">
                        <button id="create-alert-btn">
                            <FaBell />
                            Create Alert
                        </button>
                    </div>
                </div>
            </div>
            <MapContainer center={center as LatLngExpression} zoom={zoomLevel}>
                {props.isNight ? (
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=53278723-4e97-4b56-b1a2-053b2c557e6f"
                        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        referrerPolicy='origin-when-cross-origin'
                    />
                ) : (
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                )}

                <MapEventListeners />

                <LayersControl position="topright">
                    <LayersControl.Overlay
                        name="Markers"
                        checked={isMarkersVisible}
                    >
                        <LayerGroup>
                            <RenderMarkers
                                defaultZIndexOffset={defaultZIndexOffset}
                                hoverZIndexOffset={hoverZIndexOffset}
                                isVisible={isMarkersVisible}
                                eventData={eventData}
                                selectedCategory={filterCategory}
                                selectedEventType={filterEventType}
                            />
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
                                selectedCategory={filterCategory}
                                selectedEventType={filterEventType}
                            />
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

                <Legend
                    defaultIcon={DefaultIcon}
                    greenIcon={GreenIcon}
                    purpleIcon={PurpleIcon}
                    redIcon={RedIcon}
                    isNight={props.isNight}
                />
            </MapContainer>
        </DataContainer>
    );
};

export default MapComponent;
