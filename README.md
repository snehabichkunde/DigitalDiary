# Digital Diary

A personal diary application where users can write, manage, and categorize their thoughts, memories, and notes.

## Features
- Create, edit, and delete diary entries
- Categorize entries with tags (e.g., Personal, Motivational, Travel, etc.)
- Save drafts for later editing
- Secure authentication and user-specific data storage
- View all published entries

## Technologies Used
### Frontend:
- React.js
- Vite
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose for ODM)
- JSON Web Tokens (JWT) for authentication

## Installation & Usage

### Prerequisites
Ensure you have the following installed:
- Node.js & npm
- MongoDB (local or cloud-based like MongoDB Atlas)

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up a `.env` file in the `server` directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

### Running the Application
Once both the frontend and backend are running, you can access the application in your browser at:
```
http://localhost:5173  (or the port specified by Vite)
```

## API Endpoints
### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive a JWT token

### Stories
- `POST /stories/add` - Add a new diary entry
- `GET /stories/all` - Get all user stories (only non-drafts)
- `GET /stories/draft` - Get all draft stories
- `PUT /stories/:id` - Update a specific story
- `DELETE /stories/:id` - Delete a story

## Future Enhancements
- Rich text editor for entries
- Image uploads for diary entries
- Mobile app version

## License
This project is licensed under the MIT License.

## Contributors
- **Sneha Bichkunde** ([@snehabichkunde](https://github.com/snehabichkunde))

