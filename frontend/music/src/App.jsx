import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

// layouts and pages
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard'
import Albums from './pages/Albums'
import Album from './pages/Album'
import Playlists from './pages/Playlists'
import New_playlist from "./pages/New_playlist"
import Edit_playlist from "./pages/Edit_playlist"
import Playlist from "./pages/Playlist"


// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="albums/" element={<Albums />} />
      <Route path="albums/:album_id" element={<Album />} />
      <Route path="playlists/" element={<Playlists />} />
      <Route path="playlists/new" element={<New_playlist />} />
      <Route path="playlists/edit/:playlist_id" element={<Edit_playlist />} />
      <Route path="playlists/:playlist_id" element={<Playlist />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App