from django.urls import path
from . import views


urlpatterns = [
    path("entries/", views.entries, name="entries"),
    path('cover_art/<int:song_id>/', views.song_cover_art, name='song_cover_art'),
    path("album_art/<int:album_id>/", views.album_art, name="album_art"),
    path("album/<int:album_id>/", views.album, name="album"),
    path("playlist/new/", views.new_playlist, name="new_playlist"),
    path("playlist/edit/", views.edit_playlist, name="edit_playlist"),
    path("playlists/", views.playlists, name="playlists"),
    path("entries/playlist/<int:playlist_id>/", views.playlist_entries, name="playlist_entries"),
]