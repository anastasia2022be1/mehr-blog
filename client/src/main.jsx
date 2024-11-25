import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Layout from './components/Layout.jsx'
import ErrorPage from "./pages/ErrorPage.jsx"
import Home from "./pages/Home.jsx"
import PostDetail from "./pages/PostDetail.jsx"
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import UserProfile from "./pages/UserProfile.jsx"
import Authors from "./pages/Authors.jsx"
import CreatePost from "./pages/CreatePost.jsx"
import CategoryPosts from "./pages/CategoryPosts.jsx"
import AuthorPosts from "./pages/AuthorPosts.jsx"
import Dashboard from "./pages/Daschboard.jsx"
import EditPost from "./pages/EditPost.jsx"
import Logout from "./pages/Logout.jsx"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "profile:id", element: <UserProfile /> },
      { path: "authors", element: <Authors /> },
      { path: "create", element: <CreatePost /> },
      { path: "post:categories/:category", element: <CategoryPosts /> },
      { path: "post/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "logout", element: <Logout /> }
    ]

  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
