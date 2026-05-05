# Simple Authentication App

This is a simple, clean, and modern-looking authentication application built with HTML, Tailwind CSS, and vanilla JavaScript. It uses a free API for user registration, login, and session management.

## Features

-   **User Registration:** New users can sign up.
-   **User Login:** Existing users can log in to their accounts.
-   **Dashboard:** A protected view that is only accessible after logging in.
-   **User Profile:** Displays the logged-in user's information (username, email, role).
-   **Logout:** Users can securely log out.
-   **Persistent Session:** The app keeps the user logged in across page reloads using `localStorage`.
-   **Responsive Design:** The UI is built with Tailwind CSS and is responsive to different screen sizes.
-   **Loading & Feedback:** Includes a loading spinner and toast notifications for user feedback.

## Technologies Used

-   **Frontend:**
    -   HTML
    -   [Tailwind CSS](https://tailwindcss.com/) for styling.
    -   Vanilla JavaScript for application logic.
-   **API:**
    -   [FreeAPI](https://freeapi.app/) for the backend service.

## Getting Started

### Prerequisites

You just need a modern web browser.

### Running the Application

1.  Clone the repository or download the source code.
2.  Open the `index.html` file in your web browser.

That's it! The application will be running locally in your browser.

## How It Works

The application is a single-page application (SPA) that dynamically shows and hides different "screens" (Login, Register, Dashboard) based on the user's authentication state.

-   **`script.js`**: Contains all the JavaScript logic for the application.
    -   **State Management:** Manages the current view and user data.
    -   **API Client:** A simple `apiCall` function handles all communication with the backend API. It automatically attaches the authentication token to protected requests.
    -   **Authentication:** Includes functions for handling login, registration, and logout.
    -   **UI Updates:** Functions to show/hide loaders, display toast notifications, and update the user profile information on the dashboard.
-   **`index.html`**: The main HTML file that contains the structure for all screens.
-   **Tailwind CSS**: Used for all styling directly in the HTML for a modern and responsive design.
