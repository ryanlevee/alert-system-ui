import React from 'react';
import styled from 'styled-components';
import ico from '../common/iconMapping';
import { EventCategoryName, eventData } from '../interfaces/interfaces';
import TypeCardComponent from './TypeCard';
import categoryIndex from '../../../backend/categoryIndex.json';

const CategoryRow = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    padding: 0;
`;

const severityOrder = [
    'Minor',
    'Very Low',
    'Low',
    'Medium',
    'High',
    'Critical',
] as const;

export type SeverityLevel = (typeof severityOrder)[number];

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
                totalCount: 0,
                [`year${currentYear}`]: 0,
                [`year${lastYear}`]: 0,
            };
        }

        accEventType.severityCounts[severityLevel] =
            (accEventType.severityCounts[severityLevel] || 0) + 1;

        accEventType.totalCount += 1;
        accEventType[`year${eventYear}`]++;

        accEventType.icon = ico[eventType]({ title: eventType });

        acc[categoryName][eventType] = accEventType;

        return acc;
    }, {}) as StructuredData;

    const sortedData = Object.entries(structuredData).sort(
        ([categoryNameA], [categoryNameB]) => {
            const indexA =
                categoryIndex[categoryNameA as keyof typeof categoryIndex];
            const indexB =
                categoryIndex[categoryNameB as keyof typeof categoryIndex];

            const safeIndexA = typeof indexA === 'number' ? indexA : Infinity;
            const safeIndexB = typeof indexB === 'number' ? indexB : Infinity;

            return safeIndexA - safeIndexB;
        }
    );

    return sortedData.map(([categoryName, eventTypes]) => {
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

                        return (
                            <TypeCardComponent
                                key={`${categoryName}-${typeName}`}
                                typeName={typeName}
                                typeData={typeData}
                                categoryName={categoryName}
                                severityOrder={severityOrder}
                            />
                        );
                    })}
                </CategoryRow>
            </div>
        );
    });
}

export default RenderCards;
