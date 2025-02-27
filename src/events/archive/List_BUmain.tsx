import React, {
    JSX,
    useCallback,
    useState,
    MouseEvent,
    BaseSyntheticEvent,
} from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import styled from 'styled-components';
import { EventCategory, EventCategoryName } from '../../interfaces/interfaces';
import ico from '../../common/iconMapping';
import { ActionMeta, SingleValue } from 'react-select';
import columnIndex from '../../../backend/columnIndex.json';

type ColumnIndex = Record<string, number>;
const colIdx = columnIndex as ColumnIndex;

// height: ${props => (props.$isClickedA ? '500px' : 'revert')};

const EventFooter = styled.div<{
    // $isClickedA: boolean;
    // $isClickedB: boolean;
    // $clickValue: string;
    // $rowValue: string;
    
    $isClicked: boolean;
}>`
    margin-top: 0;
    // margin-bottom: 10px;
    // text-align: center;

    & .hidden-container {
        height: ${
            props =>
            // props.$isClickedB //&& props.$clickValue == props.$rowValue
            props.$isClicked ? '100px' : '0'};

        transition: height 0.1s ease;
    }
`;

// const clickableRow = styled.div<{}>``

function EventFooterComponent({
    data,
    categoryName,
    eventType,
    i,
    isClicked,
}: {
    data: EventCategory;
    categoryName: EventCategoryName;
    eventType: string;
    i: number;
    isClicked: boolean;
}) {
    const [isClickedA, setIsClickedA] = useState<boolean>(false); // 1. Initialize state
    const [isClickedB, setIsClickedB] = useState<boolean>(false); // 1. Initialize state

    const handleClickDivA = () => {
        if (isClickedA) {
            setIsClickedA(false);
        } else {
            // setIsClickedA(true);
            // setTimeout(() => {
            setIsClickedA(true);
            // }, 125);
        }
        handleClickDivB();
    };

    const handleClickDivB = () => {
        if (isClickedB) {
            setIsClickedB(false);
        } else {
            setTimeout(() => {
                setIsClickedB(true);
            }, 400);
        }
    };

    return (
        <EventFooter
            $isClickedA={isClickedA}
            $isClickedB={isClickedB}
            className="event-footer-container"
            key={data.uid}
        >
            <div className="event-footer">
                <div className="hidden-container">
                    {isClickedB && (
                        <span>
                            <div>{data.description}</div>
                        </span>
                    )}
                </div>

                <div
                    className="chevron-icon-container"
                    onClick={handleClickDivA}
                >
                    {(!isClickedA && <FaChevronUp />) || <FaChevronDown />}
                </div>
            </div>
        </EventFooter>
    );
}

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
    const [isClickedA, setIsClickedA] = useState<boolean>(false); // 1. Initialize state
    const [isClickedB, setIsClickedB] = useState<boolean>(false); // 1. Initialize state

    // const [isClicked, setClicked] = useState<boolean>(false);
    const [rowValue, setRow] = useState<string>('');

    // const ChildComponent = React.memo(({ onClick }) => {
    //     console.log('ChildComponent rendered');
    //     return <button onClick={onClick}>Click Me</button>;
    // });

    // const handleClickDivA = (value: string) => {
    //     console.log('handleClickDivA isClickedA:', isClickedA);
    //     if (isClickedA) {
    //         setIsClickedA(false);
    //     } else {
    //         setIsClickedA(true);
    //     }
    //     handleClickDivB(value);
    //     if (value == rowValue) {
    //         ////
    //     }
    //     setRow(value);
    // };

    // const handleClickDivB = (value: string) => {
    //     console.log('handleClickDivB isClickedB:', isClickedB);
    //     console.log('');
    //     if (isClickedB) {
    //         setIsClickedB(false);
    //     } else {
    //         console.log('timeout ');
    //         setTimeout(() => {
    //             setIsClickedB(true);
    //         }, 125);
    //     }
    // };

    // function handleClicked(value) {
    //     setClicked(!isClicked);
    //     setRow(value);
    //     // console.log(rowValue);
    // }

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

                    // const clickValue = `${categoryName}-${eventType}-${iOut + 1000}`;

                    return (
                        <React.Fragment key={`${event.uid}-fragment`}>
                            <tr
                                onClick={handleClick}
                                // onClick={() =>
                                //     // clickValue == rowValue &&
                                //     // isClickedA &&
                                //     // !isClickedA &&
                                //     handleClickDivA(clickValue)
                                // }
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
                                        {/* <div className="ico-favorite-container">
                                    <ico.Favorite className="ico-favorite" />
                                    </div> */}
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
                                    // onClick={() => handleClickDivA(clickValue)}
                                >
                                    <EventFooter
                                        // $isClickedA={isClickedA}
                                        // $isClickedB={isClickedB}
                                        // $clickValue={clickValue}
                                        // $rowValue={rowValue}
                                        $isClicked={isClicked}
                                        className="event-footer-container"
                                        key={`${event.uid}-footer`}
                                    >
                                        {/* {clickValue == rowValue && ( */}
                                            <div className="event-footer">
                                                <div className="hidden-container">
                                                    {isClicked && (
                                                    // {isClickedB && (
                                                        // clickValue == rowValue &&
                                                        <span>
                                                            <div>
                                                                {
                                                                    event.description
                                                                }
                                                            </div>
                                                        </span>
                                                    )}
                                                </div>
                                                {/* 
                                        <div
                                            className="chevron-icon-container"
                                            onClick={handleClickDivA}
                                        >
                                            {(!isClickedA && (
                                                <FaChevronUp />
                                            )) || <FaChevronDown />}
                                        </div> */}
                                            </div>
                                        {/* )} */}
                                    </EventFooter>
                                    {/* 
                                <EventFooter
                                    $isClickedA={isClickedA}
                                    $isClickedB={isClickedB}
                                    className="event-footer-container"
                                    key={`${categoryName}-${eventType}-${iOut + 4000}`}
                                >
                                    <div className="event-footer">
                                        {isClickedB &&
                                            clickValue == rowValue && (
                                                <div className="hidden-container">
                                                    <span>
                                                        <div>
                                                            {event.description}
                                                        </div>
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </EventFooter> */}
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
