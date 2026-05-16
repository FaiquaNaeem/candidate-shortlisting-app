# Candidate Profile Shortlisting System

A full-stack web application to manage candidate profiles and find the best matches using both basic logic and AI (GPT-4o via OpenRouter).

## Features
- Add candidate profiles with skills, experience, and bio
- View all candidates in a responsive grid
- Basic matching based on exact required skills and minimum experience
- AI shortlisting leveraging GPT-4o to deeply analyze and rank candidates based on complex requirements and holistic skill matches.

## Project Structure
- \`/backend\`: Node.js + Express API, MongoDB database.
- \`/frontend\`: React + Vite SPA with Tailwind CSS.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB instance running (locally or MongoDB Atlas)
- OpenRouter API Key

### Backend Setup
1. Navigate to the backend directory: \`cd candidate-app/backend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file in the \`backend\` directory based on \`.env.example\`:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/candidate_db
   OPENROUTER_API_KEY=your_openrouter_api_key
   PORT=5000
   \`\`\`
4. Start the backend server: \`npm start\`

### Frontend Setup
1. Navigate to the frontend directory: \`cd candidate-app/frontend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file in the \`frontend\` directory based on \`.env.example\`:
   \`\`\`env
   VITE_API_URL=http://localhost:5000
   \`\`\`
4. Start the frontend development server: \`npm run dev\`

## Deployment
- **Backend:** Can be deployed to services like Render, Heroku, or Railway. Ensure to set environment variables on the platform.
- **Frontend:** Can be deployed to Vercel. A \`vercel.json\` file is included to handle SPA routing rewrites.
