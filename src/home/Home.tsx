import React, { useState } from 'react';
import PageHeader from '../common/PageHeader';
import cardAboutNight from '../static/homeCards/about_page-night.png';
import cardAbout from '../static/homeCards/about_page.png';
import cardDataNight from '../static/homeCards/data_dashboard-night.png';
import cardData from '../static/homeCards/data_dashboard.png';
import cardEventNight from '../static/homeCards/event_tracker-night.png';
import cardEvent from '../static/homeCards/event_tracker.png';
import cardHomeNight from '../static/homeCards/home_page-night.png';
import cardHome from '../static/homeCards/home_page.png';
import cardMapNight from '../static/homeCards/map_view-night.png';
import cardMap from '../static/homeCards/map_view.png';

interface CardInfo {
    id: string;
    src: string;
    srcNight: string;
    alt: string;
    label: string;
}

const cardDataArray: CardInfo[] = [
    {
        id: 'data',
        src: cardData,
        srcNight: cardDataNight,
        alt: 'card-data',
        label: 'data dashboard',
    },
    {
        id: 'map',
        src: cardMap,
        srcNight: cardMapNight,
        alt: 'card-map',
        label: 'map view',
    },
    {
        id: 'event',
        src: cardEvent,
        srcNight: cardEventNight,
        alt: 'card-event',
        label: 'event tracker',
    },
    {
        id: 'about',
        src: cardAbout,
        srcNight: cardAboutNight,
        alt: 'card-about',
        label: 'about page',
    },
    {
        id: 'home',
        src: cardHome,
        srcNight: cardHomeNight,
        alt: 'card-home',
        label: 'home page',
    },
];

type Props = { isNight: boolean };

const CardComponent: React.FC<Props> = props => {
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const numCards = cardDataArray.length;

    const handleCardClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handlePreviousClick = () => {
        const newIndex = (selectedIndex + 1) % numCards;
        setSelectedIndex(newIndex);
    };

    const handleNextClick = () => {
        const newIndex = (selectedIndex - 1 + numCards) % numCards;
        setSelectedIndex(newIndex);
    };

    const getPositionClass = (index: number): string => {
        if (index === selectedIndex) {
            return 'card-center';
        } else if (index === (selectedIndex - 1 + numCards) % numCards) {
            return 'card-center-left';
        } else if (index === (selectedIndex - 2 + numCards) % numCards) {
            return 'card-left';
        } else if (index === (selectedIndex + 1) % numCards) {
            return 'card-center-right';
        } else if (index === (selectedIndex + 2) % numCards) {
            return 'card-right';
        }
        return '';
    };

    return (
        <div className="cards-container home">
            <button
                type="button"
                id="left-arrow"
                className="carousel-arrow left"
                onClick={handlePreviousClick}
                aria-label="Previous Card"
            >
                &#9664;
            </button>

            {cardDataArray.map((card, index) => (
                <div
                    key={card.id}
                    className={`card-container home ${getPositionClass(index)}`}
                    id={`card-container-${card.id}`}
                    onClick={() => handleCardClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleCardClick(index)}
                >
                    <div className="card-container label">{card.label}</div>
                    <img
                        id={`card-${card.id}`}
                        className="card-img"
                        src={props.isNight ? card.srcNight : card.src}
                        alt={card.alt}
                    />
                </div>
            ))}

            <button
                type="button"
                id="right-arrow"
                className="carousel-arrow right"
                onClick={handleNextClick}
                aria-label="Next Card"
            >
                &#9654;
            </button>
        </div>
    );
};

function Home({
    isNight,
    setCurrentPage,
}: {
    isNight: boolean;
    setCurrentPage: (page: string) => void;
}): React.ReactNode | null {
    return (
        <div className="data-container home">
            <div className="top-container home">
                <PageHeader
                    page={{
                        title: 'Home Page',
                        key: 'home',
                        label: 'Alert System UI',
                    }}
                    setCurrentPage={setCurrentPage}
                />
                {/* <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>Home Page</span>
                    </h4>
                    <h2 className="page-title">Alert System UI</h2>
                </div> */}
                <div className="details-p-container">
                    <p id="welcome-p">Welcome.</p>

                    <div id="summary-container">
                        <div id="indent-line"></div>
                        <div>
                            <p>
                                This is the frontend for my "Real-Time Scan and
                                Alert System" project (
                                <a href="https://github.com/ryanlevee/real-time-scan-and-alert-system">
                                    GitHub repo
                                </a>
                                ).
                            </p>
                            <p>
                                Built with React.js and TypeScript, this project
                                demonstrates various UI components and
                                techniques for visualizing and managing data,
                                themed around a conceptual alert monitoring
                                system. The application provides dynamic ways to
                                view and analyze simulated alert data. Navigate
                                using the sidebar to visualize events
                                geographically on the Map View, track detailed
                                alert information in the Event Tracker, or gain
                                insights from aggregated statistics on the Data
                                Dashboard. Visit the About page to learn more
                                about my work.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <p id="pages-deployed-p">Pages currently deployed:</p>
            <CardComponent isNight={isNight} />
        </div>
    );
}

export default Home;
