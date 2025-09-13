import os, sys
from pathlib import Path
from django.db import connection


def bob(project_root: str, settings_module: str):
    """
    project_root: absolute path to your Django project root (folder with manage.py)
    settings_module: dotted path to settings, e.g. 'myproject.settings'
    """
    root = Path(project_root).resolve()
    sys.path.insert(0, str(root))                   # so imports like 'myproject' work
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)
    import django
    django.setup()


from mutagen.flac import FLAC
import pathlib

bob("/home/robin/pendrive/src/Music/backend/music", "music.settings")

from rhythm_wallet.models import Song, Artist, Album, Playlist


# path = "frontend/music/public/Media/Vol_alpha/01. C418 - Key.flac"

# audio = FLAC(path)
# print(audio.pprint())
# print("--------------------------------")
# print(audio.info.bitrate)
# print(audio.info.length)
# print(audio.info.sample_rate)
# print(audio.info.channels)
# print(audio.info.bits_per_sample)
# # print(audio.info.total_samples)
# # print(audio.info.pprint())
print("This will delete all existing songs, artists, and albums in the database.")
print("------------------------------------------------")
print("do you want the cover art for all the songs to be compressed or uncompressed?:\n (0) Compressed (smaller size, lower quality)\n (1) Uncompressed (larger size, higher quality)")
user_chouce = input("Enter 0 or 1: ")

if user_chouce not in ['0', '1']:
    print("Invalid choice. Please enter 0 or 1.")
    sys.exit(1)

if user_chouce == '0':
    print("You chose compressed cover art.")
    from PIL import Image
    def compress_image(image_data, mime_type, quality=70, max_size=(700, 700)):
        from io import BytesIO
        image = Image.open(BytesIO(image_data))
        image = image.convert("RGB")  # Ensure compatibility
        image.thumbnail(max_size, Image.LANCZOS)  # Resize while maintaining aspect ratio
        output = BytesIO()
        image.save(output, format="JPEG", quality=quality, optimize=True)
        return output.getvalue()
Song.objects.all().delete()
Artist.objects.all().delete()
Album.objects.all().delete()
Playlist.objects.all().delete()

# Reset auto-increment counters for rhythm_wallet tables
with connection.cursor() as cursor:
    for table in ["rhythm_wallet_song", "rhythm_wallet_artist", "rhythm_wallet_album"]:
        cursor.execute(f"UPDATE sqlite_sequence SET seq = 0 WHERE name = '{table}'")

for p in pathlib.Path(".").rglob("*.flac"):
    audio = FLAC(p)
    print(p)

    cover_data = None
    cover_mime = None

    for pic in audio.pictures:
        if pic.type == 3:  # 3 = front cover
            # cover_data = pic.data      # <- raw binary image data
            # cover_mime = pic.mime      # e.g. "image/jpeg" or "image/png"
            if user_chouce == '0':
                cover_data = compress_image(pic.data, pic.mime)
            else:
                cover_data = pic.data
            cover_mime = pic.mime
            break

    for a in audio["artist"]:
        Artist.objects.get_or_create(name=a)

    for i in audio["albumartist"]:
        print(Artist.objects.get_or_create(name=i))

    artist_id = (
        Artist.objects
        .filter(name=audio["albumartist"][0])
        .values_list("artist_id", flat=True)
        .first()
    )

    if Album.objects.filter(title=audio["album"][0], artist=artist_id).count() == 0:
        Album.objects.create(
            title=audio["album"][0],
            artist=Artist.objects.get(artist_id=artist_id),
            cover_art=cover_data,
            cover_art_mime_type=cover_mime,
            release_date=audio["date"][0],
        )

    Song.objects.create(
        title=audio.get("title", ["Unknown Title"])[0],
        artist=Artist.objects.get_or_create(name=audio.get("artist", ["Unknown Artist"])[0])[0],
        album=Album.objects.get_or_create(title=audio.get("album", ["Unknown Album"])[0], artist=Artist.objects.get_or_create(name=audio.get("artist", ["Unknown Artist"])[0])[0])[0],
        genre=audio.get("genre", [None]),
        release_date=audio["date"][0],
        song_number=int(audio.get("tracknumber", [0])[0].split("/")[0]) if audio.get("tracknumber") else None,
        duration=int(audio.info.length),
        file_path=str(p.resolve()),
        cover_art=cover_data,
        cover_art_mime_type=cover_mime,
        lyrics=audio.get("lyrics", [None])[0],
        bit_rate=float(int(audio.info.bitrate) / 1000.0),  # Convert to kbps
        sample_rate=audio.info.sample_rate,
        bit_depth=audio.info.bits_per_sample,
    )