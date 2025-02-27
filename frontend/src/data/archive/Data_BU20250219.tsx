import React from 'react';
import styled from 'styled-components';
import data from '../../../../backend/data.json'; // Import your JSON data
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaRegStar, FaClinicMedical, FaCloudShowersHeavy, FaLightbulb, FaMeteor } from 'react-icons/fa';


const DataContainer = styled.div`
    padding: 20px;
`;

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
    padding: 6px;
    width: 350px;
    height: 200px;
    box-shadow: 2px 2px 5px #eee;
    display: flex;
    flex-direction: column;
`;

const CardTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
`;

const BarGraphContainer = styled.div`
    height: 175px;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const severityOrder = ["Minor", "Very Low", "Low", "Medium", "High", "Critical"];

const Data: React.FC = () => {
    // 1. Structure the data: Group by Category, then by Type, and count severity levels, and calculate total counts
    const structuredData = data.reduce((categories, item) => {
        const categoryName = Object.keys(item)[0];
        const eventDetails = item[categoryName];
        const eventType = eventDetails.type;
        const severityLevel = eventDetails.severity_level;


        let categoryIcon: React.ReactElement;

        switch (categoryName) {
            case 'Safety':
                categoryIcon = <FaClinicMedical />;
                break;
            default:
                categoryIcon = <FaClinicMedical />;
                break;
        }

        if (!categories[categoryName]) {
            categories[categoryName] = {};
        }
        if (!categories[categoryName][eventType]) {
            categories[categoryName][eventType] = {
                severityCounts: { "Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Very Low": 0, "Minor": 0 },
                totalCount: 0 // Initialize totalCount
            };
        }
        categories[categoryName][eventType].severityCounts[severityLevel] = (categories[categoryName][eventType].severityCounts[severityLevel] || 0) + 1;
        categories[categoryName][eventType].totalCount += 1; // Increment totalCount

        return categories;
    }, {});

    return (
        <div className="data-container">

            <DataContainer>
                <h4>React Demo &#8250; <span>Data Dashboard</span></h4>
                <h2 id="page-title">data</h2>

                {Object.entries(structuredData).map(([categoryName, categoryTypes]) => {

                    // 2. Sort event types within each category by totalCount in descending order
                    const sortedCategoryTypes = Object.entries(categoryTypes)
                        .sort(([, typeDataA], [, typeDataB]) => typeDataB.totalCount - typeDataA.totalCount);

                    return (
                        <div id="category-container" key={categoryName}>
                            <h3 id="category-header">{
                                categoryName == 'Safety' ? <FaClinicMedical /> :
                                    categoryName == 'Weather' ? <FaCloudShowersHeavy /> :
                                        categoryName == 'Operations' ? <FaLightbulb /> :
                                            categoryName == 'Disaster' ? <FaMeteor /> :
                                                null

                            } {categoryName}</h3>
                            <CategoryRow>
                                {sortedCategoryTypes.map(([typeName, typeData], index) => {
                                    if (index >= 4) return null; // 4. Limit to 4 cards

                                    const chartData = severityOrder.map(level => ({
                                        severity: level,
                                        count: typeData.severityCounts[level] || 0,
                                    }));

                                    return (
                                        <TypeCard className={`card-container ${categoryName}`} key={`${categoryName}-${typeName}`}>
                                            <CardTitle className="card-title-container">
                                                <div className="card-title">
                                                    <div className="card-title-flex">
                                                        <div>{typeName}</div>
                                                        <div><FaRegStar /></div>
                                                    </div>
                                                    <div id="type-count">total: {typeData.totalCount}</div>
                                                </div>
                                            </CardTitle>
                                            <BarGraphContainer>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={chartData}>
                                                        <XAxis
                                                            dataKey="severity"
                                                            tickSize={4}
                                                            // tickAngle={-45}
                                                            interval={0}
                                                            height={25}
                                                            label={{ value: 'Severity Level', position: 'bottom', offset: 10 }}
                                                            tick={{ fontSize: 12 }}
                                                            domain={severityOrder}
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
                                                            dataKey="count" fill="#9fc4ff"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </BarGraphContainer>
                                        </TypeCard>
                                    );
                                })}
                            </CategoryRow>
                        </div>
                    );
                })}
            </DataContainer>
        </div>
    );
};

export default Data;