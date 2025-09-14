import Navbar from "../components/NavBar"
import AudioBar from "../components/AudioBar"
import {Heading, Spacer, Flex, Box, VStack, SimpleGrid, Button} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;


function getPlaylists({state, setState}) {
  fetch(`${API}/playlists/`)
    .then((result) => result.json())
    .then((data) => {
      setState((prevState) => {
        return {
          ...prevState,
          playlists: data.playlists,
        }
      })
    })
}

// function playSong(song_id, setState) {
//   setState((prevState) => ({
//     ...prevState,
//     current_song: song_id,
//   }))
// }
function deletePlaylist(playlist, {state, setState, navigate}) {
  if (!window.confirm(`Are you sure you want to delete the playlist "${playlist.name}"? This action cannot be undone.`)) {
    return;
  }
  fetch(`${API}/entries/playlist/${playlist.playlist_id}/`, {
    method: "DELETE",
  })
    .then((result) => {
      if (result.ok) {
        // Remove the deleted playlist from state
        console.log(result.message); //DEBUG
        setState((prevState) => ({
          ...prevState,
          playlists: prevState.playlists.filter((p) => p.playlist_id !== playlist.playlist_id),
        }));
        // Navigate to /playlists after deletion
        navigate("/playlists/");
      } else {
        console.error("Failed to delete playlist");
      }
  })
    .catch((error) => {
      console.error("Error deleting playlist:", error);
    });
}

export default function Albums() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    songs: [],
    albums: [],
    artists: [],
    current_song: null,
    playlists: [],
  })

  useEffect(() => {
    getPlaylists({state, setState})
  }, [])

  useEffect(() => {
    // console.log(state)
  }, [state])

  return (
    <>
        <Navbar />
        <Box paddingTop={"60px"} paddingBottom={"64px"}>
          <SimpleGrid gap={10} minChildWidth={"256px"} paddingX={"10px"}>
            <Box
              position="relative"
              height={"200px"}
              // key={}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding={4}
              backgroundColor={"black"}
              color={"teal.100"}
              _hover={{ cursor: 'pointer', boxShadow: '0 0 14px rgba(0, 0, 0, 1)' }}
              onClick={() => {navigate("/playlists/new/")}}
            >
              {/* Overlay for blur
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0,0,0,0.2)"
                backdropFilter="blur(5px)"
                zIndex={1}
              /> */}
              {/* Content */}
              <Box position="relative" zIndex={2}>
                <Heading size="xl">Create New Playlist</Heading>
                <Box>Click to add a new playlist.</Box>
              </Box>
            </Box>

            {state.playlists.map((playlist) => (
            <Box
              position="relative"
              height={"200px"}
              key={playlist.playlist_id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding={4}
              backgroundColor={"black"}
              color={"teal.100"}
              _hover={{ cursor: 'pointer', boxShadow: '0 0 14px rgba(0, 0, 0, 1)' }}
              onClick={() => {navigate(`/playlists/${playlist.playlist_id}/`)}}
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
                <Heading size="xl">{playlist.name}</Heading>
                <Box>Created at: {new Date(playlist.created_at).toLocaleDateString()}</Box>
              </Box>
              <Box position="absolute" bottom={2} right={4} zIndex={2} fontSize="sm" color="gray.400">
                <Button bgColor={"white"} color={"black"} marginRight={"10px"} onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deletePlaylist(playlist, {state, setState, navigate});
                }}>Delete</Button>
                <Button bgColor={"white"} color={"black"} onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/playlists/edit/${playlist.playlist_id}`);
                }}>Edit</Button>
              </Box>
            </Box>
            ))}
          </SimpleGrid>
        </Box>
    </>
  )
}