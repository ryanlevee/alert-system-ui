import L from "leaflet";
import React from "react";
import styled from "styled-components";

interface LegendProps {
    defaultIcon: L.Icon<L.IconOptions>;
    greenIcon: L.Icon<L.IconOptions>;
    purpleIcon: L.Icon<L.IconOptions>;
    redIcon: L.Icon<L.IconOptions>;
}

const LegendContainer = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 10px;
    box-shadow: 0 0 2px gray;
    background-color: white;
    border-radius: 4px;
    z-index: 1000; // Ensure it's above map controls
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const IconPlaceholder = styled.div`
    width: 20px;
    height: 20px;
    margin-right: 10px;
    opacity: 0.8; // Match marker icon opacity
    display: flex;
    justify-content: center;
    align-items: center;
`;

const IconImg = styled.img`
    // width: 100%;
    // height: auto;
    height: 100%;
`;

const LegendLabel = styled.span`
    font-size: 14px;
    color: #333;
`;

const Legend: React.FC<LegendProps> = ({
    defaultIcon,
    greenIcon,
    purpleIcon,
    redIcon,
}) => {
    return (
        <LegendContainer>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={defaultIcon.options.iconUrl!}
                        alt="Safety Icon"
                    />
                </IconPlaceholder>
                <LegendLabel>Safety</LegendLabel>
            </LegendItem>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={greenIcon.options.iconUrl!}
                        alt="Weather Icon"
                    />
                </IconPlaceholder>
                <LegendLabel>Weather</LegendLabel>
            </LegendItem>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={purpleIcon.options.iconUrl!}
                        alt="Operations Icon"
                    />
                </IconPlaceholder>
                <LegendLabel>Operations</LegendLabel>
            </LegendItem>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={redIcon.options.iconUrl!}
                        alt="Disaster Icon"
                    />
                </IconPlaceholder>
                <LegendLabel>Disaster</LegendLabel>
            </LegendItem>
        </LegendContainer>
    );
};

export default Legend;
