import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/app.css';
import './styles/data.css';
import './styles/events.css';
import './styles/home.css';
import './styles/index.css';
import './styles/map.css';
import './styles/sidebar.css';

createRoot(document.getElementById('root')!).render(<App />);
