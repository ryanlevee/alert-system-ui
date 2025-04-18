import React from 'react';
import gitHubLogo from '../static/logos/github-mark-dark.png';
import linkedInLogo from '../static/logos/LI-In-Bug.png';
import gmailLogo from '../static/logos/gmail-logo.png';

function About() {
    return (
        <div className="data-container about-container">
            <div className="top-container">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>About Page</span>
                    </h4>
                    <h2 id="page-title">about</h2>
                </div>
            </div>
            <div className="details-div-container">
                <div>Created by: Ryan Levee</div>
                <div>
                    <a className="about-a" href="https://github.com/ryanlevee/">
                        <div className="about-logo-container">
                            <img
                                id="github-logo"
                                className="about-logo"
                                src={gitHubLogo}
                            />
                        </div>
                        <div>GitHub</div>
                    </a>
                    <a
                        className="about-a"
                        href="https://www.linkedin.com/in/ryanlevee/"
                    >
                        <div className="about-logo-container">
                            <img
                                id="linkedin-logo"
                                className="about-logo"
                                src={linkedInLogo}
                            />
                        </div>
                        <div>LinkedIn</div>
                    </a>
                    <a className="about-a" href="mailto:ryanlevee@gmail.com">
                        <div className="about-logo-container">
                            <img
                                id="gmail-logo"
                                className="about-logo"
                                src={gmailLogo}
                            />
                        </div>
                        <div>email</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default About;
