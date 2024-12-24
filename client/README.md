# Mehr Blog Frontend

## Overview

The frontend of the Mehr Blog project is built with React.js and provides a user-friendly interface for managing users and blog posts. It integrates with the backend API for seamless operations.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and provide the following environment variable:

   ```env
   REACT_APP_ASSETS_URL=http://localhost:5000
   REACT_APP_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will run on `http://localhost:5000` by default.

---

## Features

### User Management Pages

#### UserProfile Component

- **Description:**
  The `UserProfile` page allows users to view and update their profile information, including their name, email, avatar, and password. The user must be authenticated to access this page.
- **Endpoints Used:**
  - `GET /api/users/:id` - Fetch user data.
  - `POST /api/users/change-avatar` - Update the user avatar.
  - `PATCH /api/users/edit-user` - Update user details.
- **Functionality:**
  - Display user avatar and details.
  - Allow users to upload a new avatar.
  - Update user name, email, and password after validating the input.
  - Redirect to the login page if the user is not authenticated.

#### Register Component

- **Description:**
  The `Register` page allows new users to create an account by providing their name, email, and password. Password confirmation is required.
- **Endpoints Used:**
  - `POST /api/users/register` - Register a new user.
- **Functionality:**
  - Validates user input for required fields and password match.
  - Displays error messages for failed registration attempts.
  - Redirects to the login page upon successful registration.

### Blog Post Pages

#### PostDetail Component

- **Description:**
  The `PostDetail` page displays detailed information about a specific blog post, including the title, description, category, and author information. Only the creator of the post can edit or delete it.
- **Endpoints Used:**
  - `GET /api/posts/:id` - Fetch post details by ID.
- **Functionality:**
  - Displays the post title, description, and thumbnail.
  - Shows the author's information using the `PostAuthor` component.
  - Provides options to edit or delete the post for authenticated users.
  - Handles loading states and error messages during API calls.

---

## Components

### UserProfile

The `UserProfile` component includes the following features:

- Avatar upload using `FormData`.
- User details update with current and new password validation.
- Fetches user data upon loading.

### Register

The `Register` component includes:

- User input validation for name, email, password, and confirmation password.
- Error handling for failed registration attempts.
- Integration with the backend API for user registration.

### PostDetail

The `PostDetail` component includes:

- Displays detailed post information, including title, description, category, and author details.
- Provides options for authenticated users to edit or delete the post.
- Displays a loading indicator during data fetch and handles errors gracefully.

---

## Development Tools

- **React Router:** For navigation and routing.
- **React Context API:** For managing global user state.
- **React Icons:** For UI enhancements.
- **Fetch API:** For making API calls to the backend.

---

## Contributing

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License.
