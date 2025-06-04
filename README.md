# Simple Social Media Fullstack App

A basic fullstack social media application that allows users to register, log in, view posts, follow/unfollow users, and comment — built using React (frontend), Express + Passport.js (backend), and MySQL (database).

## Features

- **User Registration & Login**
  - Secure session-based authentication using Passport.js
  - New user registration form with validation

- **Posts Feed**
  - Displays all posts from various users
  - Each post contains a title, description, and a unique dummy image (via `picsum.photos`)
  - Associated user details and comments fetched from the backend

- **Follow/Unfollow System**
  - Ability to follow or unfollow users
  - Updated state shown instantly on the frontend

- **Comments Section**
  - View all comments related to each post
  - Dynamically loaded from the backend

- **Error Handling**
  - Decent error prevention implemented across backend routes
  - Secure session management

## 🧰 Tech Stack

| Layer        | Technology     |
|--------------|----------------|
| Frontend     | React.js       |
| Backend      | Express.js     |
| Auth         | Passport.js    |
| Database     | MySQL          |
| Styling      | Tailwind CSS   |
