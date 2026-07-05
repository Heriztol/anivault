import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import AnimeDetails from './pages/AnimeDetails.jsx'
import Seasonal from './pages/Seasonal.jsx'
import Browse from './pages/Browse.jsx'
import MyList from './pages/MyList.jsx'
import Manga from './pages/Manga.jsx'
import MangaDetails from './pages/MangaDetails.jsx'
import Rankings from './pages/Rankings.jsx'
import Characters from './pages/Characters.jsx'
import CharacterDetails from './pages/CharacterDetails.jsx'
import News from './pages/News.jsx'
import Reviews from './pages/Reviews.jsx'
import Community from './pages/Community.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import More from './pages/More.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/seasonal" element={<Seasonal />} />
        <Route path="/browse/anime" element={<Browse />} />
        <Route path="/mylist" element={<MyList />} />
        <Route path="/manga" element={<Manga />} />
        <Route path="/manga/:id" element={<MangaDetails />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/:id" element={<CharacterDetails />} />
        <Route path="/news" element={<News />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/more" element={<More />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
