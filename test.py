from mutagen.flac import FLAC
path = "frontend/music/public/Media/Vol_alpha/01. C418 - Key.flac"

audio = FLAC(path)
print(audio.pprint())
print("--------------------------------")
print(audio.info.bitrate)
print(audio.info.length)
print(audio.info.sample_rate)
print(audio.info.channels)
print(audio.info.bits_per_sample)
print(audio["date"][0])
# print(audio.info.total_samples)
# print(audio.info.pprint())