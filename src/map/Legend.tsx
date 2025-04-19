import L from 'leaflet';
import React from 'react';
import styled from 'styled-components';

interface LegendProps {
    defaultIcon: L.Icon<L.IconOptions>;
    greenIcon: L.Icon<L.IconOptions>;
    purpleIcon: L.Icon<L.IconOptions>;
    redIcon: L.Icon<L.IconOptions>;
    isNight: boolean;
}

const LegendContainer = styled.div<{
    $isNight: boolean;
}>`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 10px;
    box-shadow: 0 0 2px gray;
    ${props =>
        props.$isNight ? `background: #070707` : `background: white`};
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

const LegendLabel = styled.span<{
    $isNight: boolean;
}>`
    font-size: 14px;
    ${props => (props.$isNight ? `color: #bebec6` : `color: #333`)};
`;

const Legend: React.FC<LegendProps> = ({
    defaultIcon,
    greenIcon,
    purpleIcon,
    redIcon,
    isNight,
}) => {
    return (
        <LegendContainer $isNight={isNight}>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={defaultIcon.options.iconUrl!}
                        alt="Safety Icon"
                    />
                </IconPlaceholder>
                <LegendLabel $isNight={isNight}>Safety</LegendLabel>
            </LegendItem>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={greenIcon.options.iconUrl!}
                        alt="Weather Icon"
                    />
                </IconPlaceholder>
                <LegendLabel $isNight={isNight}>Weather</LegendLabel>
            </LegendItem>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={purpleIcon.options.iconUrl!}
                        alt="Operations Icon"
                    />
                </IconPlaceholder>
                <LegendLabel $isNight={isNight}>Operations</LegendLabel>
            </LegendItem>
            <LegendItem>
                <IconPlaceholder>
                    <IconImg
                        src={redIcon.options.iconUrl!}
                        alt="Disaster Icon"
                    />
                </IconPlaceholder>
                <LegendLabel $isNight={isNight}>Disaster</LegendLabel>
            </LegendItem>
        </LegendContainer>
    );
};

export default Legend;
