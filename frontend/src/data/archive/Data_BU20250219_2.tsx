import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import data from '../../../../backend/data.json'; // Import your JSON data
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaRegStar, FaClinicMedical, FaCloudShowersHeavy, FaLightbulb, FaMeteor } from 'react-icons/fa';
import Select, { ActionMeta, SingleValue } from 'react-select';
import {  // Import the interfaces
    EventCategory,
    EventCategoryType,
    EventDetailsBase,
    eventData
} from '../../interfaces/interfaces'; // Import from the new file


const DataContainer = styled.div`
    padding: 20px;
`;

const CategoryRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    padding: 0;
`;

const TypeCard = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 6px;
    width: 350px;
    height: 200px;
    box-shadow: 2px 2px 5px #eee;
    display: flex;
    flex-direction: column;
`;

const CardTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
`;

const BarGraphContainer = styled.div`
    height: 175px;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const severityOrder = ["Minor", "Very Low", "Low", "Medium", "High", "Critical"] as const;
type SeverityLevel = typeof severityOrder[number];

// Define the structure for structuredData and filteredData
interface StructuredData {
    [category: string]: {
        [eventType: string]: {
            severityCounts: {
                [level in SeverityLevel]: number;
            };
            totalCount: number;
        };
    };
}

function RenderCards({ selectedCategory, selectedEventType, sortBy }: {
    selectedCategory: string | null;
    selectedEventType: string | null;
    sortBy: string | null;
}): React.ReactNode | null {

    const structuredData = eventData.reduce((categories, item) => {
        const categoryName = Object.keys(item)[0];
        const eventDetails = item[categoryName];
        const eventType = eventDetails.type;
        const severityLevel = eventDetails.severity_level;

        // let categoryIcon: React.ReactElement;
        // switch (categoryName) {
        //     case 'Safety':
        //         categoryIcon = <FaClinicMedical />;
        //         break;
        //     default:
        //         categoryIcon = <FaClinicMedical />;
        //         break;
        // }

        if (!categories[categoryName]) {
            categories[categoryName] = {};
        }
        if (!categories[categoryName][eventType]) {
            categories[categoryName][eventType] = {
                severityCounts: { "Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Very Low": 0, "Minor": 0 },
                totalCount: 0 // Initialize totalCount
            };
        }
        categories[categoryName][eventType].severityCounts[severityLevel] = (categories[categoryName][eventType].severityCounts[severityLevel] || 0) + 1;
        categories[categoryName][eventType].totalCount += 1; // Increment totalCount

        return categories;
    }, {});

    return Object.entries(structuredData).map(([categoryName, eventTypes]) => {
        if (!eventTypes) {
            return null;
        }

        if (selectedCategory && categoryName != selectedCategory) return null;
        else if (selectedEventType && !selectedEventType in eventTypes) return null;

        // console.log('eventTypes:', eventTypes);
        // console.log('selectedEventType:', selectedEventType);
        // console.log(
        //     '!(selectedCategory && categoryName != selectedCategory):',
        //     !(selectedCategory && categoryName != selectedCategory)
        // );
        // console.log(
        //     '!(selectedEventType && !selectedEventType in eventTypes):',
        //     !(selectedEventType && !selectedEventType in eventTypes)
        // );


        const sortedCategoryTypes = Object.entries(eventTypes)
            .sort(([typeA, typeDataA], [typeB, typeDataB]) => {
                // console.log('typeA:', typeA);
                // console.log('typeDataA:', typeDataA);
                // console.log('typeB:', typeB);
                // console.log('typeDataB:', typeDataB);

                switch (sortBy) {
                    case 'frequency':
                        return typeDataB.totalCount - typeDataA.totalCount;

                    case 'alphabetical':
                        return typeA > typeB ? 1 : typeA < typeB ? -1 : 0;

                    default:
                        return typeDataB.totalCount - typeDataA.totalCount;
                }

            });

        return (
            <div id="category-container" key={categoryName}>
                <h3 id="category-header">{
                    categoryName == 'Safety' ? <FaClinicMedical /> :
                        categoryName == 'Weather' ? <FaCloudShowersHeavy /> :
                            categoryName == 'Operations' ? <FaLightbulb /> :
                                categoryName == 'Disaster' ? <FaMeteor /> :
                                    null

                } {categoryName}</h3>
                <CategoryRow>
                    {sortedCategoryTypes.map(([typeName, typeData], index) => {
                        // if (index >= 4) return null; // 4. Limit to 4 cards
                        if (selectedEventType && selectedEventType != typeName) return null;

                        const chartData = severityOrder.map(level => ({
                            severity: level,
                            count: typeData.severityCounts[level] || 0,
                        }));

                        return (
                            <TypeCard className={`card-container ${categoryName}`} key={`${categoryName}-${typeName}`}>
                                <CardTitle className="card-title-container">
                                    <div className="card-title">
                                        <div className="card-title-flex">
                                            <div>{typeName}</div>
                                            <div><FaRegStar /></div>
                                        </div>
                                        <div id="type-count">total: {typeData.totalCount}</div>
                                    </div>
                                </CardTitle>
                                <BarGraphContainer>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <XAxis
                                                dataKey="severity"
                                                tickSize={4}
                                                // tickAngle={-45}
                                                interval={0}
                                                height={25}
                                                label={{ value: 'Severity Level', position: 'bottom', offset: 10 }}
                                                tick={{ fontSize: 12 }}
                                                // domain={severityOrder}
                                                type="category"
                                                // axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                width={1}
                                                tickCount={1}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip />
                                            <Bar
                                                barSize={25}
                                                dataKey="count" fill="#9fc4ff"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </BarGraphContainer>
                            </TypeCard>
                        );
                    })}
                </CategoryRow>
            </div>
        );
    });

}


const DataComponent: React.FC = () => {
    // const [structuredData, setStructuredData] = useState<StructuredData>({});
    // const [filteredData, setFilteredData] = useState<StructuredData>({});

    const [sortBy, setSortBy] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [filterEventType, setFilterEventType] = useState<string | null>(null);

    // const applyFiltersAndSort = (
    //     structuredData,
    //     sortBy,
    //     filterCategory,
    //     filterEventType,
    //     availableEventTypes,
    //     setFilteredData
    // ) => {
    //     let filtered: StructuredData = { ...structuredData };

    //     // Category filter
    //     if (filterCategory) {
    //         filtered = Object.fromEntries(
    //             Object.entries(filtered).filter(([category]) => category === filterCategory)
    //         );
    //     }

    //     const availableEventTypeArr = availableEventTypes.map(({ value }) => value);

    //     if (filterEventType && availableEventTypeArr.includes(filterEventType)) {
    //         const newFiltered: StructuredData = {};
    //         for (const category in filtered) {
    //             newFiltered[category] = Object.fromEntries(
    //                 Object.entries(filtered[category]).filter(([typeName]) => typeName === filterEventType)
    //             );
    //         }
    //         filtered = newFiltered;
    //     }

    //     const sortedData: StructuredData = Object.entries(filtered).reduce((acc: StructuredData, [category, data]) => {
    //         const sortedCategoryTypes = Object.entries(data).sort(([typeNameA, typeDataA], [typeNameB, typeDataB]) => {
    //             switch (sortBy) {
    //                 case 'frequency': return typeDataB.totalCount - typeDataA.totalCount;
    //                 case 'alphabetical': return typeNameA.localeCompare(typeNameB);
    //                 default: return typeDataB.totalCount - typeDataA.totalCount;
    //             }
    //         });
    //         acc[category] = Object.fromEntries(sortedCategoryTypes);
    //         return acc;
    //     }, {});

    //     setFilteredData(sortedData);
    // };
    // // const [forceUpdate, setForceUpdate] = useState(false); // Removed forceUpdate
    // const [displayLimit, setDisplayLimit] = useState<number | typeof Infinity>(4); // Default to top 4, can be number or Infinity

    // const areArraysEqual = (arr1: string[], arr2: string[]) => { // typed arr1 and arr2
    //     if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    //     for (let i = 0; i < arr1.length; i++) {
    //         if (arr1[i] !== arr2[i]) return false;
    //     }
    //     return true;
    // };

    // useEffect(() => {
    //     // Update available types based on selected category
    //     let newAvailableTypes;
    //     if (filterCategory === 'All') {
    //         const allTypes = Object.values(structuredData).flatMap(data => Object.keys(data));
    //         newAvailableTypes = ['All', ...Array.from(new Set(allTypes))];
    //     } else {
    //         const data = structuredData[filterCategory];
    //         if (data) {
    //             newAvailableTypes = ['All', ...Object.keys(data)];
    //         } else {
    //             newAvailableTypes = ['All']; // Handle case where category is not found
    //         }
    //     }

    //     if (!areArraysEqual(availableTypes, newAvailableTypes)) { // Compare arrays
    //         setAvailableTypes(newAvailableTypes);
    //     }

    //     // Reset the type filter if it's no longer available
    //     if (!availableTypes.includes(filterEventType)) { // Still using current availableTypes here - this should be fine now as we control setAvailableTypes
    //         setFilterEventType('All');
    //     }

    // }, [filterCategory, structuredData, filterEventType, availableTypes]); // Added filterEventType, availableTypes to dependency array

    // useEffect(() => {
    //     const initialStructuredData = eventData.reduce((categories, item) => {
    //         const category = Object.keys(item)[0];
    //         const eventDetails = item[category] as EventCategory;
    //         const eventType = eventDetails.type;
    //         const severityLevel = eventDetails.severity_level;

    //         // let categoryIcon: React.ReactElement;
    //         // switch (category) {
    //         //     case 'Safety':
    //         //         categoryIcon = <FaClinicMedical />;
    //         //         break;
    //         //     default:
    //         //         categoryIcon = <FaClinicMedical />;
    //         //         break;
    //         // }

    //         if (!categories[category]) {
    //             categories[category] = {};
    //         }
    //         if (!categories[category][eventType]) {
    //             categories[category][eventType] = {
    //                 severityCounts: { "Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Very Low": 0, "Minor": 0 },
    //                 totalCount: 0 // Initialize totalCount
    //             };
    //         }
    //         categories[category][eventType].severityCounts[severityLevel] = (categories[category][eventType].severityCounts[severityLevel] || 0) + 1;
    //         categories[category][eventType].totalCount += 1; // Increment totalCount

    //         return categories;
    //     }, {} as StructuredData);

    //     setStructuredData(initialStructuredData);
    //     // setFilteredData(initialStructuredData); // Initialize filtered data with all data
    // }, []);

    // const handleDisplayLimitChange = useCallback((
    //     newValue: SingleValue<{ value: string; label: string; }>,
    //     actionMeta: ActionMeta<{ value: string; label: string; }>
    // ) => {
    //     setDisplayLimit(newValue?.value || null);
    // }, [sortBy]);

    // const handleDisplayLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setDisplayLimit(event.target.value === 'All' ? Infinity : parseInt(event.target.value, 10)); // Convert to number or Infinity
    // };

    const handleSortChange = useCallback((
        newValue: SingleValue<{ value: string; label: string; }>,
        actionMeta: ActionMeta<{ value: string; label: string; }>
    ) => {
        setSortBy(newValue?.value || null);
    }, [sortBy]);

    const handleCategoryChange = useCallback((
        newValue: SingleValue<{ value: string; label: string; }>,
        actionMeta: ActionMeta<{ value: string; label: string; }>
    ) => {
        setFilterCategory(newValue?.value || null);
    }, [filterCategory]);

    // useEffect(() => {
    //     setFilterEventType(null);
    // }, [filterCategory]);

    const handleEventTypeChange = useCallback((
        newValue: SingleValue<{ value: string; label: string; }>,
        actionMeta: ActionMeta<{ value: string; label: string; }>
    ) => {
        setFilterEventType(newValue?.value || null);
    }, [filterEventType]);

    const availableCategories = React.useMemo(() => {
        return [...Array.from(new Set(eventData.map((event) => Object.keys(event)[0])))].map((event) => ({
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
        return <p>Error loading event data or data is not in the correct format.</p>;
    }

    // useEffect(() => {
    //     applyFiltersAndSort(structuredData, sortBy, filterCategory, filterEventType, availableEventTypes, setFilteredData);
    // }, [structuredData, sortBy, filterCategory, filterEventType]);

    // const allTypes = Object.values(structuredData).flatMap(data => Object.keys(data));
    // const uniqueTypes = ['All', ...Array.from(new Set(allTypes))];

    return (
        <div className="data-container">
            <DataContainer>
                <h4>React Demo &#8250; <span>Data Dashboard</span></h4>
                <h2 id="page-title">data</h2>


                <div id="top-container">
                    <div id='filter-container-outer'>
                        <div id="filter-container-inner">
                            <div>
                                <Select
                                    options={
                                        [
                                            { value: 'frequency', label: 'frequency (default)' },
                                            { value: 'alphabetical', label: 'alphabetical' }
                                        ]
                                    }
                                    id="sort-by"
                                    onChange={handleSortChange}
                                    placeholder="Sort by..."
                                    isClearable={true}
                                    value={sortBy ? { value: sortBy, label: sortBy } : null} // ADD THIS LINE
                                />
                            </div>
                            <div>
                                <Select
                                    options={availableCategories}
                                    id="category-select"
                                    onChange={handleCategoryChange}
                                    placeholder="Category..."
                                    isClearable={true}
                                    value={filterCategory ? { value: filterCategory, label: filterCategory } : null} // ADD THIS LINE
                                />
                            </div>
                            <div>
                                <Select
                                    options={availableEventTypes}
                                    id="event-type-select"
                                    onChange={handleEventTypeChange}
                                    isDisabled={!filterCategory || filterCategory === "Categories"}
                                    placeholder="Event Type..."
                                    isClearable={true}
                                    value={filterEventType ? { value: filterEventType, label: filterEventType } : null} // ADD THIS LINE
                                />
                            </div>

                        </div>
                    </div>
                </div>

                <RenderCards
                    // eventData={eventData}
                    selectedCategory={filterCategory}
                    selectedEventType={filterEventType}
                    sortBy={sortBy}
                />
                {/* 
                <div>
                    <label htmlFor="display-limit">Show:</label>
                    <select id="display-limit" value={displayLimit === Infinity ? 'All' : displayLimit} onChange={handleDisplayLimitChange}>
                        <option value="4">Top 4</option>
                        <option value="All">All</option>
                    </select>
                </div> */}

            </DataContainer>
        </div>
    );
};

export default DataComponent;;