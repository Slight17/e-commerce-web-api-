# Advanced APIs Practice Project

This project is a practice exercise for building advanced APIs using Node.js, Express, and MongoDB. It includes various routes for handling user authentication, product management, and discount codes. Below is a guide to help you set up and understand the project.

## Table of Contents

1. [Installation](#installation)
2. [Project Structure](#project-structure)
3. [API Routes](#api-routes)
   - [Access Routes](#access-routes)
   - [Product Routes](#product-routes)
   - [Discount Routes](#discount-routes)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Slight17/Advanced-APIs
   cd Advanced-APIs
   ```
2. **Install dependencies:

   ```
   npm install
   ```
3. Set up environment variables:Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/advanced_apis
   JWT_SECRET=your_jwt_secret
   API_KEY=your_api_key
   ```
4. **Start the server:**

   ```
   npm start
   ```

   The server should now be running on `http://localhost:3000`.


## Project Structure

The project is organized as follows:

* **`src/`**: Contains the main application code.
  * **`controllers/`**: Handles the logic for each route.
  * **`routes/`**: Defines the API routes.
  * **`authorization/`**: Manages authentication and authorization.
  * **`utils/`**: Contains utility functions.
* **`server.js`**: The entry point of the application.
* **`package.json`**: Lists the project dependencies and scripts.

## API Routes

### Access Routes

These routes handle user authentication and authorization.

* **POST `/v1/api/shop/signup`**: Register a new shop.
* **POST `/v1/api/shop/login`**: Log in to an existing shop.
* **POST `/v1/api/shop/logout`**: Log out from the current session (requires authentication).
* **POST `/v1/api/shop/handleRefreshToken`**: Handle refresh token (requires authentication).

### Product Routes

These routes manage product-related operations.

* **GET `/v1/api/product/search/:keySearch`**: Search for products by keyword.
* **GET `/v1/api/product/:product_id`**: Get details of a specific product.
* **GET `/v1/api/product`**: Get a list of all products.
* **POST `/v1/api/product`**: Create a new product (requires authentication).
* **POST `/v1/api/product/set/published/:id`**: Publish a product (requires authentication).
* **POST `/v1/api/product/set/unpublished/:id`**: Unpublish a product (requires authentication).
* **GET `/v1/api/product/draft/all`**: Get all draft products for a shop (requires authentication).
* **GET `/v1/api/product/published/all`**: Get all published products for a shop (requires authentication).
* **PATCH `/v1/api/product/:productId`**: Update a product (requires authentication).

### Discount Routes

These routes handle discount code operations.

* **POST `/v1/api/discount/amount`**: Calculate the discount amount.
* **GET `/v1/api/discount/list_product_codes`**: Get all discount codes.
* **POST `/v1/api/discount`**: Create a new discount code (requires authentication).
* **GET `/v1/api/discount`**: Get all discount codes with products (requires authentication).
* **DELETE `/v1/api/discount`**: Delete discount codes (requires authentication).
* **POST `/v1/api/discount/cancel`**: Cancel a discount code (requires authentication).

## Usage

To use the API, you can make requests to the endpoints listed above. Here are some examples using `curl`:


* **Log in to a shop:**

  ```
  curl -X POST http://localhost:3000/v1/api/shop/login -H "Content-Type: application/json" -d '{"email": "shop@example.com", "password": "password123"}'
  ```
* **Create a new product:**

  ```
  curl -X POST http://localhost:3000/v1/api/product -H "Content-Type: application/json" -H "Authorization: Bearer <your_jwt_token>" -d '{"name": "Product Name", "price": 100, "quantity": 10}'
  ```
* **Create a new discount code:**

  ```
  curl -X POST http://localhost:3000/v1/api/discount -H "Content-Type: application/json" -H "Authorization: Bearer <your_jwt_token>" -d '{"code": "DISCOUNT10", "value": 10}'
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://chat.deepseek.com/a/chat/s/LICENSE) file for details.
