import React, { JSX, useState } from "react";
import About from "./about/About";
import DataComponent from "./data/Data";
import Events from "./events/Events";
import Home from "./home/Home"; // Adjust path if necessary
import MapComponent from "./map/Map";
import Settings from "./settings/Settings";
import CollapsibleSidebar from "./Sidebar"; // Assuming Sidebar.tsx is in the same directory

function App(): JSX.Element {
    const [currentPage, setCurrentPage] = useState("home"); // State in App component now

    return (
        <div className="app-container">
            <CollapsibleSidebar
                onPageChange={setCurrentPage}
                currentPage={currentPage} // <--- Pass the currentPage state here
            ></CollapsibleSidebar>

            {/* Conditionally render pages based on currentPage state */}
            {(() => {
                switch (currentPage) {
                    case "home":
                        return <Home />;
                    case "map":
                        return <MapComponent />;
                    case "events":
                        return <Events />;
                    case "data":
                        return <DataComponent />;
                    case "settings":
                        return <Settings />;
                    case "about":
                        return <About />;
                    default:
                        return <Home />; // Or a default "not found" page
                }
            })()}

            <div style={{width:'20%', background: '#A2A2A3'}}></div>
        </div>
    );
}

export default App;
