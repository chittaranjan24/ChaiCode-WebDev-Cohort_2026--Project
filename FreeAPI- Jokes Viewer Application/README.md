# Ha-Ha Hub — Jokes Viewer

A sleek and interactive web application for browsing, searching, and collecting your favorite jokes. Built with vanilla HTML, CSS, and JavaScript, this project demonstrates how to create a dynamic front-end experience using a public API.

## ✨ Features

- **😂 Endless Jokes**: Fetches a stream of jokes from the [FreeAPI Random Jokes API](https://freeapi.app/).
- **⚡️ Dynamic UI**: Jokes are displayed in a responsive grid that updates in real-time.
- **🔍 Powerful Search & Filter**:
    - Full-text search to find jokes containing specific words.
    - Filter jokes by category.
    - Sort jokes alphabetically (A-Z, Z-A) or by liked status.
- **❤️ Like & Collect**:
    - Like your favorite jokes to save them.
    - View a list of only your liked jokes.
    - A persistent counter tracks your liked jokes.
- **📋 One-Click Copy**: Easily copy any joke's text to your clipboard.
- **👀 Modal View**: Click on any joke card to see it in a clean, focused modal view.
- **🎨 Modern Design**:
    - A beautiful, dark-themed UI with subtle animations.
    - Responsive design that works on desktop and mobile devices.
- **🔄 Load More**: Infinite scrolling-style "Load More" button to fetch more jokes without a page refresh.
- **💡 User Feedback**:
    - Smooth loading animations while fetching data.
    - Clear error messages if the API fails.
    - Empty state message when no jokes match the filters.
    - Toast notifications for actions like "copy" and "like".

## 🛠️ Tech Stack

- **HTML5**: For the structure and content of the application.
- **CSS3**: For styling, layout, and animations. Uses modern features like CSS variables and Flexbox/Grid.
- **Vanilla JavaScript (ES6+)**: For all the application logic, including:
    - Fetching data from the API using `async/await`.
    - DOM manipulation.
    - State management (search queries, filters, liked jokes).
    - Event handling.

## 🚀 Getting Started

### Prerequisites

You just need a modern web browser that supports HTML5, CSS3, and JavaScript (ES6+).

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ha-ha-hub.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd ha-ha-hub
    ```
3.  **Open `index.html` in your browser:**
    You can do this by simply double-clicking the `index.html` file in your file explorer.

    Alternatively, for a better development experience, you can use a local server. If you have VS Code with the "Live Server" extension:
    - Right-click on `index.html`.
    - Select "Open with Live Server".

## 📂 Project Structure

```
.
├── index.html      # The main HTML file
├── style.css       # All styles for the application
└── script.js       # All JavaScript logic
```

## 🔧 How It Works

The application is a single-page application (SPA) built without any frameworks.

1.  **Initialization**: When the page loads (`script.js`), it makes an initial API call to `https://api.freeapi.app/api/v1/public/randomjokes` to fetch the first batch of jokes.
2.  **State Management**: The application maintains its state in several JavaScript variables:
    - `allJokes`: An array holding all jokes fetched from the API.
    - `liked`: A `Set` to store the IDs of liked jokes for efficient lookups.
    - `currentPage`: Tracks the current page for fetching more jokes.
    - `showOnlyLiked`: A boolean to toggle between all jokes and liked jokes.
3.  **Rendering**: The `render()` function is the core of the UI. It filters and sorts the `allJokes` array based on the current state (search, category, sort order) and generates the HTML for the joke cards. It then injects this HTML into the DOM.
4.  **Event Handling**: Event listeners are attached to all interactive elements (buttons, inputs, selects). When a user interacts with the UI:
    - An event listener fires.
    - The state is updated (e.g., `searchInput.value` changes, a joke ID is added to the `liked` set).
    - The `render()` function is called again to reflect the new state in the UI.
5.  **API Interaction**: The `fetchJokes()` function handles all communication with the jokes API. It uses the `fetch` API with `async/await` for clean, asynchronous code. It also manages loading and error states.

## 🌟 Future Improvements

- [ ] **Local Storage**: Persist liked jokes in the browser's `localStorage` so they are not lost on page reload.
- [ ] **Themes**: Add a light mode theme toggle.
- [ ] **Pagination**: Implement traditional pagination instead of "Load More".
- [ ] **Share Functionality**: Add a button to share a joke on social media.
