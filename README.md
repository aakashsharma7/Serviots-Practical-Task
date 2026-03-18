# Pet Adoption Management System (MERN)

A full-stack, responsive web application connecting loving families with pets in need of a home. Built completely on the MERN stack featuring role-based dashboards, secure authentication, modern UI micro-interactions, and high-performance database queries.

## 🚀 Features

### 👤 For Visitors & Adopters
- **Browse & Filter**: View all available pets and filter them instantly by species, size, and status.
- **Search System**: Find specific pets by looking up their exact name or breed.
- **Detailed Profiles**: View photos, descriptions, medical history (vaccinated/neutered), and traits for each animal.
- **Secure Authentication**: Register and log in using JWT-secured endpoints.
- **Adoption Applications**: Submit a personalized adoption application for your favorite available pet.
- **User Dashboard**: Track the real-time status of all your adoption applications (Pending, Approved, Rejected) and read direct feedback notes left by administrators.

### 🛡️ For Administrators
- **Admin Dashboard**: Gain a bird's-eye view over all incoming applications across the platform.
- **Application Processing**: Approve or reject user applications. Approving an application will dynamically switch the Pet's status to "Adopted" and instantly decline all other competing applications for that same pet.
- **Pet Management (CRUD)**: Create new pet profiles, upload their photos, update medical records/status, or remove them securely from the database.

## 🛠️ Technology Stack

**Frontend**
- **React (Vite ⚡)**: Lightning-fast frontend tooling and lazy-loaded component rendering (`React.lazy`).
- **Tailwind CSS**: Utility-first framework powering the premium dark-mode aesthetic and custom CSS micro-animations.
- **React Router v6**: Dynamic client-side routing, protected layout boundaries, and Admin-only routes.
- **Axios**: Promised-based HTTP client handling strict interceptors and authorization headers.

**Backend**
- **Node.js & Express**: Secure, scalable REST API architecture built on MVC principles.
- **MongoDB & Mongoose**: NoSQL document database highly optimized with `.lean()` queries for blazing-fast data serialization.
- **JWT (JSON Web Tokens)**: Stateless and secure user authorization and password hashing (`bcryptjs`).
- **Multer**: Multipart/form-data middleware handling seamless image uploads.

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Cluster URL

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aakashsharma7/Serviots-Practical-Task.git
cd Serviots-Practical-Task
```

2. **Backend Setup**
```bash
cd backend
npm install
# Create a .env file based on backend/.env.example
npm run seed  # Safely seed the database with admin accounts and 20 sample pets
npm run dev   # Start the Express server (defaults to port 5000)
```

3. **Frontend Setup**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev   # Start the React Vite server (defaults to port 5173)
```
