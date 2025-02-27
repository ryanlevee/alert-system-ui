import React, { JSX, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import styled from "styled-components";
import { EventCategory, EventCategoryName } from "../../interfaces/interfaces";
import ico from "../../common/iconMapping";

const EventFooter = styled.div<{ $isClickedA: boolean; $isClickedB: boolean }>`
    margin-top: 0;
    margin-bottom: 10px;
    // text-align: center;

    // height: ${(props) => (props.$isClickedA ? "500px" : "revert")};

    & .hidden-container {
        height: ${(props) => (props.$isClickedA ? "100px" : "0")};

        transition: height 0.25s ease;
    }
`;

function EventFooterComponent({
    data,
    categoryName,
    eventType,
    i,
}: {
    data: EventCategory;
    categoryName: EventCategoryName;
    eventType: string;
    i: number;
}) {
    const [isClickedA, setIsClickedA] = useState<boolean>(false); // 1. Initialize state
    const [isClickedB, setIsClickedB] = useState<boolean>(false); // 1. Initialize state

    const handleClickDivA = () => {
        if (isClickedA) {
            setIsClickedA(false);
        } else {
            setIsClickedA(true);
        }
        handleClickDivB();
    };

    const handleClickDivB = () => {
        if (isClickedB) {
            setIsClickedB(false);
        } else {
            setTimeout(() => {
                setIsClickedB(true);
            }, 125);
        }
    };
    return (
        <EventFooter
            $isClickedA={isClickedA}
            $isClickedB={isClickedB}
            className="event-footer-container"
            key={`${categoryName}-${eventType}-${i + 4000}`}
        >
            <div className="event-footer">
                <div className="hidden-container">
                    {isClickedB && (
                        <span>
                            <div>{data.description}</div>
                            This element is rendered after the div is clicked!
                            <br />
                            This element is rendered after the div is clicked!
                            <br />
                            This element is rendered after the div is clicked!
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

// const EventTitle = styled.h3`
//     margin-top: 0;
//     margin-bottom: 10px;
//     text-align: center;
// `;

// const EventBody = styled.div`
//     padding: 0;
// `;

// const EventItem = styled.div`
//     border: 1px solid #ccc;
//     box-sizing: content-box;
//     // border-radius: 5px;
//     padding: 0;
//     width: 100%;
//     // height: 175px;
//     box-shadow: 2px 2px 5px #eee;
//     display: flex;
//     flex-direction: column;
// `;

// function EventItem({
//     categoryName,
//     eventType,
//     i,
//     categoryIcon,
//     eventIcon,
//     event,
// }: {
//     categoryName: string;
//     eventType: any;
//     i: number;
//     categoryIcon: JSX.Element;
//     eventIcon: JSX.Element;
//     event: any;
// }): JSX.Element | null {
//     const columns = ["blah", "Status", "Date/Time", "Location"];
//     const data = [
//         event.status,
//         new Date(event.event_date).toLocaleString(),
//         event.event_location,
//     ];

//     return (
//         // <table className="event-table">
//             {/*
//                 <div className="event-category-container">
//                     <div className="event-category">
//                     <div className="event-category">
//                         <div>{categoryIcon}</div>
//                         <div style={{ paddingLeft: "7px" }}>{categoryName}</div>
//                     </div>
//                     <div className="ico-favorite-container">
//                             <ico.Favorite className="ico-favorite" />
//                             </div>
//                     </div>
//                     <div className="event-sub-category">
//                         <div>{eventIcon}</div>
//                         <div style={{ paddingLeft: "7px" }}>{eventType}</div>
//                     </div>
//                 </div> */}

//             {/* <EventTitle
//                     className="event-title-container"
//                     key={`${categoryName}-${eventType}-${i + 2000}`}
//                 > */}
//             <thead>
//                 <tr>
//                     {columns.map((h) => {
//                         return <th>{h}</th>;
//                     })}
//                 </tr>
//             </thead>
//             {/* </EventTitle> */}
//             {/* <EventBody
//                     className="event-details"
//                     key={`${categoryName}-${eventType}-${i + 3000}`}
//                 > */}
//             <tr className="event-item">
//                 <td>
//                     <div className="event-category-container">
//                         {/* <div className="event-category"> */}
//                         <div className="event-category">
//                             <div>{categoryIcon}</div>
//                             <div style={{ paddingLeft: "7px" }}>
//                                 {categoryName}
//                             </div>
//                         </div>
//                         {/* <div className="ico-favorite-container">
//                             <ico.Favorite className="ico-favorite" />
//                             </div> */}
//                         {/* </div> */}
//                         <div className="event-sub-category">
//                             <div>{eventIcon}</div>
//                             <div style={{ paddingLeft: "7px" }}>
//                                 {eventType}
//                             </div>
//                         </div>
//                     </div>
//                 </td>

//                 {data.map((d) => {
//                     return <td>{d}</td>;
//                 })}
//             </tr>
//             {/* <div>{event.status}</div>
//                     <div>{new Date(event.event_date).toLocaleString()}</div>
//                     <div>{event.event_location}</div> */}
//             {/* </EventBody> */}
//             {/* <div>
//                 <EventFooterComponent
//                     data={event}
//                     categoryName={categoryName}
//                     eventType={eventType}
//                     i={i}
//                 />
//             </div> */}
//         // </table>
//     );
// }

// const EventRow = styled.tr`
//     // display: flex;
//     // flex-direction: row;
//     // flex-wrap: wrap;
//     // gap: 20px;
//     // margin-bottom: 20px;
//     padding: 0;
// `;

// type LimitTracker = {
//     [String]: number;
// }

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
    const columns = [
        "Type",
        "Status",
        "Timestamp",
        "Location",
        "Description",
        "Severity",
        "Event ID",
    ];

    const fields = [
        "status",
        "event_date",
        "event_location",
        "description",
        "severity_level",
        "event_id",
    ];

    const limitCount = eventData.reduce(
        (acc, obj) => ((acc[Object.keys(obj)[0]] = 0), acc),
        {}
    ) as LimitTracker;

    // const structuredData = eventData.reduce((acc, item) => {
    //     const categoryName = Object.keys(item)[0];
    //     const eventDetails = item[categoryName];
    //     const eventType = eventDetails.type as string;

    //     if (!acc[categoryName]) {
    //         acc[categoryName] = {};
    //     }

    //     let accEventType = acc[categoryName][eventType];

    //     // const eventDate = new Date(eventDetails.event_date).toLocaleString()

    //     if (!accEventType) {
    //         accEventType = {
    //             totalCount: 0,
    //             // eventDate,
    //             events: [],
    //         };
    //     }

    //     console.log(accEventType);

    //     accEventType.totalCount += 1;

    //     accEventType.icon = ico[eventType]({ title: eventType });

    //     accEventType.events.push(eventDetails);

    //     acc[categoryName][eventType] = accEventType;

    //     return acc;
    // }, {}); //as StructuredData;

    // console.log(structuredData);

    const sortedEvents = eventData.sort(
        (a, b) => {
            const aEvent = Object.values(a)[0];
            const bEvent = Object.values(b)[0];
            const aDate = new Date(aEvent.event_date);
            const bDate = new Date(bEvent.event_date);
            return bDate - aDate;
        }

        // ([typeA, typeDataA], [typeB, typeDataB]) => {
        //     return typeDataB.event_date - typeDataA.event_date;
        // }
    );
    // console.log(sortedEvents);

    // const sortedEvents = Object.entries(event).sort(
    //     ([typeA, typeDataA], [typeB, typeDataB]) => {
    //         // switch (sortBy) {
    //         //     case "recency":
    //         //         console.log(typeDataB);

    //         //         // console.log(
    //         //         //     new Date(typeDataB.event_date)
    //         //         // );
    //         //         // console.log(
    //         //         //     new Date(typeDataA.event_date)
    //         //         // );

    //         //         return (
    //         //             new Date(typeDataB.event_date) -
    //         //             new Date(typeDataA.event_date)
    //         //         );
    //         //     // case "frequency":
    //         //     //     return (
    //         //     //         typeDataB.totalCount -
    //         //     //         typeDataA.totalCount
    //         //     //     );
    //         //     case "alphabetical":
    //         //         return typeA > typeB
    //         //             ? 1
    //         //             : typeA < typeB
    //         //               ? -1
    //         //               : 0;
    //         //     default:
    //         return typeDataB.event_date - typeDataA.event_date;
    //         // }
    //     }
    // );

    return (
        <table className="event-table">
            <thead>
                <tr key="tr">
                    {columns.map((h, iTh) => {
                        return <th key={iTh}>{h}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {sortedEvents.map((eventCategory, iOut) => {
                    // console.log("eventCategory:", eventCategory);
                    // console.log("categoryName:", categoryName);
                    // console.log("eventTypes:", eventTypes);

                    // if (
                    //     displayLimit &&
                    //     parseInt(limitCount[categoryName]) >
                    //         parseInt(displayLimit)
                    // )
                    //     return null;

                    const categoryName = Object.keys(eventCategory)[0];
                    const event = Object.values(eventCategory)[0];
                    const eventType = event.type;

                    const categoryIcon = ico[categoryName]({
                        title: categoryName,
                    });

                    // const eventTypes = Object.keys(data).map();

                    // const event = Object.values(eventTypes).map(
                    //     ({ event }) => event
                    // );

                    // const eventDetails = eventType.event;

                    // const details = [
                    //     event.status,
                    //     new Date(event.event_date).toLocaleString(),
                    //     event.event_location,
                    // ];

                    // console.log("sortedData:", sortedData);

                    if (selectedCategory && categoryName != selectedCategory)
                        return null;
                    else if (selectedEventType && !(selectedEventType == eventType))
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
                        <tr key={`${eventType}-${iOut}`} className="event-item">
                            <td className="event-category-td">
                                <div className="event-category-container">
                                    <div className="event-category">
                                        <div>{categoryIcon}</div>
                                        <div
                                            style={{
                                                paddingLeft: "7px",
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
                                                paddingLeft: "7px",
                                            }}
                                        >
                                            {eventType}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            {Object.values(fields).map((field, iIn) => {
                                return (
                                    <td
                                        key={`${categoryName}-${eventType}-${iIn}`}
                                    >
                                        {event[field]}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default RenderList;
