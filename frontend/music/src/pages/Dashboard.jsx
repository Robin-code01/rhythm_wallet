import {Heading, Spacer, Flex, Box, VStack} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import clock from '../assets/clock.svg';
import calendar from '../assets/calendar.svg';
import Navbar from "../components/NavBar"
import AudioBar from "../components/AudioBar"


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

function playSong(song_id, setState) {
  setState((prevState) => ({
    ...prevState,
    current_song: song_id,
  }))
}

export default function Create() {
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

useEffect(() => { // Debug
  const currentSong = state.songs.find((song) => song.song_id == state.current_song);
  if (currentSong) {
    // console.log("Current song changed to:", currentSong.title, currentSong.file_path);
  }
}, [state.current_song]);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} top={0} />      
      <Box height={"60px"} color={"white"}>NavBar Gap</Box>
      {state.songs.map((song) => (
        <Box key={song.song_id} border={"2px solid black"} borderRadius="4px" p={"4px"} mx={"10px"} my={"5px"} onClick={() => playSong(song.song_id, setState)} _hover={{ bg: 'blue.900', color: 'white', cursor: 'pointer' }} transition="background-color 0.2s ease-in-out, color 0.2s ease-in-out">
          <Flex direction="row" textAlign="center" gap="10px">
            <Box height="60px" width="60px" flexShrink={0} overflow="hidden">
                {song.cover_art_url ? (
                  <img src={song.cover_art_url} alt={`${song.title} cover`} style={{height: "60px", borderRadius: "4px"}} />
                ) : (
                  <div style={{height: "60px", width: "60px", background: "#eee"}} />
                )}
            </Box>
            <VStack gap={0} alignItems={"left"}>
              <Heading as="h2" textAlign={"left"} fontSize={"xl"}>{song.title}</Heading>
              <Box textAlign={"left"} fontSize={"small"}>{song.artist__name}</Box>
            </VStack>
            <Spacer />
            <Flex align={"center"} gap="10px" fontSize={"sm"}>
            <Box fontWeight="bold">{song.album__title}</Box>
            <Box display={"flex"} alignItems="center" gap="5px">
              <img src={calendar} height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"/>
              : {song.release_date}</Box>
            <Box display="flex" alignItems="center" gap="5px">
              <img src={clock} height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"/>
              : {song.duration} seconds</Box>
            </Flex>
          </Flex>
        </Box>
      ))}
      <AudioBar currentSong={state.songs.find((song) => song.song_id == state.current_song)} state={state} setState={setState}/>
      <Box height={"64px"} color={"white"}>AudioBar Gap</Box>
    </>
  )
}