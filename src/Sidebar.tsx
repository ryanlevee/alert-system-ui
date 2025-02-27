import React, { useCallback, useState } from "react";
import {
    FaCalendarAlt,
    FaChevronCircleLeft,
    FaChevronCircleRight,
    FaDatabase,
    FaHome,
    FaInfoCircle,
    FaMap,
    FaRegSun as FaSettings,
} from "react-icons/fa";
import styled from "styled-components";

interface CollapsibleSidebarProps {
    children?: React.ReactNode;
    onPageChange: (pageName: string) => void;
    currentPage: string; // <--- Add currentPage to props interface
}

interface SidebarItemProps {
    item: { key: string; label: string; icon: React.ReactNode };
    $collapsed: boolean;
    className?: string;
    onPageChange: (pageName: string) => void;
    currentPage: string; // <--- Add currentPage to props interface
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    item,
    $collapsed,
    className,
    onPageChange,
    currentPage,
}) => {
    const handleClick = useCallback(() => {
        onPageChange(item.key);
    }, [onPageChange, item.key]);

    return (
        <StyledSidebarItem
            onClick={handleClick}
            className={`${className} sidebar-item`}
            key={item.key}
            $activePage={item.key === currentPage} // <---  Pass $activePage prop here, based on currentPage
        >
            <SidebarLink href="#" label={item.label}>
                {item.icon}
                {!$collapsed && <span>{item.label}</span>}
            </SidebarLink>
        </StyledSidebarItem>
    );
};

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
    children,
    onPageChange,
    currentPage,
}) => {
    // <--- Accept currentPage prop

    const navItems = [
        { key: "home", label: "Home", icon: <FaHome /> },
        { key: "map", label: "Map", icon: <FaMap /> },
        { key: "events", label: "Event Tracker", icon: <FaCalendarAlt /> },
        { key: "data", label: "Data Dashboard", icon: <FaDatabase /> },
        { key: "settings", label: "Settings", icon: <FaSettings /> },
        { key: "about", label: "About", icon: <FaInfoCircle /> },
    ];

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed]);

    return (
        <SidebarContainer
            $collapsed={isCollapsed}
            className={
                isCollapsed
                    ? "sidebar-container collapsed"
                    : "sidebar-container"
            }
        >
            <CollapseToggleButton
                onClick={toggleCollapse}
                $collapsed={isCollapsed}
            >
                {isCollapsed ? (
                    <FaChevronCircleRight />
                ) : (
                    <FaChevronCircleLeft />
                )}
            </CollapseToggleButton>

            <SidebarNav $collapsed={isCollapsed}>
                {navItems.map((item) => (
                    <SidebarItem
                        key={item.key}
                        item={item}
                        $collapsed={isCollapsed}
                        onPageChange={onPageChange}
                        currentPage={currentPage} // <--- Pass currentPage prop to SidebarItem
                    />
                ))}
                {children && !isCollapsed && (
                    <SidebarContent>{children}</SidebarContent>
                )}
            </SidebarNav>
        </SidebarContainer>
    );
};

export default CollapsibleSidebar;

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
    background-color: #f0f2f5;
    color: #333;
    width: ${(props) => (props.$collapsed ? "80px" : "270px")};
    position: relative;
    // top: 0;
    // left: 0;

    transition:
        // left 0.3s,
        width 0.3s ease-in-out;

    // overflow-x: hidden;
    padding-top: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    // display: flex;
    // flex-direction: column;

    z-index: 100;
`;

const CollapseToggleButton = styled.button<{ $collapsed: boolean }>`
    scale: calc(135%);
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    transition:
        right 0.3s ease-in-out,
        background-color 0.3s ease;
    z-index: 10;

    &:hover {
        color: darkblue;
    }
`;

const SidebarNav = styled.nav<{ $collapsed: boolean }>`
    padding: 15px 0 0 0;
    margin: 0;
    list-style: none;
    margin-top: 20px;
`;

const StyledSidebarItem = styled.li<{ $activePage: boolean }>`
    margin: 0;
    cursor: pointer;

    color: ${(props) =>
        props.$activePage
            ? "darkblue"
            : "#f0f2f5"};
    background-color: ${(props) =>
        props.$activePage
            ? "#e0e0e0"
            : "none"};

    &:hover {
        background-color: #e0e0e0;
    }

    &:hover a {
        color: darkblue;
    }
`;

const SidebarLink = styled.a<{ label: string }>`
    padding: 10px 15px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.2s ease;
    white-space: nowrap;

    svg {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }

    span {
        overflow: hidden;
        // transition:
            // opacity 0.3s ease,
            // margin-left 0.3s ease;
    }
`;

const SidebarContent = styled.div`
    // padding: 20px;
`;
