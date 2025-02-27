import React from 'react';
import columnIndex from '../../../../backend/columnIndex.json';
import { EventCategory, EventCategoryName } from '../../interfaces/interfaces';
import { EventRow } from '../Row';

export type ColumnIndex = Record<string, number>;
const colIdx = columnIndex as ColumnIndex;

function RenderList({
    selectedCategory,
    selectedEventType,
    displayLimit,
    eventData,
    isAllExpanded,
}: {
    selectedCategory: EventCategoryName;
    selectedEventType: string | null;
    displayLimit: string | null;
    eventData: EventCategory[];
    isAllExpanded: boolean;
}): React.ReactNode | null {
    const columns = [
        'Type',
        'Status',
        'Timestamp',
        'Location',
        'Description',
        'Severity',
        'Event ID',
    ];

    const topFields = [
        'status',
        'event_date',
        'event_location',
        'description',
        'severity_level',
        'event_id',
    ];

    const hideFields = ['uid', 'ip_address'];

    const limitCount = eventData.reduce(
        (acc, obj) => ((acc[Object.keys(obj)[0]] = 0), acc),
        {}
    );

    const sortedEvents = eventData.sort((a, b) => {
        const aEvent = Object.values(a)[0];
        const bEvent = Object.values(b)[0];

        const aDate = new Date(aEvent.event_date);
        const bDate = new Date(bEvent.event_date);
        return bDate - aDate;
    });

    const limitedEvents = sortedEvents.filter(eventCategory => {
        const categoryName = Object.keys(eventCategory)[0];
        limitCount[categoryName] += 1;

        if (
            displayLimit != 'All' &&
            parseInt(limitCount[categoryName]) > parseInt(displayLimit)
        ) {
            return false;
        }
        return true;
    });

    return (
        <table className="event-table">
            <thead>
                <tr>
                    {columns.map((h, i) => {
                        const iKey = i - 1;
                        return (
                            <th
                                id={`${colIdx[topFields[iKey]] || iKey}`}
                                key={colIdx[topFields[iKey]] || iKey}
                            >
                                {h}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {limitedEvents.map((eventCategory, i) => (
                    <EventRow
                        key={`${Object.values(eventCategory)[0].uid}-row`}
                        eventCategory={eventCategory}
                        columns={columns}
                        topFields={topFields}
                        hideFields={hideFields}
                        selectedCategory={selectedCategory}
                        selectedEventType={selectedEventType}
                        colIdx={colIdx}
                        isAllExpanded={isAllExpanded}
                    />
                ))}
            </tbody>
        </table>
    );
}

export default RenderList;
