import Navbar from "../components/NavBar"
import AudioBar from "../components/AudioBar"
import {Heading, Spacer, Flex, Box, VStack, SimpleGrid} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL


function getEntries({state, setState}, search) {

  fetch(`${API}/entries/?q=${search}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.songs);
      // data.songs.forEach((song) => {
      //   setState((prevState) => ({
      //     ...prevState,
      //     songs: [...prevState.songs, song],
      //   }))
      // })

      let name_sort_songs = data.songs.sort((a, b) => a.title.localeCompare(b.title));

      setState((prevState) => ({
        ...prevState,
        songs: name_sort_songs,
        albums: data.albums,
        artists: data.artists,
      }));
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

// function playSong(song_id, setState) {
//   setState((prevState) => ({
//     ...prevState,
//     current_song: song_id,
//   }))
// }

export default function Albums() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    songs: [],
    albums: [],
    artists: [],
    current_song: null,
  })

  const [search, setSearch] = useState("")

  useEffect(() => {
    getEntries({state, setState}, search)
  }, [])

  useEffect(() => {
    // console.log(state)
  }, [state])

  useEffect(() => {
    // console.log(search)
    getEntries({state, setState}, search)
  }, [search])

  return (
    <>
        <Navbar search={search} setSearch={setSearch} />
        <Box paddingTop={"60px"} paddingBottom={"64px"}>
          {/* <VStack spacing={4} align="stretch" padding={4}>
            <Heading>Albums</Heading>
            <Box>
              {state.albums.length === 0 ? (
                <Box>No albums found.</Box>
              ) : (
                state.albums.map((album) => (
                  <Box key={album.album_id} borderWidth="1px" borderRadius="lg" overflow="hidden" padding={4} marginBottom={4}>
                    <Heading size="md">{album.title}</Heading>
                    <Box>Artist: {album["artist__name"]}</Box>
                    <Box>Year: {album.year}</Box>
                    <Box>Number of Songs: {album.num_songs}</Box>
                  </Box>
                ))
              )}
            </Box>
          </VStack> */}
          <SimpleGrid gap={10} minChildWidth={"256px"} paddingX={"10px"}>
            {state.albums.length === 0 ? (
              <Box>No albums found.</Box>
            ) : (
              state.albums.map((album) => (
                <Box
                  position="relative"
                  height={"200px"}
                  key={album.album_id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  padding={4}
                  backgroundImage={album.cover_art_url ? (`url(${album.cover_art_url})`) : (null)}
                  backgroundSize={"cover"}
                  backgroundPosition={"center"}
                  color={"teal.100"}
                  _hover={{ cursor: 'pointer', boxShadow: '0 0 14px rgba(0, 0, 0, 1)' }}
                  onClick={() => navigate(`/albums/${album.album_id}`)}
                >
                  {/* Overlay for blur */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.2)"
                    backdropFilter="blur(5px)"
                    zIndex={1}
                  />
                  {/* Content */}
                  <Box position="relative" zIndex={2}>
                    <Heading size="md">{album.title}</Heading>
                    <Box>Artist: {album["artist__name"]}</Box>
                    <Box>Year: {album["release_date"]}</Box>
                  </Box>
                </Box>
              ))
            )}
          </SimpleGrid>
        </Box>
        <AudioBar currentSong={state.songs.find((song) => song.song_id == state.current_song)} state={state} setState={setState} />
    </>
  )
}