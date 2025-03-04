import React from 'react';

function Home() {
    return (
        <div className="data-container home-container">
            <div className="top-container">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>Home Page</span>
                    </h4>
                    <h2 id="page-title">homepage</h2>
                </div>
            </div>
            <div className="details-container">
                <p>React demo homepage placeholder</p>
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
    );
}

export default Home;
