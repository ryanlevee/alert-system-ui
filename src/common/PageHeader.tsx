import React, { useCallback } from 'react';

interface Page {
    title: string;
    key: string;
    label: string;
}

function PageHeader({
    page,
    setCurrentPage,
}: {
    page: Page;
    setCurrentPage: (page: string) => void;
}): React.ReactNode | null {
    const handleClick = useCallback(() => {
        if (page.key !== 'home') setCurrentPage('home');
    }, []);
    return (
        <div className="headers-container">
            <h4>
                <a className="header-home-click" onClick={handleClick}>
                    React Demo
                </a>{' '}
                &#8250; <span>{page.title}</span>
            </h4>
            <h2 className="page-title">{page.label}</h2>
        </div>
    );
}

export default PageHeader;
