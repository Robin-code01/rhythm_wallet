from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import reverse

from .models import Song, Album, Artist, Playlist
# Create your views here.

@api_view(['GET'])
def entries(request):

    search = request.GET.get("q")

    if search:
        songs = Song.objects.filter(title__icontains=search).values('song_id', 'title', 'artist__name', 'album__title', 'duration', 'release_date', "file_path", "bit_rate", "sample_rate", "bit_depth", "song_number")
    else:
        songs = Song.objects.all().values('song_id', 'title', 'artist__name', 'album__title', 'duration', 'release_date', "file_path", "bit_rate", "sample_rate", "bit_depth", "song_number")
    
    song_list = []

    for song in songs:
        song_list.append({
            'song_id': song.get("song_id"),
            'title': song.get("title"),
            'artist__name': song.get("artist__name"),
            'album__title': song.get("album__title") if song.get("album") else None,
            'duration': song.get("duration"),
            'release_date': song.get("release_date"),
            "bit_rate": song.get("bit_rate"),
            "sample_rate": song.get("sample_rate"),
            "bit_depth": song.get("bit_depth"),
            "song_number": song.get("song_number"),
            "file_path": song.get("file_path").replace("/home/robin/pendrive/src/Music/frontend/music/public", ""),
            'cover_art_url': request.build_absolute_uri(
                reverse('song_cover_art', args=[song.get("song_id")])
            ) if song.get("song_id") else None,
        })

    albums = Album.objects.all().values('album_id', 'title', 'artist__name', 'release_date')

    album_list = []
    for album in albums:
        album_list.append({
            'album_id': album.get("album_id"),
            'title': album.get("title"),
            'artist__name': album.get("artist__name"),
            'release_date': album.get("release_date"),
            'cover_art_url': request.build_absolute_uri(
                reverse('album_art', args=[album.get("album_id")])
            ) if album.get("album_id") else None,
        })        

    artists = Artist.objects.all().values('artist_id', 'name')
    context = {
        'songs': song_list,
        'albums': album_list,
        'artists': artists,
    }

    return Response(context)


@api_view(['GET'])
def song_cover_art(request, song_id):
    try:
        song = Song.objects.get(pk=song_id)
        if song.cover_art and song.cover_art_mime_type:
            return HttpResponse(song.cover_art, content_type=song.cover_art_mime_type)
        else:
            raise Http404("No cover art available")
    except Song.DoesNotExist:
        raise Http404("Song not found")
    

@api_view(['GET'])
def album_art(request, album_id):
    try:
        album = Album.objects.get(pk=album_id)
        if album.cover_art and album.cover_art_mime_type:
            return HttpResponse(album.cover_art, content_type=album.cover_art_mime_type)
        else:
            raise Http404("No cover art available")
    except Album.DoesNotExist:
        raise Http404("Album not found")


@api_view(['GET'])
def album(request, album_id):
    search = request.GET.get("q")
    try:
        album = Album.objects.get(pk=album_id)
        
        if search:
            songs = album.songs.filter(title__icontains=search).values('song_id', 'title', 'artist__name', 'duration', 'release_date', "file_path", "bit_rate", "sample_rate", "bit_depth", "song_number")
        else:
            songs = album.songs.values('song_id', 'title', 'artist__name', 'duration', 'release_date', "file_path", "bit_rate", "sample_rate", "bit_depth", "song_number")
        
        song_list = []
        for song in songs:
            song_list.append({
                'song_id': song.get("song_id"),
                'title': song.get("title"),
                'artist__name': song.get("artist__name"),
                'duration': song.get("duration"),
                'release_date': song.get("release_date"),
                "bit_rate": song.get("bit_rate"),
                "sample_rate": song.get("sample_rate"),
                "bit_depth": song.get("bit_depth"),
                "song_number": song.get("song_number"),
                "file_path": song.get("file_path").replace("/home/robin/pendrive/src/Music/frontend/music/public", ""),
                'cover_art_url': request.build_absolute_uri(
                    reverse('song_cover_art', args=[song.get("song_id")])
                ) if song.get("song_id") else None,
            })

        context = {
            'album_id': album.album_id,
            'title': album.title,
            'artist__name': album.artist.name if album.artist else None,
            'release_date': album.release_date,
            'cover_art_url': request.build_absolute_uri(
                reverse('album_art', args=[album.album_id])
            ) if album.album_id else None,
            'songs': song_list,
        }

        return Response(context)

    except Album.DoesNotExist:
        raise Http404("Album not found")
    

@api_view(["POST"])
def new_playlist(request):
    if request.method == "POST":
        
        data = request.data
        playlist_name = data.get("name", "My Playlist")
        playlist_songs = data.get("songs", [])
        playlist = Playlist.objects.create(
            name=playlist_name,
        )
        playlist.songs.set(Song.objects.filter(song_id__in=playlist_songs).all())
        playlist.save()
        return Response({
            "message": "Playlist created",
            "playlist_id": playlist.playlist_id,
            "name": playlist.name,
            "created_at": playlist.created_at,
        })
        
    else:
        return Response({
            "error": "Use Post method"
        })
    
@api_view(["GET"])
def playlists(request):
    playlists = Playlist.objects.all().values('playlist_id', 'name', 'created_at')
    return Response({"playlists": playlists})

@api_view(['GET'])
def playlist_entries(request, playlist_id):
    
    search = request.GET.get("q")

    try:
        playlist = Playlist.objects.get(pk=playlist_id)
        
        if search:
            songs = playlist.songs.filter(title__icontains=search).values('song_id', 'title', 'artist__name', 'album__title', 'duration', 'release_date', "file_path", "bit_rate", "sample_rate", "bit_depth", "song_number")
        else:
            songs = playlist.songs.values('song_id', 'title', 'artist__name', 'album__title', 'duration', 'release_date', "file_path", "bit_rate", "sample_rate", "bit_depth", "song_number")
        
        song_list = []

        for song in songs:
            song_list.append({
                'song_id': song.get("song_id"),
                'title': song.get("title"),
                'artist__name': song.get("artist__name"),
                'album__title': song.get("album__title") if song.get("album") else None,
                'duration': song.get("duration"),
                'release_date': song.get("release_date"),
                "bit_rate": song.get("bit_rate"),
                "sample_rate": song.get("sample_rate"),
                "bit_depth": song.get("bit_depth"),
                "song_number": song.get("song_number"),
                "file_path": song.get("file_path").replace("/home/robin/pendrive/src/Music/frontend/music/public", ""),
                'cover_art_url': request.build_absolute_uri(
                    reverse('song_cover_art', args=[song.get("song_id")])
                ) if song.get("song_id") else None,
            })

        context = {
            'playlist_id': playlist.playlist_id,
            'name': playlist.name,
            'created_at': playlist.created_at,
            'songs': song_list,
        }

        return Response(context)

    except Playlist.DoesNotExist:
        raise Http404("Playlist not found")