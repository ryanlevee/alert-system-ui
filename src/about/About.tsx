import React from 'react';
import gitHubLogo from '../static/logos/github-mark-dark.png';
import linkedInLogo from '../static/logos/LI-In-Bug.png';
import gmailLogo from '../static/logos/gmail-logo.png';
import resume1 from '../static/resume/Ryan_Levee_resume_2025_Page_1.jpg';
import resume2 from '../static/resume/Ryan_Levee_resume_2025_Page_2.jpg';
import radarLogo from '../static/logos/weather-radar_blue.png';
import playLogo from '../static/logos/play2learn-logo.png';
import resumePdf from '../static/resume/Ryan_Levee_resume_2025.pdf'; // Import the PDF

function About() {
    return (
        <div className="data-container about">
            <div className="top-container">
                <div className="headers-container">
                    <h4>
                        React Demo &#8250; <span>About Page</span>
                    </h4>
                    <h2 className="page-title">about</h2>
                </div>
            </div>
            <div className="about-container">
                <div className="about-details-container">
                    <p className="about-details-header">
                        created by: Ryan Levee
                    </p>
                    <div className="details-a-container">
                        <a
                            className="about-a"
                            href="https://github.com/ryanlevee/"
                        >
                            <div className="about-logo-container">
                                <img
                                    id="github-logo"
                                    className="about-logo"
                                    src={gitHubLogo}
                                />
                            </div>
                            <span>GitHub</span>
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
                            <span>LinkedIn</span>
                        </a>
                        <a
                            className="about-a"
                            href="mailto:ryanlevee@gmail.com"
                        >
                            <div className="about-logo-container">
                                <img
                                    id="gmail-logo"
                                    className="about-logo"
                                    src={gmailLogo}
                                />
                            </div>
                            <span>email: ryanlevee@gmail.com</span>
                        </a>
                    </div>
                    <div className="about-resume-container">
                        <a
                            href={resumePdf}
                            download="Ryan_Levee_resume_2025.pdf"
                            className="resume-download-link"
                        >
                            <p className="about-details-header">
                                download my resume
                            </p>
                            <img
                                id="resume-img-1"
                                className="resume-img"
                                src={resume1}
                            />
                            <img
                                id="resume-img-2"
                                className="resume-img"
                                src={resume2}
                            />
                        </a>
                    </div>
                </div>
                <div className="about-projects-container">
                    <p className="about-details-header">
                        check out my other projects
                    </p>
                    <a
                        className="about-a projects"
                        href="https://nexradmapbox.netlify.app/"
                    >
                        <div className="about-div projects">
                            <div className="about-logo-container">
                                <img
                                    id="radar-logo"
                                    className="about-logo"
                                    src={radarLogo}
                                />
                            </div>
                            <p>
                                NEXRAD Mapbox Radar Viewer{' '}
                                <span className="host-name">(Netlify)</span>
                            </p>
                        </div>
                    </a>
                    <a
                        className="about-a projects"
                        href="https://ryanlevee.pythonanywhere.com/"
                    >
                        <div className="about-div projects">
                            <div
                                id="play-logo-container"
                                className="about-logo-container"
                            >
                                <img
                                    id="play-logo"
                                    className="about-logo"
                                    src={playLogo}
                                />
                            </div>
                            <p>
                                Play2Learn App
                                <span className="host-name">
                                    {' '}
                                    (PythonAnywhere)
                                </span>
                            </p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default About;
