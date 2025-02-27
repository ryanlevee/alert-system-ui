import React, { memo, useState, useCallback, useEffect } from 'react';
import { EventCategory, EventCategoryName } from '../../interfaces/interfaces';
import { ColumnIndex, EventFooter } from '../List';
import ico from '../../common/iconMapping';

export const EventRow = memo(
    ({
        eventCategory,
        columns,
        fields,
        selectedCategory,
        selectedEventType,
        colIdx,
        num,
        isAllExpanded,
        // setIsAllExpanded,
    }: {
        eventCategory: EventCategory;
        columns: string[];
        fields: string[];
        selectedCategory: EventCategoryName;
        selectedEventType: string | null;
        colIdx: ColumnIndex;
        num: number;
        isAllExpanded: boolean;
        // setIsAllExpanded: React.Dispatch;
    }) => {
        const [isClicked, setIsClicked] = useState<boolean>(false);

        // if (num == 0)
            // console.log(`top of EventRow > isAllExpanded ${num}:`, isAllExpanded);

        useEffect(() => {
            console.log('useEffect(() => setIsClicked(false)')
            setIsClicked(isAllExpanded)
            // if (isAllExpanded) {
            //     console.log('if (IsAllExpanded) > setIsClicked(!isAllExpanded)', !isAllExpanded);

            //     setIsClicked(!isAllExpanded);
            //     // } else {
            //     //     console.log(
            //     //         'else > setIsClicked(!isClicked) -- !isClicked =',
            //     //         !isClicked
            //     //     );
            //     //     setIsClicked(!isClicked);
            // }
        }, [isAllExpanded]);

        const handleClick = useCallback(() => {
            console.log('const handleClick = useCallback(() => isAllExpanded:', isAllExpanded)
            console.log('const handleClick = useCallback(() => setIsClicked(!isClicked):', !isClicked)
            setIsClicked(!isClicked);

            // if (isAllExpanded) {
            //     console.log('ifIsAllExpanded > setIsClicked(false)');

            //     setIsClicked(false);
            // } else {
            //     console.log(
            //         'else > setIsClicked(!isClicked) -- !isClicked =',
            //         !isClicked
            //     );
            //     setIsClicked(!isClicked);
            // }

        }, [isClicked]);
        // }, [isClicked, isAllExpanded]);

        const categoryName = Object.keys(eventCategory)[0];
        const event = Object.values(eventCategory)[0];
        const eventType = event.type;

        const categoryIcon = ico[categoryName]({
            title: categoryName,
        });

        if (selectedCategory && categoryName != selectedCategory) return null;
        else if (selectedEventType && !(selectedEventType == eventType))
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
                    <td className="num">{num}</td>
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
                <tr className="event-footer-item">
                    <td colSpan={columns.length}>
                        <EventFooter
                            $isClicked={
                                isClicked
                                // isAllExpanded ? false : isClicked
                                // isAllExpanded || isClicked
                                // isAllExpanded || (!isAllExpanded && isClicked)
                            }
                            className="event-footer-container"
                            key={`${event.uid}-footer`}
                        >
                            <div className="event-footer">
                                <div className="hidden-container">
                                    {/* {(isClicked || isAllExpanded) && ( */}
                                    {isClicked && (
                                        <span>
                                            <div>{event.description}</div>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </EventFooter>
                    </td>
                </tr>
            </React.Fragment>
        );
    }
);
