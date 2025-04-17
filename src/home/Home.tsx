import React, { useState } from 'react';
import cardMap from '../static/homeCards/map_view-cropped.png';
import cardEvent from '../static/homeCards/event_tracker_cropped.png';
import cardData from '../static/homeCards/data_dashboard_cropped.png';

interface CardInfo {
    id: string;
    src: string;
    alt: string;
    label: string;
}

const cardDataArray: CardInfo[] = [
    { id: 'data', src: cardData, alt: 'card-data', label: 'data dashboard' },
    { id: 'map', src: cardMap, alt: 'card-map', label: 'map view' },
    { id: 'event', src: cardEvent, alt: 'card-event', label: 'event tracker' },
];

const CardComponent: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const numCards = cardDataArray.length;

    const handleCardClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handlePreviousClick = () => {
        const newIndex = (selectedIndex - 1 + numCards) % numCards;
        setSelectedIndex(newIndex);
    };

    const handleNextClick = () => {
        const newIndex = (selectedIndex + 1) % numCards;
        setSelectedIndex(newIndex);
    };

    const getPositionClass = (index: number): string => {
        if (index === selectedIndex) {
            return 'card-center';
        } else if (index === (selectedIndex - 1 + numCards) % numCards) {
            return 'card-left';
        } else if (index === (selectedIndex + 1) % numCards) {
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
                &#9664; {/* Left-pointing triangle */}
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
                        className="home-card"
                        src={card.src}
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
                &#9654; {/* Right-pointing triangle */}
            </button>
        </div>
    );
};

function Home() {
    return (
        <div className="data-container home">
            <div className="top-container home">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>Home Page</span>
                    </h4>
                    <h2 id="page-title">Alert System UI</h2>
                </div>
            </div>
            <div className="details-container home">
                <div>
                    <p>Welcome to my (unfinished) React demo.</p>
                    <div className="list-container">
                        <span>Pages currently deployed:</span>
                        <ul>
                            <li>Map View</li>
                            <li>Event Tracker</li>
                            <li>Data Dashboard</li>
                        </ul>
                    </div>
                </div>
            </div>
            <CardComponent />
        </div>
    );
}

export default Home;
