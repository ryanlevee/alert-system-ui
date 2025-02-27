import React, { memo, useState, useCallback, useEffect } from 'react';
import { EventCategory, EventCategoryName } from '../interfaces/interfaces';
import { ColumnIndex } from './List';
import ico from '../common/iconMapping';
import styled from 'styled-components';

export const EventFooter = styled.div<{
    $isClicked: boolean;
}>`
    margin-top: 0;

    & .hidden-container {
        ${props =>
            props.$isClicked
                ? `height: 158px; padding: 4px 0px !important;`
                : `height: 0;  padding: 0;`}
        // overflow: scroll; /* Add overflow hidden to prevent content from showing when height is 0 */
        transition: height 0.42s ease;
    }
`;

export const EventRow = memo(
    ({
        eventCategory,
        columns,
        topFields,
        hideFields,
        selectedCategory,
        selectedEventType,
        colIdx,
        isAllExpanded,
    }: {
        eventCategory: EventCategory;
        columns: string[];
        topFields: string[];
        hideFields: string[];
        selectedCategory: EventCategoryName;
        selectedEventType: string | null;
        colIdx: ColumnIndex;
        isAllExpanded: boolean;
    }) => {
        const [isClicked, setIsClicked] = useState<boolean>(false);

        useEffect(() => {
            setIsClicked(isAllExpanded);
        }, [isAllExpanded]);

        const handleClick = useCallback(() => {
            setIsClicked(!isClicked);
        }, [isClicked]);

        const categoryName = Object.keys(eventCategory)[0];
        const eventData = Object.values(eventCategory)[0];

        const eventType = eventData.type;
        const categoryIcon = ico[categoryName]({
            title: categoryName,
        });

        if (selectedCategory && categoryName != selectedCategory) return null;
        else if (selectedEventType && !(selectedEventType == eventType))
            return null;

        const eventIcon = ico[eventType]({ title: eventType });

        const topData = Object.values(topFields).map(field => {
            return (
                <td
                    id={`${colIdx[field]}-${eventData.uid}`}
                    key={`${colIdx[field]}-${eventData.uid}`}
                    className={`${field}-td`}
                >
                    {eventData[field]}
                </td>
            );
        });

        const dropDownElement = Object.entries(eventData)
            .map(([key, value]) => {
                if (!topFields.includes(key) && !hideFields.includes(key)) {
                    if (!topFields.includes(key)) {
                        return (
                            <div
                                className="dropdown-data-container"
                                key={`${eventData.uid}-${key}-${value}`}
                            >
                                <span className="dropdown-data-key">{key}</span>
                                <span className="dropdown-data-value">
                                    {value || 'n/a'}
                                </span>
                            </div>
                        );
                    }
                }
            }, '')
            .filter(Boolean);

        return (
            <React.Fragment key={`${eventData.uid}-fragment`}>
                <tr
                    onClick={handleClick}
                    id={`${eventData.uid}`}
                    key={eventData.uid}
                    className="event-row"
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
                    {topData}
                </tr>
                <tr className="event-footer-row">
                    <td colSpan={columns.length}>
                        <EventFooter
                            $isClicked={isClicked}
                            className="event-footer-container"
                            key={`${eventData.uid}-footer`}
                        >
                            <div
                                className="hidden-container"
                                key={`${eventData.uid}-hidden`}
                            >
                                <div
                                    className="abs"
                                    key={`${eventData.uid}-abs`}
                                >
                                    {isClicked && dropDownElement}
                                </div>
                            </div>
                        </EventFooter>
                    </td>
                </tr>
            </React.Fragment>
        );
    }
);
