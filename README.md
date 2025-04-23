# Alert System UI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Demo:** [**https://alertsystemreact.netlify.app/**](https://alertsystemreact.netlify.app/)

**Related Project:** This UI complements the conceptual "Real-Time Scan and Alert System" backend: [GitHub repo](https://github.com/ryanlevee/real-time-scan-and-alert-system)

## Overview

This project is a sophisticated frontend demonstration built with **React** and **TypeScript**, designed to showcase modern web development techniques and UI/UX principles. It serves as the user interface for a conceptual "Real-Time Scan and Alert System", visualizing simulated alert data in various interactive ways. Users may navigate using the sidebar to visualize events geographically on the Map View, track detailed alert information in the Event Tracker, gain insights from aggregated statistics on the Data Dashboard, and more.

## Key Features

This application demonstrates a range of features expected in a modern data-driven UI:

* **Interactive Dashboard (`/data`):**
    * Aggregated data visualization using **Recharts** bar charts.
    * Detailed summary cards for event types, showing severity distribution and year-over-year trends.
    * Tabbed view for switching between category-focused and overall data summaries.
    * Data filtering (by category, event type) and sorting (by frequency, alphabetical).
    * Optional animations on charts.
* **Geospatial Map View (`/map`):**
    * Event visualization on an interactive map using **Leaflet** and `react-leaflet`.
    * Categorized markers with distinct colors and popups displaying event details.
    * Optional **Heatmap layer** (`keli-heatmap.js`) to show event density.
    * Layer control for toggling markers and heatmap visibility.
    * Dynamic map tile layers adapting to the application's theme (Light/Dark).
    * Filtering by event category and type.
* **Detailed Event Tracker (`/events`):**
    * Paginated and filterable table view of individual alert events.
    * Sortable columns for key event details.
    * **Expandable rows** to reveal comprehensive event information without navigating away.
    * "Expand/Collapse All" functionality for efficient data review.
    * Filtering by event category and type, with display limits.
* **Responsive UI & Theming:**
    * **Collapsible Navigation:** Both left (page navigation) and right (settings) sidebars are collapsible to maximize content visibility.
    * **Light/Dark Mode:** Application-wide theme switching affecting all components, including maps and charts.
    * Built with responsiveness in mind (though specific breakpoints might vary).
* **Component-Based Architecture:** Developed using reusable React components with TypeScript for type safety.
* **About Page (`/about`):** Includes creator information, links to other projects, and a downloadable resume.
* **Home Page (`/home`):** Introduces the application and features an interactive card carousel showcasing the different pages.

## Technology Stack

* **Core:** React, TypeScript
* **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
* **Styling:** CSS Modules, Styled Components
* **Mapping:** Leaflet, React Leaflet, keli-heatmap.js (Heatmap Plugin)
* **Charting:** Recharts
* **UI Libraries:**
    * React Select (Dropdowns)
    * React Icons (Icons)
* **Build Tool:** Vite
* **Deployment:** Netlify

## Getting Started Locally

To run this project on your local machine:

1.  **Prerequisites:**
    * Node.js (v18 or later recommended)
    * npm or yarn

2.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/alert-system-ui.git](https://github.com/YOUR_USERNAME/alert-system-ui.git)
    cd alert-system-ui
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Environment Variables:**
    This project uses the Stadia Maps API for the dark mode map tiles. You'll need an API key.
    * Create a `.env` file in the project root.
    * Add your Stadia Maps API key to the `.env` file:
        ```
        VITE_STADIA_API_KEY=YOUR_ACTUAL_API_KEY
        ```
    * You can obtain a free key from [Stadia Maps](https://www.stadiamaps.com/).

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ryanlevee/alert-system-ui/blob/main/LICENSE) file for details.

## Contact

Ryan Levee - [GitHub](https://github.com/ryanlevee) | [LinkedIn](https://www.linkedin.com/in/ryanlevee/) | [Email](mailto:ryanlevee@gmail.com)
