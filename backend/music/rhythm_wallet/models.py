from django.db import models

# Create your models here.

class Song(models.Model):
    song_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=2000)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE, related_name='songs')
    album = models.ForeignKey('Album', on_delete=models.CASCADE, related_name='songs', blank=True, null=True, default=None)
    genre = models.CharField(max_length=1000, blank=True, null=True, default=None)
    release_date = models.DateField(blank=True, null=True, default=None)
    song_number = models.IntegerField(blank=True, null=True, default=None)
    duration = models.FloatField()  # Duration in seconds
    file_path = models.CharField(max_length=5000)
    cover_art = models.BinaryField(blank=True, null=True, default=None)
    cover_art_mime_type = models.CharField(max_length=100, blank=True, null=True, default=None)
    lyrics = models.TextField(blank=True, null=True, default=None)
    bit_rate = models.FloatField(blank=True, null=True, default=None)  # in kbps
    sample_rate = models.FloatField(blank=True, null=True, default=None)  # in Hz
    bit_depth = models.IntegerField(blank=True, null=True, default=None)  # in bits

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Artist(models.Model):
    artist_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=2000)

    def __str__(self):
        return self.name
    
class Album(models.Model):
    album_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=2000)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE, related_name='albums')
    release_date = models.DateField(blank=True, null=True, default=None)
    cover_art = models.BinaryField(blank=True, null=True, default=None)
    cover_art_mime_type = models.CharField(max_length=100, blank=True, null=True, default=None)

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Playlist(models.Model):
    playlist_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    songs = models.ManyToManyField(Song, related_name='playlists', blank=True)

    def __str__(self):
        return self.name