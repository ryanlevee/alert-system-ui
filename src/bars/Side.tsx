import React, { useCallback, useState } from 'react';
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaDatabase,
    FaInfoCircle,
    FaRegSun as FaSettings,
    FaStopwatch,
} from 'react-icons/fa';
import { FaArrowsLeftRightToLine } from 'react-icons/fa6';
import { PiMoonStarsFill } from 'react-icons/pi';
import styled from 'styled-components';
import logo from '../static/A_trs_transparent_dark.png';

interface CollapsibleSidebarProps {
    children?: React.ReactNode;
    onThemeChange: (theme: boolean) => void;
    isNight: boolean;
    onAnimationChange: (animation: boolean) => void;
    isAnimated: boolean;
    isCollapsedLeft: boolean;
    setIsCollapsedLeft: (collapse: boolean) => void;
    currentPage: string;
}

interface SidebarItemProps {
    item: { key: string; label: string; icon: React.ReactNode; type: string };
    $collapsed: boolean;
    className?: string;
    onThemeChange: (theme: boolean) => void;
    isNight: boolean;
    onAnimationChange: (animation: boolean) => void;
    isAnimated: boolean;
    isCollapsed: boolean;
    isCollapsedLeft: boolean;
    setIsCollapsedLeft: (collapse: boolean) => void;
    toggleCollapseSides: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    item,
    $collapsed,
    className,
    onThemeChange,
    isNight,
    onAnimationChange,
    isAnimated,
    isCollapsed,
    isCollapsedLeft,
    toggleCollapseSides,
}) => {
    const setCollapses = () => {
        if (item.key === 'collapseSides') {
            if (!isCollapsedLeft || !isCollapsed) {
                return false;
            } else if (isCollapsedLeft && isCollapsed) {
                return true;
            }
        }
    };

    const handleClick = useCallback(() => {
        if (item.key == 'night') onThemeChange(!isNight);
        if (item.key == 'animation') onAnimationChange(!isAnimated);
        if (item.key == 'collapseSides') toggleCollapseSides();
    }, [
        onThemeChange,
        isNight,
        onAnimationChange,
        isAnimated,
        isCollapsed,
        isCollapsedLeft,
    ]);

    return (
        <StyledSidebarItem
            className={`${className} sidebar-item`}
            key={item.key}
            $collapsed={$collapsed}
        >
            <SidebarSwitch $collapsed={$collapsed} className="switch">
                <div
                    className="sidebar-click-handler"
                    onClick={handleClick}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: '1000',
                    }}
                ></div>
                <input
                    type="checkbox"
                    className={`sidebar-checkbox ${item.key}`}
                    defaultChecked={item.key == 'animation' ? true : false}
                    checked={setCollapses()}
                />
                <div className="sidebar-icon">
                    {$collapsed && (
                        <div className="sidebar-check">
                            <FaCheckCircle />
                        </div>
                    )}
                    {item.icon}
                </div>
                {!$collapsed && (
                    <SidebarLink className="sidebar-link">
                        <span className="sidebar-label">{item.label}</span>
                        <span className="slider round"></span>
                    </SidebarLink>
                )}
            </SidebarSwitch>
        </StyledSidebarItem>
    );
};

const Sidebar: React.FC<CollapsibleSidebarProps> = ({
    onThemeChange,
    isNight,
    onAnimationChange,
    isAnimated,
    isCollapsedLeft,
    setIsCollapsedLeft,
    currentPage,
}) => {
    const siteSettings = [
        {
            key: 'night',
            label: 'Night Mode',
            icon: <PiMoonStarsFill />,
            type: 'slider',
        },
        {
            key: 'animation',
            label: 'Animations',
            icon: <FaStopwatch />,
            type: 'slider',
        },
        {
            key: 'collapseSides',
            label: 'Collapse Sides',
            icon: <FaArrowsLeftRightToLine />,
            type: 'button',
        },
    ];

    const pageSettings = [
        { key: 'a', label: 'a', icon: <FaCalendarAlt /> },
        { key: 'b', label: 'b', icon: <FaDatabase /> },
        { key: 'c', label: 'c', icon: <FaSettings /> },
        { key: 'd', label: 'd', icon: <FaInfoCircle /> },
    ];

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed]);

    const toggleCollapseSides = useCallback(() => {
        if (!isCollapsedLeft || !isCollapsed) {
            setIsCollapsed(true);
            setIsCollapsedLeft(true);
        } else {
            setIsCollapsed(false);
            setIsCollapsedLeft(false);
        }
    }, [isCollapsed, isCollapsedLeft]);

    return (
        <SidebarContainer
            $collapsed={isCollapsed}
            className={'Sidebar-container'}
        >
            <div className="title-container">
                <img id="logo" src={logo} alt="logo" />
            </div>

            <SidebarNav className="sidebar-nav" $collapsed={isCollapsed}>
                <CollapseToggleButton
                    onClick={toggleCollapse}
                    $collapsed={isCollapsed}
                    className="collapse-toggle-button"
                >
                    {isCollapsed ? (
                        <FaChevronLeft className="sidebar-chevron" />
                    ) : (
                        <FaChevronRight className="sidebar-chevron" />
                    )}
                    <FaSettings className="settings-icon" />
                </CollapseToggleButton>

                <h2 className="sidebar-header" id="site-settings-header">
                    {!isCollapsed && <span>Site Settings</span>}
                </h2>
                {siteSettings.map(item => (
                    <SidebarItem
                        key={item.key}
                        className={item.key}
                        item={item}
                        $collapsed={isCollapsed}
                        onThemeChange={onThemeChange}
                        isNight={isNight}
                        onAnimationChange={onAnimationChange}
                        isAnimated={isAnimated}
                        toggleCollapseSides={toggleCollapseSides}
                        isCollapsed={isCollapsed}
                        setIsCollapsedLeft={setIsCollapsedLeft}
                        isCollapsedLeft={isCollapsedLeft}
                    />
                ))}
                {/* <h2 className="sidebar-header" id="page-settings-header">
                    {!isCollapsed && <span>Page Highlights</span>}
                </h2> 
                <PageHighlights $collapsed={isCollapsed}>
                    <ul>
                        <li>{currentPage} page info...</li>
                        <li>will go here...</li>
                        <li>and here...</li>
                        <li>and here...</li>
                    </ul>
                </PageHighlights> */}
                {/* {pageSettings.map(item => (
                    <SidebarItem
                        key={item.key}
                        className={item.key}
                        item={item}
                        $collapsed={isCollapsed}
                        onThemeChange={onThemeChange}
                        isNight={isNight}
                    />
                ))} */}
            </SidebarNav>
            <div
                style={{
                    position: 'fixed',
                    bottom: '2px',
                    left: '4px',
                    fontSize: '12px',
                }}
            >
                <span>demo site by Ryan Levee</span>
            </div>
        </SidebarContainer>
    );
};

export default Sidebar;

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
    width: ${props => (props.$collapsed ? '60px' : '240px')};
    position: relative;
    transition: width 0.25s ease-out;
    padding-top: 20px;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 100;
`;

const CollapseToggleButton = styled.button<{ $collapsed: boolean }>`
    scale: calc(135%);
    position: absolute;
    left: 15px;
    border: none;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: start;
    cursor: pointer;
    background: transparent;

    transition:
        right 0.25s ease-out,
        background-color 0.25s ease;
    z-index: 10;

    &:hover {
        color: darkblue;
    }
`;

const SidebarNav = styled.nav<{ $collapsed: boolean }>`
    list-style: none;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
`;

const StyledSidebarItem = styled.li<{ $collapsed: boolean }>`
    &:hover a {
        color: darkblue;
    }
`;

const SidebarSwitch = styled.label<{ $collapsed: boolean }>`
    position: relative;
    display: flex;
    width: ${props => (props.$collapsed ? '60px' : '210px')};
    height: ${props => (props.$collapsed ? '40px' : '40px')};
    cursor: pointer;
    align-items: center;
`;

const SidebarLink = styled.a`
    position: relative;
    text-decoration: none;
    color: #333;
    transition: background-color 0.25s ease;
    display: flex;
    align-items: center;
    user-select: none;
    text-wrap: nowrap;
    overflow: hidden;
    white-space: nowrap;
    width: 200px;
    justify-content: space-between;
    cursor: pointer;
`;

// const PageHighlights = styled.div<{ $collapsed: boolean }>`
//     display: ${props => (props.$collapsed ? 'none' : 'initial')};
//     padding: 8px 0 10px 36px;
//     font-size: 14px;
// `;
