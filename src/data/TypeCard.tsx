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
import styled from 'styled-components';
import ico from '../common/iconMapping';
import { SeverityLevel } from './Cards';

const TypeCardStyled = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
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

interface TypeCardProps {
    typeName: string;
    typeData: {
        severityCounts: { [level in SeverityLevel]: number };
        totalCount: number;
        icon: React.ReactElement;
        year2025: number;
        year2024: number;
    };
    categoryName: string;
    severityOrder: readonly SeverityLevel[];
}

const TypeCardComponent: React.FC<TypeCardProps> = ({
    typeName,
    typeData,
    categoryName,
    severityOrder,
}) => {
    const chartData = severityOrder.map(level => ({
        severity: level,
        count: typeData.severityCounts[level] || 0,
    }));

    const currentYearCount = typeData.year2025;
    const lastYearCount = typeData.year2024;

    let operator: JSX.Element;
    let percentChange: string | JSX.Element;
    let footerClass: string;

    const up = <FaArrowUp />;
    const dn = <FaArrowDown />;

    if (lastYearCount === 0) {
        operator = up;
        percentChange = <span style={{ fontSize: '16px' }}>&#8734;</span>;
    } else if (currentYearCount === 0) {
        operator = dn;
        percentChange = `100`;
    } else {
        const change = lastYearCount / currentYearCount;
        operator = change > 1 ? dn : up;
        percentChange = `${((1 / change) * 100).toFixed(0)}`;
    }

    footerClass = operator === up ? 'plus' : 'minus';

    return (
        <TypeCardStyled
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
                    <div id="type-count" style={{ paddingLeft: '20px' }}>
                        total: {typeData.totalCount}
                    </div>
                </div>
            </CardTitle>
            <BarGraphContainer>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart className="card-graph" data={chartData}>
                        <XAxis
                            dataKey="severity"
                            tickSize={4}
                            interval={0}
                            height={25}
                            label={{
                                value: 'Severity Level',
                                position: 'bottom',
                                offset: 10,
                            }}
                            tick={{ fontSize: 12 }}
                            type="category"
                            tickLine={false}
                        />
                        <YAxis
                            width={1}
                            tickCount={1}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 8]}
                        />
                        <Tooltip />
                        <Bar barSize={25} dataKey="count" fill="#9fc4ff" />
                    </BarChart>
                </ResponsiveContainer>
            </BarGraphContainer>

            <CardFooter className="card-footer-container">
                <div className="card-footer">
                    <span className={footerClass}>
                        {operator}
                        {percentChange}%
                    </span>
                    <span className="from-last-year"> from prev. year</span>
                </div>
            </CardFooter>
        </TypeCardStyled>
    );
};

export default TypeCardComponent;
