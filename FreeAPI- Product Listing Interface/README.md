# Product Listing Interface

This is a simple, clean, and responsive web interface for listing products from a public API. It features pagination, loading states, and a modern design.

## Features

- **Dynamic Product Loading**: Fetches and displays products from the FreeAPI.
- **Pagination**: Easy navigation through product pages.
- **Responsive Design**: Adapts to different screen sizes for a seamless experience on desktop and mobile devices.
- **Loading & Error States**: Provides user feedback during data fetching and in case of errors.
- **Stock Status**: Clearly indicates whether a product is "In Stock", "Low Stock", or "Out of Stock".
- **Product Details**: Shows product title, category, image, price, rating, and a short description.
- **Modern UI**: Clean and professional user interface built with HTML and CSS.

## Technologies Used

- **HTML5**: For the basic structure of the web page.
- **CSS3**: For styling the user interface, including the use of CSS variables for easy theming.
- **JavaScript (ES6+)**: For fetching data from the API, manipulating the DOM, and handling user interactions.
- **FreeAPI**: The public API used to fetch random product data.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You just need a modern web browser that supports HTML5, CSS3, and JavaScript.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repository-name.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd your-repository-name
    ```
3.  Open the `index.html` file in your web browser.

## Project Structure

The project consists of three main files:

```
.
├── index.html      // The main HTML file
├── style.css       // The stylesheet for the application
└── script.js       // The JavaScript file for fetching data and interactivity
```

-   **`index.html`**: Contains the basic structure of the web page, including the header and the main content area where the products are displayed.
-   **`style.css`**: Contains all the styles for the application. It uses CSS variables for theming and is designed to be responsive.
-   **`script.js`**: Handles all the logic for the application. It fetches data from the API, dynamically creates the product cards, and manages the pagination functionality.

## API Reference

This project uses the **FreeAPI** to get random product data.

-   **Endpoint**: `https://api.freeapi.app/api/v1/public/randomproducts`
-   **Method**: `GET`
-   **Query Parameters**:
    -   `page`: The page number to fetch.
    -   `limit`: The number of products to fetch per page (default is 12).
