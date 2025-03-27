# Mehr Blog Backend

## Overview

The backend of the Mehr Blog project is built with Node.js and Express.js, providing a RESTful API for managing users and blog posts. It uses MongoDB as the database and integrates with middleware for error handling, authentication, and file uploads.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mehr-blog-backend
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

---

## Features

### User Management

The `userRoutes` file handles all user-related endpoints:

1. **Register User**

   - **Endpoint:** `POST /api/users/register`
   - **Description:** Registers a new user with `name`, `email`, `password`, and `password2` fields.

2. **Login User**

   - **Endpoint:** `POST /api/users/login`
   - **Description:** Authenticates a user with email and password and returns a JWT.

3. **Get User Profile**

   - **Endpoint:** `GET /api/users/:id`
   - **Description:** Retrieves a user's profile data by ID. Authentication is required.

4. **Edit User Details**

   - **Endpoint:** `PATCH /api/users/edit-user`
   - **Description:** Allows users to update their name, email, and password. Requires current password verification.

5. **Change User Avatar**

   - **Endpoint:** `POST /api/users/change-avatar`
   - **Description:** Allows users to upload a new profile picture. File size is limited to 500 KB. Authentication is required.

6. **Get All Authors**
   - **Endpoint:** `GET /api/users`
   - **Description:** Retrieves a list of all authors. No authentication required.

### Post Management

The `postRoutes` file handles all blog post-related endpoints:

1. **Create Post**

   - **Endpoint:** `POST /api/posts`
   - **Description:** Creates a new post. Requires `title`, `category`, `description`, and `thumbnail`. Authentication is required.

2. **Get All Posts**

   - **Endpoint:** `GET /api/posts`
   - **Description:** Retrieves all posts, sorted by the last update time.

3. **Get Post by ID**

   - **Endpoint:** `GET /api/posts/:id`
   - **Description:** Retrieves a specific post by its ID.

4. **Get Posts by Category**

   - **Endpoint:** `GET /api/posts/categories/:category`
   - **Description:** Retrieves all posts in a specific category.

5. **Get Posts by User**

   - **Endpoint:** `GET /api/posts/users/:id`
   - **Description:** Retrieves all posts created by a specific user.

6. **Update Post**

   - **Endpoint:** `PATCH /api/posts/:id`
   - **Description:** Updates a post. Requires `title`, `category`, `description`, and optionally a new `thumbnail`. Authentication is required.

7. **Delete Post**
   - **Endpoint:** `DELETE /api/posts/:id`
   - **Description:** Deletes a post by its ID. Authentication is required.

---

## Middleware

1. **Authentication Middleware**

   - Protects routes by verifying the JWT token and attaching the user object to the request.

2. **Error Middleware**
   - Handles application-level errors and sends appropriate error responses to the client.

---

## Swagger API Documentation

Swagger is integrated to provide interactive API documentation.

- **Docs available at:** `http://localhost:5000/api-docs`

### How to Add Documentation
- Swagger definitions are written using JSDoc-style comments inside the route controllers (`./controllers/*.js`).
- Supported by `swagger-jsdoc` and `swagger-ui-express` packages.

### Example Swagger Comment:
```js
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     ...
 */
```

---

## Database Schema

### User Model

The `User` model includes the following fields:

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

### Post Model

The `Post` model includes the following fields:

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
  { timestamps: true } 
);

const Post = mongoose.model("Post", postSchema);
export default Post;
```

---

## Development Tools

- **File Upload:** Uses `express-fileupload` for handling file uploads for posts and user avatars.
- **Authentication:** Utilizes `jsonwebtoken` for user authentication.
- **Password Hashing:** Uses `bcrypt` to securely hash passwords.
- **UUID:** Generates unique file names for uploads using `uuid`.

### Run Seeder Script

To populate the database with fake users and posts, use the following command:

```bash
npm run seed
```

This script will:
- Clear existing users and posts.
- Generate 15 fake users with avatars.
- Generate 220 fake posts assigned to random users and categories.

---


## Contributing

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License.
