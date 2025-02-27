import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import columnIndex from '../../../../backend/columnIndex.json';
import ico from '../../common/iconMapping';
import { EventCategory, EventCategoryName } from '../../interfaces/interfaces';

type ColumnIndex = Record<string, number>;
const colIdx = columnIndex as ColumnIndex;

const EventFooter = styled.div<{
    $isClicked: boolean;
}>`
    margin-top: 0;

    & .hidden-container {
        height: ${props => (props.$isClicked ? '100px' : '0')};

        transition: height 0.1s ease;
    }
`;

function RenderList({
    selectedCategory,
    selectedEventType,
    sortBy,
    displayLimit,
    eventData,
}: {
    selectedCategory: EventCategoryName;
    selectedEventType: string | null;
    sortBy: string | null;
    displayLimit: string | null;
    eventData: EventCategory[];
}): React.ReactNode | null {
    const [isClickedA, setIsClickedA] = useState<boolean>(false);
    const [isClickedB, setIsClickedB] = useState<boolean>(false);

    const [rowValue, setRow] = useState<string>('');

    const [isClicked, setClicked] = useState<boolean>(false);

    const handleClick = useCallback(() => {
        setClicked(!isClicked);
        console.log('isClicked:', isClicked);
    }, [isClicked]);

    const columns = [
        'Type',
        'Status',
        'Timestamp',
        'Location',
        'Description',
        'Severity',
        'Event ID',
    ];

    const fields = [
        'status',
        'event_date',
        'event_location',
        'description',
        'severity_level',
        'event_id',
    ];

    const limitCount = eventData.reduce(
        (acc, obj) => ((acc[Object.keys(obj)[0]] = 0), acc),
        {}
    ) as LimitTracker;

    const sortedEvents = eventData.sort((a, b) => {
        const aEvent = Object.values(a)[0];
        const bEvent = Object.values(b)[0];
        const aDate = new Date(aEvent.event_date);
        const bDate = new Date(bEvent.event_date);
        return bDate - aDate;
    });

    return (
        <table className="event-table">
            <thead>
                <tr>
                    {columns.map((h, i) => {
                        const iKey = i - 1;
                        return (
                            <th
                                id={`${colIdx[fields[iKey]] || iKey}`}
                                key={colIdx[fields[iKey]] || iKey}
                            >
                                {h}
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {sortedEvents.map((eventCategory, iOut) => {
                    const categoryName = Object.keys(eventCategory)[0];
                    const event = Object.values(eventCategory)[0];
                    const eventType = event.type;

                    const categoryIcon = ico[categoryName]({
                        title: categoryName,
                    });

                    if (selectedCategory && categoryName != selectedCategory)
                        return null;
                    else if (
                        selectedEventType &&
                        !(selectedEventType == eventType)
                    )
                        return null;

                    limitCount[categoryName] += 1;

                    if (
                        displayLimit &&
                        parseInt(limitCount[categoryName]) >
                            parseInt(displayLimit)
                    )
                        return null;

                    const eventIcon = ico[eventType]({ title: eventType });

                    return (
                        <React.Fragment key={`${event.uid}-fragment`}>
                            <tr
                                onClick={handleClick}
                                id={`${event.uid}`}
                                key={event.uid}
                                className="event-item"
                                style={{ zIndex: '1' }}
                            >
                                <td className="event-category-td">
                                    <div className="event-category-container">
                                        <div className="event-category">
                                            <div>{categoryIcon}</div>
                                            <div
                                                style={{
                                                    paddingLeft: '7px',
                                                }}
                                            >
                                                {categoryName}
                                            </div>
                                        </div>
                                        <div className="event-sub-category">
                                            <div>{eventIcon}</div>
                                            <div
                                                style={{
                                                    paddingLeft: '7px',
                                                }}
                                            >
                                                {eventType}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                {Object.values(fields).map(field => {
                                    return (
                                        <td
                                            id={`${colIdx[field]}-${event.uid}`}
                                            key={`${colIdx[field]}-${event.uid}`}
                                        >
                                            {event[field]}
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="event-item"
                                >
                                    <EventFooter
                                        $isClicked={isClicked}
                                        className="event-footer-container"
                                        key={`${event.uid}-footer`}
                                    >
                                        <div className="event-footer">
                                            <div className="hidden-container">
                                                {isClicked && (
                                                    <span>
                                                        <div>
                                                            {event.description}
                                                        </div>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </EventFooter>
                                </td>
                            </tr>
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
}

export default RenderList;
