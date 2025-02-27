import React, { JSX } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ico from '../../common/iconMapping';
import { EventCategoryName, eventData } from '../../interfaces/interfaces'; // Import from the new file
import styled from 'styled-components';

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
    // padding: 20px;
    width: 450px;
    height: 225px;
    box-shadow: 2px 2px 5px #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CardTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
`;

const BarGraphContainer = styled.div`
    height: 150px;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const CardFooter = styled.h3`
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
`;

const severityOrder = [
    'Minor',
    'Very Low',
    'Low',
    'Medium',
    'High',
    'Critical',
] as const;

type SeverityLevel = (typeof severityOrder)[number];

interface StructuredData {
    [category: string]: {
        [eventType: string]: {
            severityCounts: {
                [level in SeverityLevel]: number;
            };
            totalCount: number;
            icon: React.ReactElement;
            year2025: number;
            year2024: number;
        };
    };
}

function RenderCards({
    selectedCategory,
    selectedEventType,
    sortBy,
    displayLimit,
}: {
    selectedCategory: EventCategoryName;
    selectedEventType: string | null;
    sortBy: string | null;
    displayLimit: string | null;
}): React.ReactNode | null {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    const structuredData = eventData.reduce((acc, item) => {
        const categoryName = Object.keys(item)[0];
        const eventDetails = item[categoryName];
        const eventType = eventDetails.type as string;
        const severityLevel = eventDetails.severity_level;
        const eventYear = new Date(item[categoryName].event_date).getFullYear();

        if (!acc[categoryName]) {
            acc[categoryName] = {};
        }

        let accEventType = acc[categoryName][eventType];

        if (!accEventType) {
            accEventType = {
                severityCounts: {
                    Critical: 0,
                    High: 0,
                    Medium: 0,
                    Low: 0,
                    'Very Low': 0,
                    Minor: 0,
                },
                totalCount: 0, // Initialize totalCount
                [`year${currentYear}`]: 0,
                [`year${lastYear}`]: 0,
            };
        }

        accEventType.severityCounts[severityLevel] =
            (accEventType.severityCounts[severityLevel] || 0) + 1;

        accEventType.totalCount += 1; // Increment totalCount
        accEventType[`year${eventYear}`] += 1; // Increment [eventYear] count

        accEventType.icon = ico[eventType]({ title: eventType });

        acc[categoryName][eventType] = accEventType;

        return acc;
    }, {}) as StructuredData;

    return Object.entries(structuredData).map(([categoryName, eventTypes]) => {
        if (!eventTypes) {
            return null;
        }

        if (selectedCategory && categoryName != selectedCategory) return null;
        else if (selectedEventType && !(selectedEventType in eventTypes))
            return null;

        const sortedCategoryTypes = Object.entries(eventTypes).sort(
            ([typeA, typeDataA], [typeB, typeDataB]) => {
                switch (sortBy) {
                    case 'Frequency':
                        return typeDataB.totalCount - typeDataA.totalCount;
                    case 'Alphabetical':
                        return typeA > typeB ? 1 : typeA < typeB ? -1 : 0;
                    default:
                        return typeDataB.totalCount - typeDataA.totalCount;
                }
            }
        );

        const categoryIcon = ico[categoryName]({ title: categoryName });

        return (
            <div id="category-container" key={categoryName}>
                <h3 id="category-header">
                    {categoryIcon} {categoryName}
                </h3>
                <CategoryRow>
                    {sortedCategoryTypes.map(([typeName, typeData], index) => {
                        if (
                            !selectedEventType &&
                            displayLimit != 'All' &&
                            index >= parseInt(displayLimit || '3')
                        )
                            return null;

                        if (selectedEventType && selectedEventType != typeName)
                            return null;

                        const chartData = severityOrder.map(level => ({
                            severity: level,
                            count: typeData.severityCounts[level] || 0,
                        }));

                        const currentYearCount = typeData.year2025;
                        const lastYearCount = typeData.year2024;

                        let operator: JSX.Element;
                        let percentChange: string | typeof operator;
                        let footerClass: string;

                        const up = (<FaArrowUp />) as typeof operator;
                        const dn = (<FaArrowDown />) as typeof operator;

                        if (lastYearCount == 0) {
                            operator = up;
                            percentChange = (
                                <span style={{ fontSize: '16px' }}>
                                    &#8734;
                                </span>
                            );
                        } else if (currentYearCount == 0) {
                            operator = dn;
                            percentChange = `100`;
                        } else {
                            const change = lastYearCount / currentYearCount;
                            operator = change > 1 ? dn : up;
                            percentChange = `${change * 100}`;
                        }

                        footerClass = operator == up ? 'plus' : 'minus';

                        return (
                            <TypeCard
                                className={`$card-container ${categoryName}`}
                                key={`${categoryName}-${typeName}`}
                            >
                                <CardTitle className="card-title-container">
                                    <div className="card-title">
                                        <div className="card-title-flex">
                                            <div className="card-title-flex">
                                                <div>{typeData.icon}</div>
                                                <div
                                                    style={{
                                                        paddingLeft: '7px',
                                                    }}
                                                >
                                                    {typeName}
                                                </div>
                                            </div>
                                            <div>
                                                <ico.Favorite />
                                            </div>
                                        </div>
                                        <div
                                            id="type-count"
                                            style={{ paddingLeft: '20px' }}
                                        >
                                            total: {typeData.totalCount}
                                        </div>
                                    </div>
                                </CardTitle>
                                <BarGraphContainer>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            className="card-graph"
                                            data={chartData}
                                        >
                                            <XAxis
                                                dataKey="severity"
                                                tickSize={4}
                                                // tickAngle={-45}
                                                interval={0}
                                                height={25}
                                                label={{
                                                    value: 'Severity Level',
                                                    position: 'bottom',
                                                    offset: 10,
                                                }}
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
                                                dataKey="count"
                                                fill="#9fc4ff"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </BarGraphContainer>

                                <CardFooter className="card-footer-container">
                                    <div className="card-footer">
                                        <span className={footerClass}>
                                            {operator}
                                            {percentChange}%
                                        </span>
                                        <span className="from-last-year">
                                            {' '}
                                            from prev. year
                                        </span>
                                    </div>
                                </CardFooter>
                            </TypeCard>
                        );
                    })}
                </CategoryRow>
            </div>
        );
    });
}

export default RenderCards;
