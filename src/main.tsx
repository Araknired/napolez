import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';

/**
 * Application root element identifier
 */
const ROOT_ELEMENT_ID = 'root';

/**
 * Error message for missing root element
 */
const ROOT_NOT_FOUND_ERROR = `
  Failed to find root element with id "${ROOT_ELEMENT_ID}".
  Ensure your index.html contains: <div id="${ROOT_ELEMENT_ID}"></div>
`;

/**
 * Retrieves the root DOM element for React application mounting
 * @throws {Error} If root element is not found in the DOM
 * @returns {HTMLElement} The root DOM element
 */
const getRootElement = (): HTMLElement => {
  const rootElement = document.getElementById(ROOT_ELEMENT_ID);

  if (!rootElement) {
    throw new Error(ROOT_NOT_FOUND_ERROR);
  }

  return rootElement;
};

/**
 * Initializes and renders the React application
 */
const initializeApp = (): void => {
  const rootElement = getRootElement();
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Initialize application
initializeApp();