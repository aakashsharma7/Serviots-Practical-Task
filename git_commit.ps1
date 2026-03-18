git update-ref -d HEAD
git reset

git add package.json README.md .gitignore
git commit -m "chore: init config"

git add backend/models/
git commit -m "feat(models): implement User, Pet, and Application schemas"

git add backend/config/ backend/.env.example
git commit -m "feat(config): add db connection and env setup"

git add backend/middleware/
git commit -m "feat(middleware): add auth, admin, and error handlers"

git add backend/routes/
git commit -m "feat(routes): configure API router endpoints"

git add backend/controllers/authController.js backend/controllers/petController.js
git commit -m "feat(controllers): implement auth and pet logic"

git add backend/controllers/applicationController.js
git commit -m "feat(controllers): implement application logic"

git add backend/server.js
git commit -m "feat(server): setup and configure Express app"

git add backend/seed.js
git commit -m "feat(seed): add database seeder script"

git add frontend/package.json frontend/tailwind.config.js frontend/index.html frontend/vite.config.js frontend/postcss.config.js frontend/src/index.css frontend/src/App.css frontend/src/main.jsx frontend/.gitignore
git commit -m "chore(frontend): initialize Vite React app with Tailwind"

git add frontend/src/context/
git commit -m "feat(context): add AuthContext Provider"

git add frontend/src/api/
git commit -m "feat(api): create axios api service layers"

git add frontend/src/components/
git commit -m "feat(components): build reusable UI components"

git add frontend/src/pages/Home.jsx frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx frontend/src/pages/PetDetail.jsx
git commit -m "feat(pages): implement auth and public home pages"

git add frontend/src/pages/UserDashboard.jsx frontend/src/pages/AdminDashboard.jsx frontend/src/pages/AdminPets.jsx frontend/src/pages/AdminPetForm.jsx
git commit -m "feat(dashboard): build user and admin dashboards"

git add .
git commit -m "chore: add remaining assets and misc files"

git push -f -u origin main
