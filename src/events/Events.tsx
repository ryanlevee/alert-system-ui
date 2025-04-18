import React, { useCallback, useEffect, useState } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import styled from 'styled-components';
import { EventCategoryName, eventData } from '../interfaces/interfaces';
import RenderList from './List';

const DataContainer = styled.div`
    padding: 20px;
`;

const DataComponent: React.FC = () => {
    const [displayLimit, setDisplayLimit] = useState<string | null>('3');
    const [filterCategory, setFilterCategory] =
        useState<EventCategoryName>(null);
    const [filterEventType, setFilterEventType] = useState<string | null>(null);
    const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);

    const handleCategoryChange = useCallback(
        (
            newValue: SingleValue<{ value: string; label: string }>,
            actionMeta: ActionMeta<{ value: string; label: string }>
        ) => {
            setFilterCategory(newValue?.value || null);
        },
        [filterCategory]
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

    const handleDisplayLimitChange = useCallback(
        (
            newValue: SingleValue<{ value: string; label: string }>,
            actionMeta: ActionMeta<{ value: string; label: string }>
        ) => {
            setDisplayLimit(newValue?.value || null);
        },
        [displayLimit]
    );

    const handleExpandAll = useCallback(() => {
        setIsAllExpanded(!isAllExpanded);
    }, [isAllExpanded]);

    const availableCategories = React.useMemo(() => {
        return [
            ...Array.from(
                new Set(eventData.map(event => Object.keys(event)[0]))
            ),
        ]
            .sort()
            .map(event => ({
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

        return categoryEventTypes
            .sort()
            .map(type => ({ value: type, label: type }));
    }, [eventData, filterCategory]);

    if (!eventData || !Array.isArray(eventData)) {
        return (
            <p>
                Error loading event data or data is not in the correct format.
            </p>
        );
    }

    return (
        <DataContainer className="data-container">
            <div className="top-container">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>Event Tracker</span>
                    </h4>
                    <h2 className="page-title">events</h2>
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
                                    isDisabled={!filterCategory}
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
                            <div>
                                <Select
                                    options={[
                                        { value: '3', label: '3 (default)' },
                                        { value: 'All', label: 'All' },
                                    ]}
                                    id="display-limit"
                                    onChange={handleDisplayLimitChange}
                                    placeholder="Show..."
                                    isClearable={true}
                                    value={{
                                        value: displayLimit,
                                        label: displayLimit,
                                    }}
                                />
                            </div>
                            <div>
                                <div id="expand-collapse">
                                    <button onClick={handleExpandAll}>
                                        {isAllExpanded
                                            ? 'Collapse All'
                                            : 'Expand All'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="event-tracker-container">
                <RenderList
                    isAllExpanded={isAllExpanded}
                    selectedCategory={filterCategory}
                    selectedEventType={filterEventType}
                    displayLimit={displayLimit}
                    eventData={eventData}
                />
            </div>
        </DataContainer>
    );
};

export default DataComponent;
