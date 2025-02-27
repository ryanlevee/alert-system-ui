import React from 'react';
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styled from 'styled-components';
// import ico from '../common/iconMapping';
import { EventCategoryName, eventData } from '../interfaces/interfaces';

const BigCardContainer = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin: 20px;
    // background-color: rgb(239, 245, 255);
    box-shadow: 2px 2px 5px #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CardTitle = styled.h2`
    text-align: center;
    margin: 0;
    padding: 10px 0;
    background: rgb(79, 109, 153);
    color: whitesmoke;
    font-weight: 500;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
`;

const GraphContainer = styled.div`
    width: 102%;
    // height: 100%;
    height: 600px;
    padding: 0 0 0 2%;
    margin: 0;
`;

interface StructuredData {
    [category: string]: {
        [eventType: string]: {
            totalCount: number;
        };
    };
}

function RenderGraph({
    selectedCategory,
    selectedEventType,
}: {
    selectedCategory: EventCategoryName;
    selectedEventType: string | null;
}): React.ReactNode | null {
    const structuredData = eventData.reduce((acc, item) => {
        const categoryName = Object.keys(item)[0];
        const eventDetails = item[categoryName];
        const eventType = eventDetails.type as string;

        if (!acc[categoryName]) {
            acc[categoryName] = {};
        }

        let accEventType = acc[categoryName][eventType];

        if (!accEventType) {
            accEventType = {
                totalCount: 0,
            };
        }

        accEventType.totalCount += 1;

        acc[categoryName][eventType] = accEventType;

        return acc;
    }, {}) as StructuredData;

    const colors = [
        'rgb(79, 107, 153)',
        'rgb(65, 134, 113)',
        'rgb(113, 76, 145)',
        'rgb(153, 84, 79)',
    ];
    const fill = {};
    // const icons = {};

    const graphData = Object.entries(structuredData).flatMap(
        ([categoryName, eventTypes], i) => {
            if (selectedCategory && categoryName != selectedCategory)
                return null;
            else if (selectedEventType && !(selectedEventType in eventTypes))
                return null;

            fill[categoryName] = colors[i] || 'indianred';

            return Object.entries(eventTypes).flatMap(
                ([typeName, typeData]) => ({
                    category: categoryName,
                    eventType: typeName,
                    count: typeData.totalCount,
                    name: typeName,
                    // icon: ico[typeName]({ title: typeName }),
                })
            );
        }
    );

    return (
        <BigCardContainer>
            <CardTitle>Overall</CardTitle>
            <GraphContainer>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        className="big-graph"
                        data={graphData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10 }}
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={100}
                            tickLine={false}
                        />
                        <YAxis
                            width={1}
                            tickCount={4}
                            tickLine={false}
                            // axisLine={false}
                        />
                        <Tooltip />
                        <Bar dataKey="count" fill={colors[0]}>
                            {graphData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={fill[entry?.category]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </GraphContainer>
        </BigCardContainer>
    );
}

export default RenderGraph;
