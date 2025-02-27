import RenderGraph from './Graph';
import React, { useCallback, useEffect, useState } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import styled from 'styled-components';
import { EventCategoryName, eventData } from '../interfaces/interfaces';
import RenderCards from './Cards';

const DataContainer = styled.div`
    padding: 20px;
`;

const CardsCategoryContainer = styled.div<{
    $selectedTab: string | null;
}>`
    background-color: #faf9fb;
    padding: 0 !important;
    margin: 0 !important;

    ${props =>
        !props.$selectedTab || props.$selectedTab == 'Category'
            ? `transform: translate(0, 0)`
            : `transform: translate(-2150px, 0)`};

    transition: transform 0.5s ease;
`;

const CardsAllContainer = styled.div<{
    $selectedTab: string | null;
}>`
    background-color: #faf9fb;
    padding: 0 !important;
    margin: 0 !important;

    ${props =>
        props.$selectedTab == 'All'
            ? `transform: translate(0, 0)`
            : `transform: translate(-2150px, 0)`};

    transition: transform 0.5s ease;
`;

const Tab = styled.div<{ $activeTab: boolean }>`
    border-bottom: ${props =>
        props.$activeTab ? '5px solid #6c5fc7' : 'none'};
`;

const DataComponent: React.FC = () => {
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] =
        useState<EventCategoryName>(null);
    const [filterEventType, setFilterEventType] = useState<string | null>(null);
    const [displayLimit, setDisplayLimit] = useState<string | null>(null);

    const [selectedTab, setSelectedTab] = useState<string | null>(null);

    const handleTabChange = useCallback(
        (e: any) => {
            const target = e.currentTarget;
            const checkBox = target.querySelector('input');
            checkBox.checked = true;
            setSelectedTab(checkBox.value);
        },
        [selectedTab]
    );

    const handleSortChange = useCallback(
        (
            newValue: SingleValue<{ value: string; label: string }>,
            actionMeta: ActionMeta<{ value: string; label: string }>
        ) => {
            setSortBy(newValue?.value || null);
        },
        [sortBy]
    );

    const handleCategoryChange = useCallback(
        (
            newValue: SingleValue<{ value: EventCategoryName; label: string }>,
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
        [filterEventType, filterCategory]
    );

    const handleDisplayLimitChange = useCallback(
        (
            newValue: SingleValue<{ value: string; label: string }>,
            actionMeta: ActionMeta<{ value: string; label: string }>
        ) => {
            setDisplayLimit(newValue?.value || null);
        },
        [sortBy]
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

    return (
        <DataContainer className="data-container">
            <div className="top-container">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>Data Dashboard</span>
                    </h4>
                    <h2 id="page-title">data</h2>
                </div>
                <div className="select-container">
                    <div id="filter-container-outer">
                        <div className="filter-container-inner">
                            <div>
                                <Select
                                    options={[
                                        {
                                            value: 'Frequency',
                                            label: 'Frequency',
                                        },
                                        {
                                            value: 'Alphabetical',
                                            label: 'Alphabetical',
                                        },
                                    ]}
                                    id="sort-by"
                                    onChange={handleSortChange}
                                    placeholder="Sort by..."
                                    isClearable={true}
                                    value={
                                        sortBy
                                            ? { value: sortBy, label: sortBy }
                                            : null
                                    }
                                />
                            </div>
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
                                        !filterCategory || selectedTab === 'All'
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
                            <div>
                                <Select
                                    options={[
                                        { value: '3', label: '3 (default)' },
                                        { value: 'All', label: 'All' },
                                    ]}
                                    id="display-limit"
                                    onChange={handleDisplayLimitChange}
                                    isDisabled={selectedTab === 'All'}
                                    placeholder={'Show...'}
                                    isClearable={true}
                                    value={
                                        displayLimit
                                            ? {
                                                  value: displayLimit,
                                                  label: displayLimit,
                                              }
                                            : null
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tabs">
                    <Tab
                        $activeTab={!selectedTab || selectedTab == 'Category'}
                        onClick={handleTabChange}
                    >
                        <span>Categories</span>
                        <input
                            type="checkbox"
                            value="Category"
                            style={{ display: 'none' }}
                        />
                    </Tab>
                    <Tab
                        $activeTab={selectedTab == 'All'}
                        onClick={handleTabChange}
                    >
                        <span>All</span>
                        <input
                            type="checkbox"
                            value="All"
                            style={{ display: 'none' }}
                        />
                    </Tab>
                </div>
            </div>
            <div className="details-container">
                <CardsCategoryContainer
                    $selectedTab={selectedTab}
                    id="cards-category-container"
                >
                    {(() => {
                        if (!selectedTab || selectedTab == 'Category') {
                            return (
                                <RenderCards
                                    selectedCategory={filterCategory}
                                    selectedEventType={filterEventType}
                                    sortBy={sortBy}
                                    displayLimit={displayLimit}
                                />
                            );
                        }
                    })()}
                </CardsCategoryContainer>
                <CardsAllContainer
                    $selectedTab={selectedTab}
                    id="cards-all-container"
                >
                    {(() => {
                        if (selectedTab == 'All') {
                            return (
                                <RenderGraph
                                    selectedCategory={filterCategory}
                                    selectedEventType={filterEventType}
                                    sortBy={sortBy}
                                />
                            );
                        }
                    })()}
                </CardsAllContainer>
            </div>
        </DataContainer>
    );
};

export default DataComponent;
