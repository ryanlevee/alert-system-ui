import React, { JSX, useState } from 'react';
import About from './about/About';
import Navbar from './bars/Nav';
import Sidebar from './bars/Side';
import DataComponent from './data/Data';
import Events from './events/Events';
import Home from './home/Home';
import MapComponent from './map/Map';

function App(): JSX.Element {
    const [currentPage, setCurrentPage] = useState('home');
    const [isNight, setIsNight] = useState<boolean>(true);
    const [isAnimated, setIsAnimated] = useState<boolean>(true);
    const [isCollapsedLeft, setIsCollapsedLeft] = useState<boolean>(false);

    return (
        <div
            className={`app-container night-${isNight} animation-${isAnimated}`}
        >
            <Navbar
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                isNight={isNight}
                setIsCollapsedLeft={setIsCollapsedLeft}
                isCollapsedLeft={isCollapsedLeft}
            ></Navbar>

            {(() => {
                switch (currentPage) {
                    case 'home':
                        return <Home isNight={isNight} />;
                    case 'map':
                        return <MapComponent isNight={isNight} />;
                    case 'events':
                        return <Events />;
                    case 'data':
                        return <DataComponent isAnimated={isAnimated} />;
                    case 'about':
                        return <About isNight={isNight} />;
                    default:
                        return <Home isNight={isNight} />;
                }
            })()}
            <Sidebar
                onThemeChange={setIsNight}
                isNight={isNight}
                onAnimationChange={setIsAnimated}
                isAnimated={isAnimated}
                isCollapsedLeft={isCollapsedLeft}
                setIsCollapsedLeft={setIsCollapsedLeft}
                currentPage={currentPage}
            ></Sidebar>
        </div>
    );
}

export default App;
