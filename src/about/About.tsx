import React, { JSX, useCallback, useState } from 'react';

import gitHubLogo from '../static/logos/github-mark-dark.png';
import gitHubLogoNight from '../static/logos/github-mark-white.png';
import gmailLogo from '../static/logos/gmail-logo.png';
import linkedInLogo from '../static/logos/LI-In-Bug.png';
import playLogo from '../static/logos/play2learn-logo.png';
import radarLogo from '../static/logos/weather-radar_blue.png';

import PageHeader from '../common/PageHeader';
import resumePdf from '../static/resume/Ryan_Levee_resume_2025.pdf';
import resume1 from '../static/resume/Ryan_Levee_resume_2025_Page_1-resize.png';
import resume2 from '../static/resume/Ryan_Levee_resume_2025_Page_2-resize.png';

interface ContactLink {
    href: string;
    logoSrc: string;
    logoSrcNight: string;
    logoId: string;
    logoAlt: string;
    labelText: string;
}

interface ProjectLink {
    href: string;
    logoSrc: string;
    logoId: string;
    logoAlt: string;
    projectName: string;
    hostName: string;
    logoContainerId?: string;
}

interface ResumeImage {
    src: string;
    id: string;
    alt: string;
}

const contactLinks: ContactLink[] = [
    {
        href: 'https://github.com/ryanlevee/',
        logoSrc: gitHubLogo,
        logoSrcNight: gitHubLogoNight,
        logoId: 'github-logo',
        logoAlt: 'GitHub Logo',
        labelText: 'GitHub',
    },
    {
        href: 'https://www.linkedin.com/in/ryanlevee/',
        logoSrc: linkedInLogo,
        logoSrcNight: linkedInLogo,
        logoId: 'linkedin-logo',
        logoAlt: 'LinkedIn Logo',
        labelText: 'LinkedIn',
    },
    {
        href: 'mailto:ryanlevee@gmail.com',
        logoSrc: gmailLogo,
        logoSrcNight: gmailLogo,
        logoId: 'gmail-logo',
        logoAlt: 'Gmail Logo',
        labelText: 'email: ryanlevee@gmail.com',
    },
];

const projects: ProjectLink[] = [
    {
        href: 'https://nexradmapbox.netlify.app/',
        logoSrc: radarLogo,
        logoId: 'radar-logo',
        logoAlt: 'NEXRAD Radar Logo',
        projectName: 'NEXRAD Mapbox Radar Viewer',
        hostName: 'Netlify',
    },
    {
        href: 'https://ryanlevee.pythonanywhere.com/',
        logoSrc: playLogo,
        logoId: 'play-logo',
        logoAlt: 'Play2Learn Logo',
        projectName: 'Play2Learn App',
        hostName: 'PythonAnywhere',
        logoContainerId: 'play-logo-container',
    },
];

const resumeImages: ResumeImage[] = [
    { src: resume2, id: 'resume-img-2', alt: 'Resume Page 2' },
    { src: resume1, id: 'resume-img-1', alt: 'Resume Page 1' },
];

function About({
    isNight,
    setCurrentPage,
}: {
    isNight: boolean;
    setCurrentPage: (page: string) => void;
}): JSX.Element {
    const [isZoomed, setIsZoomed] = useState<boolean>(false);

    const handleResumeClick = useCallback(
        (e: React.MouseEvent) => {
            setIsZoomed(!isZoomed);
            const target = e.currentTarget as HTMLInputElement;
            const parent = target.parentElement as HTMLDivElement;

            if (!isZoomed) {
                parent.classList.add('zoom');
            } else {
                parent.classList.remove('zoom');
            }
            return undefined;
        },
        [isZoomed]
    );

    return (
        <div className="data-container about">
            <div className="top-container">
                <PageHeader
                    page={{ title: 'About Page', key: 'about', label: 'about' }}
                    setCurrentPage={setCurrentPage}
                />
            </div>
            <div className="about-container">
                <div className="about-details-container">
                    <p className="about-details-header">
                        created by: Ryan Levee
                    </p>
                    <div className="details-a-container">
                        {contactLinks.map(link => (
                            <a
                                key={link.href}
                                className="about-a"
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="about-logo-container">
                                    <img
                                        id={link.logoId}
                                        className="about-logo"
                                        src={
                                            isNight
                                                ? link.logoSrcNight
                                                : link.logoSrc
                                        }
                                        alt={link.logoAlt}
                                    />
                                </div>
                                <span>{link.labelText}</span>
                            </a>
                        ))}
                    </div>
                    <div className="about-resume-container">
                        <div
                            id="about-overlay"
                            onClick={handleResumeClick}
                        ></div>
                        <p
                            className="about-details-header resume"
                            onClick={handleResumeClick}
                        >
                            view my resume
                        </p>
                        <div
                            id="resume-container-inner"
                            onClick={handleResumeClick}
                        >
                            <a
                                href={resumePdf}
                                download="Ryan_Levee_resume_2025.pdf"
                                className="resume-download-link"
                            >
                                download my resume
                            </a>
                            {resumeImages.map(image => (
                                <img
                                    key={image.id}
                                    id={image.id}
                                    className="resume-img"
                                    src={image.src}
                                    alt={image.alt}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="about-projects-container">
                    <p className="about-details-header">
                        check out my other projects
                    </p>
                    <div>
                        <div>
                            {projects.map(project => (
                                <a
                                    key={project.href}
                                    className="about-a projects"
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="about-div projects">
                                        <div
                                            id={project.logoContainerId}
                                            className="about-logo-container"
                                        >
                                            <img
                                                id={project.logoId}
                                                className="about-logo"
                                                src={project.logoSrc}
                                                alt={project.logoAlt}
                                            />
                                        </div>
                                        <p>
                                            {project.projectName}{' '}
                                            <span className="host-name">
                                                ({project.hostName})
                                            </span>
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
