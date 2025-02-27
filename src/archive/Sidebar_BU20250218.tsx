import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { FaHome, FaMap, FaDatabase, FaRegSun as FaSettings, FaInfoCircle, FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

interface CollapsibleSidebarProps { // Using CollapsibleSidebarProps now
    children?: React.ReactNode;
}

// SidebarItem component (NO CHANGES NEEDED HERE - it's already correct!)
interface SidebarItemProps {
    item: { key: string, label: string, icon: React.ReactNode; };
    $collapsed: boolean;
    className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, $collapsed, className }) => {
    const [isChecked, setIsChecked] = useState(false); // Internal checked state for THIS item

    const toggleCheck = useCallback(() => {
        setIsChecked(!isChecked); // Toggle the internal checked state
    }, [isChecked]);

    return (
        <StyledSidebarItem
            $checked={isChecked} // Use internal isChecked for styling
            onClick={toggleCheck} // Call toggleCheck when clicked
            className={`${className} sidebar-item`} // Ensure base class and dynamic classes
            key={item.key} // Key should be on the outermost element in a map
        >
            <SidebarLink href="#" label={item.label}>
                {item.icon}
                {!$collapsed && <span>{item.label}</span>}
            </SidebarLink>
        </StyledSidebarItem>
    );
};


const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ children }) => { // Using CollapsibleSidebar now

    const navItems = [
        { key: 'home', label: "Home", icon: <FaHome /> },
        { key: 'map', label: "Map", icon: <FaMap /> },
        { key: 'data', label: "Data", icon: <FaDatabase /> },
        { key: 'settings', label: "Settings", icon: <FaSettings /> },
        { key: 'about', label: "About", icon: <FaInfoCircle /> },
    ];

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const toggleCollapse = useCallback(() => {
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed]);


    return (
        <SidebarContainer $collapsed={isCollapsed}
            className={isCollapsed ? 'sidebar-container collapsed' : 'sidebar-container'} // Dynamically add 'collapsed' class
        >
            <CollapseToggleButton onClick={toggleCollapse} $collapsed={isCollapsed}>
                {isCollapsed ? <FaChevronCircleRight /> : <FaChevronCircleLeft />}
            </CollapseToggleButton>

            <SidebarNav $collapsed={isCollapsed}>
                {/* Corrected map function to render SidebarItem */}
                {navItems.map(item => (
                    <SidebarItem  // Render SidebarItem - no refs or external isChecked/onClick
                        item={item}
                        $collapsed={isCollapsed}
                        key={item.key}
                    />
                ))}

                {/* 
                <SidebarItem $checked={isChecked} onClick={() => toggleCheck(child1)} ref={child1}
                    className={isChecked ? 'sidebar-item checked' : 'sidebar-item'}
                >
                    <SidebarLink href="#" label="Home">
                        <FaHome />
                        {!isCollapsed && <span>Home</span>}
                    </SidebarLink>
                </SidebarItem>

                <SidebarItem $checked={isChecked} onClick={() => toggleCheck(child2)} ref={child2}
                    className={isChecked ? 'sidebar-item checked' : 'sidebar-item'}
                >
                    <SidebarLink href="#" label="Map View">
                        <FaMap />
                        {!isCollapsed && <span>Map View</span>}
                    </SidebarLink>
                </SidebarItem>

                <SidebarItem $checked={isChecked} onClick={() => toggleCheck(child3)} ref={child3}
                    className={isChecked ? 'sidebar-item checked' : 'sidebar-item'}
                >
                    <SidebarLink href="#" label="Data">
                        <FaDatabase />
                        {!isCollapsed && <span>Data</span>}
                    </SidebarLink>
                </SidebarItem>

                <SidebarItem $checked={isChecked} onClick={() => toggleCheck(child4)} ref={child4}
                    className={isChecked ? 'sidebar-item checked' : 'sidebar-item'}
                >
                    <SidebarLink href="#" label="Settings">
                        <FaSettings />
                        {!isCollapsed && <span>Settings</span>}
                    </SidebarLink>
                </SidebarItem>

                <SidebarItem $checked={isChecked} onClick={() => toggleCheck(child5)} ref={child5}
                    className={isChecked ? 'sidebar-item checked' : 'sidebar-item'}
                >
                    <SidebarLink href="#" label="About">
                        <FaInfoCircle />
                        {!isCollapsed && <span>About</span>}
                    </SidebarLink>
                </SidebarItem> */}

                {children && !isCollapsed && <SidebarContent>{children}</SidebarContent>}
            </SidebarNav>
        </SidebarContainer>
    );
};

export default CollapsibleSidebar; // Using CollapsibleSidebar now


const SidebarContainer = styled.div<{ $collapsed: boolean; }>`
    background-color: #f0f2f5;
    color: #333;
    width: ${props => props.$collapsed ? '60px' : '270px'};
    // height: max-content;
    position: relative;
    top: 0;
    left: 0;
    transition: left .3s, width 0.3s ease-in-out;
    overflow-x: hidden;
    padding-top: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
`;

const CollapseToggleButton = styled.button<{ $collapsed: boolean; }>`
    scale:calc(135%);
    position: absolute;
    top: 10px;
    right: 10px;
    // background-color: #ddd;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: right 0.3s ease-in-out, background-color 0.3s ease;
    z-index: 10;

    &:hover {
        color: darkblue;
    }
`;

const SidebarNav = styled.nav<{ $collapsed: boolean; }>`
    padding: 15px 0 0 0;
    margin: 0;
    list-style: none;
    // display: flex;
    // flex-direction: column;
    // align-items: stretch;
    margin-top: 20px; /* Spacing below collapse button */
`;

const StyledSidebarItem = styled.li<{ $checked: boolean; }>`
    padding: 0;
    margin: 0;

    color: ${props => props.$checked ? 'darkblue' : 'revert'};
    background-color: ${props => props.$checked ? '#e0e0e0' : 'none'};

`;

// const SidebarItem = styled.li<{ $checked: boolean; }>`
//     padding: 0;
//     margin: 0;

//     color: ${props => props.$checked ? 'darkblue' : 'revert'};
//     background-color: ${props => props.$checked ? '#e0e0e0' : 'none'};

// `;

const SidebarLink = styled.a<{ label: string; }>`
    display: flex;
    // align-items: center;
    padding: 10px 25px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.2s ease;
    // position: relative; // For icon positioning
    white-space: nowrap; /* Prevent text wrapping */
    // overflow: hidden;     /* Clip overflowing text */
    // text-overflow: ellipsis; /* Ellipsis for overflow */

    &:hover {
        color: darkblue;
        background-color: #e0e0e0;
    }

    // &:focus {
    //     color: darkblue;
    //     background-color: #e0e0e0;
    // }

    svg {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        // transition: margin-right 0.3s ease;
    }

    span {
        transition: opacity 0.3s ease, margin-left 0.3s ease;
    }
`;

const SidebarContent = styled.div`
    padding: 20px;
`;

