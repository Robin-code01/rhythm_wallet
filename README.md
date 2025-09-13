# Rhythm Wallet

## Overview

**Rhythm Wallet** is a full-stack web application for managing, organizing, and playing your personal music library. It empowers users to upload, browse, and listen to their music collection directly from the browser, with a focus on high-fidelity, lossless audio and a responsive user interface. The application is built with Django and Django REST Framework on the backend, and React with Chakra UI on the frontend, ensuring a seamless and modern user experience across devices.

---

## Distinctiveness and Complexity

Rhythm Wallet is **not a social network** and **not an e-commerce site**. It is a personal music library manager and player, inspired by desktop music apps but implemented as a web application. There are no user accounts, social feeds, or transactions. The focus is on technical challenges unique to media management: handling binary audio files, extracting and rendering embedded cover art, and delivering uncompromised, lossless playback.

**Distinctiveness:**  
Unlike any CS50W project, Rhythm Wallet’s backend processes FLAC files, extracting both audio metadata and embedded cover art. This involves binary data handling, image processing, and efficient streaming. The user can choose to store cover art in compressed or original quality. The frontend implements a custom audio player with real-time metadata, playlist/album navigation, and a responsive, mobile-friendly UI.

**Complexity:**  
The backend uses multiple related Django models (`Song`, `Artist`, `Album`, `Playlist`) with foreign keys and many-to-many relationships. Cover art is stored as binary data and served via custom endpoints. The backend leverages `mutagen` for audio metadata and `Pillow` for image processing, and exposes a RESTful API using Django REST Framework. The React frontend manages complex state for songs, albums, playlists, and the currently playing track, and uses Chakra UI for a consistent, accessible, and themeable design system. The application serves audio and image assets efficiently, with optimized endpoints for smooth playback and fast image loading.

**Mobile-Responsiveness:**  
The UI is fully responsive, tested on Chrome/Firefox devtools (iPhone, Android, iPad, desktop) and on a physical Android device. Chakra UI’s grid and layout components ensure usability on all devices.

**Summary:**  
Rhythm Wallet is a technically challenging, media-focused web app that goes well beyond the requirements and complexity of any course project. It is not a social network or e-commerce site, and is clearly distinct from all CS50W assignments.

---

## CS50W Requirements Checklist

- **Distinct from course projects:** ✔️ See “Distinctiveness and Complexity” above.
- **Not a social network/e-commerce:** ✔️ Explicitly stated above.
- **Uses Django (with models):** ✔️ See `/backend/music/rhythm_wallet/models.py`.
- **Uses JavaScript on the frontend:** ✔️ React frontend in `/frontend/music/`.
- **Mobile-responsive:** ✔️ Chakra UI, tested on multiple devices.
- **requirements.txt present:** ✔️ See repo root or `/backend/music/requirements.txt`.
- **README with all required sections:** ✔️ This file.
- **API endpoints and documentation:** ✔️ See “API Endpoints” below.
- **How to run, environment, and config:** ✔️ See “How to Run” and “Configuration” below.
- **Tests/demo data:** ✔️ See “Testing and Demo Data” below.

---

## Features

- **Lossless FLAC Audio Playback:** Enjoy your music in its original, uncompressed quality.
- **Automatic Metadata Extraction:** Song title, artist, album, and cover art are extracted from FLAC files and stored in the database.
- **Dynamic Album and Playlist Management:** Browse albums, create and edit playlists, and view detailed song information.
- **Custom Audio Player:** Play, pause, skip, and seek within tracks. The player displays current song metadata and cover art.
- **Responsive Design:** Fully mobile-friendly interface, adapting seamlessly to phones, tablets, and desktops.
- **Chakra UI Powered:** Consistent, accessible, and themeable UI components for a polished user experience.
- **Cover Art Rendering:** Embedded album art is extracted and displayed throughout the app, including in the player and album views. User can choose compressed or original quality.
- **Fast Search and Filtering:** Quickly find songs, albums, or artists with instant search and filter options.
- **Efficient Asset Streaming:** Audio and images are streamed directly from the backend for fast, reliable playback and display.
- **Reproducible Development Environment:** Nix flake ensures all dependencies are pinned and easily reproducible.

---

## File Structure and Contents

- **index.py**: Scans music files, extracts metadata, and populates the Django database.
- **test.py**: Script for testing FLAC metadata extraction.
- **backend/music/**
  - **manage.py**: Django management script.
  - **music/**: Django project settings and configuration.
  - **rhythm_wallet/**: Main Django app containing:
    - **models.py**: Defines `Song`, `Artist`, `Album`, and `Playlist` models.
    - **views.py**: API endpoints for songs, albums, playlists, and cover art.
    - **urls.py**: URL routing for the API.
    - **migrations/**: Database migrations.
    - **admin.py, apps.py, tests.py**: Standard Django files.
- **frontend/music/**
  - **src/**: React source code.
    - **pages/**: Main pages (Dashboard, Albums, Album, Playlists, Playlist, New Playlist).
    - **components/**: Reusable UI components (NavBar, AudioBar, AlbumCard, PlaylistCard).
    - **context/**: React context for audio bar state.
    - **layouts/**: Root layout for routing.
    - **main.jsx, App.jsx**: App entry point and router.
    - **index.css, App.css**: Styling.
  - **public/**: Static assets (cover art, icons, etc.).
  - **package.json**: Frontend dependencies and scripts.
  - **vite.config.js**: Vite configuration.
  - **.env**: API URL configuration.
- **flake.nix**: Nix flake for reproducible development environment (Python, Node.js, dependencies).
- **requirements.txt**: Python dependencies for the backend (repo root or `/backend/music/requirements.txt`).

---

## How to Run

### Prerequisites

- Python 3.12+
- Node.js 18+
- (Recommended) [Nix](https://nixos.org/download.html) for reproducible environment

### Backend

1. Install Python dependencies:
    ```
    pip install -r /backend/music/requirements.txt
    ```
2. Set environment variables (see below).
3. Run migrations:
    ```
    cd backend/music
    python manage.py migrate
    ```
4. Populate the database with your music:
    ```
    python index.py
    ```
   (Place your FLAC files in `frontend/music/public/Media/` before running.)
5. Start the Django server:
    ```
    python manage.py runserver 8080
    ```

### Frontend

1. Install Node dependencies:
    ```
    cd frontend/music
    npm install
    ```
2. Set API base URL in `.env`:
    ```
    VITE_API_URL=http://localhost:8080/api
    ```
3. Start the development server:
    ```
    npm run dev
    ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Using Nix (optional)

If you have Nix installed, you can enter a shell with all dependencies by running:
```
nix develop
```

---

## Configuration and Environment

- **Django settings:** Uses SQLite by default. To use another DB, set `DATABASE_URL` in environment or `settings.py`.
- **SECRET_KEY:** Set `SECRET_KEY` in environment or in `settings.py` for production.
- **DEBUG:** Set `DEBUG=True` for development.
- **Static files:** If deploying, run `python manage.py collectstatic`.
- **Frontend API URL:** Set `VITE_API_URL` in `frontend/music/.env` to match your backend server.

---

## Testing and Demo Data

- **Run backend tests:**
    ```
    cd backend/music
    python manage.py test
    ```
- **Load demo data:**  
  Run `python index.py` after placing a few FLAC files in `frontend/music/public/Media/`.  
  (You may also provide a `fixture.json` and load with `python manage.py loaddata fixture.json`.)

---

## API Endpoints

Minimal list (see `views.py` for full docs):

- **Get all song entries:**  
    ```
    curl http://localhost:8080/api/entries/
    ```
- **Get album details:**  
    ```
    curl http://localhost:8080/api/album/1/
    ```
- **Get cover art:**  
    ```
    curl http://localhost:8080/api/cover_art/1/
    ```
- **List playlists:**  
    ```
    curl http://localhost:8080/api/playlists/
    ```

---

## Screenshots

![Dashboard Screenshot](frontend/music/public/screenshot-dashboard.png)
![Mobile Player Screenshot](frontend/music/public/screenshot-mobile.png)

---

## Additional Information

- The application is designed for personal/local use and does not include user authentication.
- Only FLAC files are tested and supported for metadata extraction and playback.
- Cover art is extracted from FLAC files and served via the Django API.
- The frontend is fully mobile-responsive and tested on various screen sizes (Chrome/Firefox devtools and Android device).
- All API endpoints are documented in [backend/music/rhythm_wallet/views.py](backend/music/rhythm_wallet/views.py).

---

## Credits

- [Django](https://www.djangoproject.com/)
- [React](https://react.dev/)
- [Chakra UI](https://chakra-ui.com/)
- [Mutagen](https://mutagen.readthedocs.io/)
- [Pillow](https://python-pillow.org/)
- [Vite](https://vitejs.dev/)

---

## License

This project is for educational purposes as part of CS50W.