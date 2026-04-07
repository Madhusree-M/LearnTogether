import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomeLayout from './layouts/HomeLayout.jsx'
import QuestionsFeed from './components/QuestionsFeed.jsx'
import PostQuestionForm from './components/PostQuestionForm.jsx'
import MaterialsFeed from './components/MaterialsFeed.jsx'
import PostMaterialForm from './components/PostMaterialForm.jsx'
import { ToastContainer } from 'react-toastify'
import ProfilePage from './components/ProfilePage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AboutPage from './components/AboutPage.jsx'
import AuthPage from './components/AuthPage.jsx'
import SearchPage from './components/SearchPage.jsx'
import PopularPage from './components/PopularPage.jsx'
import ExplorePage from './components/ExplorePage.jsx'
import LeaderboardPage from './components/LeaderboardPage.jsx'
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path='/' element={<App />} />
          <Route path='/questions' element={<QuestionsFeed />} />
          <Route path='/post-question' element={
            <ProtectedRoute>
              <PostQuestionForm />
            </ProtectedRoute>
          } />
          <Route path='/materials' element={<MaterialsFeed />} />

          <Route path='/post-material' element={
            <ProtectedRoute>
              <PostMaterialForm />
            </ProtectedRoute>
          } />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/popular' element={<PopularPage />} />
          <Route path='/explore' element={<ExplorePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
        </Route>
        <Route path='/login' element={<AuthPage />} />
        <Route path='/signup' element={<AuthPage />} />

      </Routes>
    </BrowserRouter>
  </>
)



// src/
// │
// ├── components/
// │   ├── layout/
// │   │   ├── Navbar.jsx
// │   │   ├── Footer.jsx
// │   │   └── Layout.jsx
// │   │
// │   ├── auth/
// │   │   ├── Login.jsx
// │   │   └── Register.jsx
// │   │
// │   ├── questions/
// │   │   ├── QuestionFeed.jsx
// │   │   ├── QuestionCard.jsx
// │   │   ├── AskQuestion.jsx
// │   │   ├── QuestionDetails.jsx
// │   │   └── Comment.jsx
// │   │
// │   ├── notes/
// │   │   ├── NotesPage.jsx
// │   │   ├── NoteCard.jsx
// │   │   └── UploadNote.jsx
// │   │
// │   └── common/
// │       ├── Button.jsx
// │       ├── Input.jsx
// │       ├── Loader.jsx
// │       └── EmptyState.jsx
// │
// ├── pages/
// │   ├── Home.jsx
// │   ├── Notes.jsx
// │   ├── LoginPage.jsx
// │   └── RegisterPage.jsx
// │
// ├── services/
// │   ├── api.js
// │
// ├── App.jsx
// └── main.jsx
