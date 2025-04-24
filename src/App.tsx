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
                        return (
                            <Home
                                setCurrentPage={setCurrentPage}
                                isNight={isNight}
                            />
                        );
                    case 'map':
                        return (
                            <MapComponent
                                setCurrentPage={setCurrentPage}
                                isNight={isNight}
                            />
                        );
                    case 'events':
                        return <Events setCurrentPage={setCurrentPage} />;
                    case 'data':
                        return (
                            <DataComponent
                                setCurrentPage={setCurrentPage}
                                isAnimated={isAnimated}
                            />
                        );
                    case 'about':
                        return (
                            <About
                                setCurrentPage={setCurrentPage}
                                isNight={isNight}
                            />
                        );
                    default:
                        return (
                            <Home
                                setCurrentPage={setCurrentPage}
                                isNight={isNight}
                            />
                        );
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
