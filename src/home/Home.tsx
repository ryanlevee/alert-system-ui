import React from 'react';
import logo from '../static/A_trs_transparent_dark.png';

function Home() {
    return (
        <div className="data-container home-container">
            <div className="top-container">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>Home Page</span>
                    </h4>
                    <h2 id="page-title">Alert System UI</h2>
                </div>
            </div>
            <div className="details-container">
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
    );
}

export default Home;
