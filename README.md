# Mehr Blog Fullstack Project

## Overview

The Mehr Blog project is a full-stack application consisting of a frontend built with React.js and a backend powered by Node.js and Express.js. It provides a user-friendly interface for managing users and blog posts, integrating seamlessly with a RESTful API backend. The backend leverages MongoDB for data storage and includes middleware for error handling, authentication, and file uploads.

---

## Frontend

### Installation

1. Clone the frontend repository:

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
   npm run dev
   ```

The application will run on `http://localhost:5000` by default.

### Features

#### User Management Pages

- **UserProfile Component**: Allows users to view and update profile information, including name, email, avatar, and password. Requires authentication.

  - **Endpoints Used**:
    - `GET /api/users/:id` - Fetch user data.
    - `POST /api/users/change-avatar` - Update user avatar.
    - `PATCH /api/users/edit-user` - Update user details.

- **Register Component**: Enables new users to create accounts. Validates inputs and integrates with the backend for registration.
  - **Endpoints Used**:
    - `POST /api/users/register` - Register a new user.

#### Blog Post Pages

- **PostDetail Component**: Displays detailed information about specific blog posts. Only creators can edit or delete posts.
  - **Endpoints Used**:
    - `GET /api/posts/:id` - Fetch post details.

### Development Tools

- **React Router**: Navigation and routing.
- **React Context API**: Global state management.
- **React Icons**: UI enhancements.
- **Fetch API**: Backend integration.

---

## Backend

### Installation

1. Clone the backend repository:

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and provide the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=<your-mongo-uri>
   JWT_SECRET_KEY=<your-secret-key>
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000` by default.

### Features

#### User Management

- **Register User**:

  - **Endpoint**: `POST /api/users/register`
  - Registers a new user with `name`, `email`, `password`, and `password2` fields.

- **Login User**:

  - **Endpoint**: `POST /api/users/login`
  - Authenticates users and returns a JWT.

- **Get User Profile**:

  - **Endpoint**: `GET /api/users/:id`
  - Retrieves a user’s profile data by ID. Requires authentication.

- **Edit User Details**:

  - **Endpoint**: `PATCH /api/users/edit-user`
  - Updates user details, requiring current password verification.

- **Change User Avatar**:
  - **Endpoint**: `POST /api/users/change-avatar`
  - Allows users to upload a new profile picture.

#### Post Management

- **Create Post**:

  - **Endpoint**: `POST /api/posts`
  - Creates a new post. Requires authentication.

- **Get All Posts**:

  - **Endpoint**: `GET /api/posts`
  - Retrieves all posts, sorted by the last update time.

- **Get Post by ID**:

  - **Endpoint**: `GET /api/posts/:id`
  - Retrieves a specific post by ID.

- **Update Post**:

  - **Endpoint**: `PATCH /api/posts/:id`
  - Updates a post. Requires authentication.

- **Delete Post**:
  - **Endpoint**: `DELETE /api/posts/:id`
  - Deletes a post. Requires authentication.

### Middleware

- **Authentication Middleware**: Verifies JWT tokens and attaches user objects to requests.
- **Error Middleware**: Handles application-level errors and sends appropriate responses.

### Database Schema

#### User Model

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  posts: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
export default User;
```

#### Post Model

```javascript
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: {
        values: [
          "Travel",
          "Fitness",
          "Food",
          "Parenting",
          "Beauty",
          "Photography",
          "Art",
          "Writing",
          "Music",
          "Book",
        ],
        message: "{VALUE} is not a supported category",
      },
      required: true,
    },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Post = mongoose.model("Post", postSchema);
export default Post;
```

---

## Contributing

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License.
