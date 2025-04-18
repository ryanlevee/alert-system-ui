import React, { useCallback, useEffect, useState } from 'react';
import {
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaDatabase,
    FaHome,
    FaInfoCircle,
    FaMap,
} from 'react-icons/fa';
import styled from 'styled-components';

interface CollapsibleNavbarProps {
    children?: React.ReactNode;
    onPageChange: (pageName: string) => void;
    currentPage: string;
    isNight: boolean;
    isCollapsedLeft: boolean;
    setIsCollapsedLeft: (collapse: boolean) => void;
}

interface NavbarItemProps {
    item: { key: string; label: string; icon: React.ReactNode };
    $collapsed: boolean;
    className?: string;
    onPageChange: (pageName: string) => void;
    currentPage: string;
    isNight: boolean;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
    item,
    $collapsed,
    className,
    onPageChange,
    currentPage,
    isNight,
}) => {
    const handleClick = useCallback(() => {
        onPageChange(item.key);
    }, [onPageChange, item.key]);

    return (
        <StyledNavbarItem
            onClick={handleClick}
            className={`${className} navbar-item`}
            key={item.key}
            $activePage={item.key === currentPage}
            $isNight={isNight}
        >
            <NavbarLink href="#" label={item.label}>
                {item.icon}
                {!$collapsed && <span>{item.label}</span>}
            </NavbarLink>
        </StyledNavbarItem>
    );
};

const Navbar: React.FC<CollapsibleNavbarProps> = ({
    onPageChange,
    currentPage,
    isNight,
    setIsCollapsedLeft,
    isCollapsedLeft,
}) => {
    const navItems = [
        { key: 'home', label: 'Home', icon: <FaHome /> },
        { key: 'map', label: 'Map View', icon: <FaMap /> },
        { key: 'events', label: 'Event Tracker', icon: <FaCalendarAlt /> },
        { key: 'data', label: 'Data Dashboard', icon: <FaDatabase /> },
        { key: 'about', label: 'About', icon: <FaInfoCircle /> },
    ];
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(!isCollapsed);
        setIsCollapsedLeft(!isCollapsedLeft);
    }, [isCollapsed]);

    useEffect(() => {
        setIsCollapsed(isCollapsedLeft);
    }, [isCollapsedLeft]);

    return (
        <NavbarContainer
            $collapsed={isCollapsed}
            className={
                isCollapsed ? 'Navbar-container collapsed' : 'Navbar-container'
            }
        >
            <CollapseToggleButton
                onClick={toggleCollapse}
                $collapsed={isCollapsed}
                className="collapse-toggle-button"
            >
                {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </CollapseToggleButton>

            <NavbarNav $collapsed={isCollapsed}>
                {navItems.map(item => (
                    <NavbarItem
                        key={item.key}
                        className={item.key}
                        item={item}
                        $collapsed={isCollapsed}
                        onPageChange={onPageChange}
                        currentPage={currentPage}
                        isNight={isNight}
                    />
                ))}
                {}
            </NavbarNav>
        </NavbarContainer>
    );
};

export default Navbar;

const NavbarContainer = styled.div<{ $collapsed: boolean }>`
    width: ${props => (props.$collapsed ? '60px' : '210px')};
    position: relative;
    transition: width 0.3s ease-out;
    padding-top: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 100;
`;

const CollapseToggleButton = styled.button<{ $collapsed: boolean }>`
    scale: calc(135%);
    position: absolute;
    top: 10px;
    right: 5px;
    border: none;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;

    transition:
        right 0.3s easeout,
        background-color 0.3s ease;
    z-index: 10;

    &:hover {
        color: darkblue;
    }
`;

const NavbarNav = styled.nav<{ $collapsed: boolean }>`
    padding: 15px 0 0 0;
    margin: 0;
    list-style: none;
    margin-top: 20px;
`;

const StyledNavbarItem = styled.li<{ $activePage: boolean; $isNight: boolean }>`
    margin: 0;
    cursor: pointer;
    display: flex;
    padding: 10px 15px;

    color: ${props => (props.$activePage ? 'darkblue' : '#f0f2f5')};
    background-color: ${props =>
        props.$activePage ? (props.$isNight ? '#57575b' : '#d5d5da') : 'none'};

    &:hover {
        background-color: #d5d5da;
    }

    &:hover a {
        color: darkblue;
    }
`;

const NavbarLink = styled.a<{ label: string }>`
    align-items: center;
    text-decoration: none;
    transition: background-color 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 10px;

    svg {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
`;
