// Home.tsx
import React, { useState } from 'react';
import cardMap from '../static/homeCards/map_view-cropped.png';
import cardEvent from '../static/homeCards/event_tracker_cropped.png';
import cardData from '../static/homeCards/data_dashboard_cropped.png';

// Define the structure for card data
interface CardInfo {
    id: string;
    src: string;
    alt: string;
    label: string;
}

// Array of card data - IMPORTANT: Ensure initial selectedIndex matches the middle element
const cardDataArray: CardInfo[] = [
    { id: 'data', src: cardData, alt: 'card-data', label: 'data dashboard' }, // Index 0
    { id: 'map', src: cardMap, alt: 'card-map', label: 'map view' }, // Index 1 (Initial Center)
    { id: 'event', src: cardEvent, alt: 'card-event', label: 'event tracker' }, // Index 2
];

const CardComponent: React.FC = () => {
    // State to track the index of the selected (center) card. Start with index 1.
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const numCards = cardDataArray.length; // Store the number of cards

    // Handler to update the selected index when clicking a card
    const handleCardClick = (index: number) => {
        setSelectedIndex(index);
    };

    // Handler for the "previous" arrow
    const handlePreviousClick = () => {
        // Calculate the previous index, wrapping around using modulo
        const newIndex = (selectedIndex - 1 + numCards) % numCards;
        setSelectedIndex(newIndex);
    };

    // Handler for the "next" arrow
    const handleNextClick = () => {
        // Calculate the next index, wrapping around using modulo
        const newIndex = (selectedIndex + 1) % numCards;
        setSelectedIndex(newIndex);
    };

    // Function to determine the position class based on index
    const getPositionClass = (index: number): string => {
        if (index === selectedIndex) {
            return 'card-center';
        } else if (index === (selectedIndex - 1 + numCards) % numCards) {
            return 'card-left';
        } else if (index === (selectedIndex + 1) % numCards) {
            return 'card-right';
        }
        return ''; // Should not happen
    };

    return (
        // Use relative positioning on the container to contain the absolute cards and arrows
        <div className="cards-container home">
            {/* Left Arrow Button */}
            <button
                type="button" // Explicitly set type for accessibility
                id="left-arrow"
                className="carousel-arrow left"
                onClick={handlePreviousClick}
                aria-label="Previous Card" // Accessibility label
            >
                &#9664; {/* Left-pointing triangle */}
            </button>

            {/* Map through cards */}
            {cardDataArray.map((card, index) => (
                <div
                    key={card.id}
                    className={`card-container home ${getPositionClass(index)}`}
                    id={`card-container-${card.id}`}
                    onClick={() => handleCardClick(index)}
                    role="button" // Add role for semantics since it's clickable
                    tabIndex={0} // Make it focusable
                    onKeyDown={e => e.key === 'Enter' && handleCardClick(index)} // Allow activation with Enter key
                >
                    <div className="card-container label">{card.label}</div>
                    <img
                        id={`card-${card.id}`}
                        className="home-card"
                        src={card.src}
                        alt={card.alt} // Alt text is good for accessibility
                    />
                </div>
            ))}

            {/* Right Arrow Button */}
            <button
                type="button" // Explicitly set type
                id="right-arrow"
                className="carousel-arrow right"
                onClick={handleNextClick}
                aria-label="Next Card" // Accessibility label
            >
                &#9654; {/* Right-pointing triangle */}
            </button>
        </div>
    );
};

// --- Home component remains the same ---
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
