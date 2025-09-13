import Navbar from "../components/NavBar"
// import AudioBar from "../components/AudioBar"
import { Heading, Spacer, Flex, Box, VStack, SimpleGrid, Field, Input, Button, HStack, Checkbox } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getSongs({state, setState}) {
    fetch(`${API}/entries/`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.songs);

        let name_sort_songs = data.songs.sort((a, b) => a.title.localeCompare(b.title));

        setState((prevState) => ({
            ...prevState,
            songs: name_sort_songs,
        }));
    })
}

function createPlaylist({state, setState}) {
    fetch(`${API}/playlist/new/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        // credentials: "include",
        body: JSON.stringify({
            name: state.name,
            songs: state.selectedSongs,
        })
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

export default function New_playlist() {
  const navigate = useNavigate();
    const [state, setState] = useState({
        name: "My Playlist",
        songs: [],
        selectedSongs: [],
    });

    useEffect(() => {
        getSongs({state, setState})
    }, [])

    useEffect(() => { // Debug
        console.log(state.selectedSongs)
    }, [state.selectedSongs])

    return(
        <>
            <Navbar/>
            <Box height={"60px"} color={"white"}>Bobby</Box>
            <Heading textAlign={"center"} fontSize={"49px"} paddingBottom={"40px"} paddingTop={"20px"}>New Playlist</Heading>
            <Box padding={"20px"} border={"1px solid grey"} borderRadius={"8px"} maxWidth={"700px"} margin={"auto"}>
                <Form onSubmit={(event) => {
                    event.preventDefault();
                    console.log(event.currentTarget.elements);
                    createPlaylist({state, setState})
                    navigate("/playlists");
                }}>
                    <Field.Root required>
                        <Field.Label>New Playlist Name</Field.Label>
                        <HStack width="100%" align={"center"}>
                            <Input placeholder="My Playlist"
                                onChange={(event) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        name: event.target.value,
                                    }))
                                }}
                            />
                            <Button type="submit" variant={"solid"} mt={3} marginBottom={"12px"}>Create</Button>
                        </HStack>
                    </Field.Root>
                    {state.songs.map((song) => (
                        <Checkbox.Root mt={3} value={song.song_id} key={song.song_id} width={"100%"}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setState((prevState) => ({
                                    ...prevState,
                                    selectedSongs: [...prevState.selectedSongs, song.song_id],
                                }));
                            } else {
                                setState((prevState) => ({
                                    ...prevState,
                                    selectedSongs: prevState.selectedSongs.filter((s) => s.song_id !== song.song_id),
                                }));
                            }
                        }}
                        >
                            <Checkbox.HiddenInput/>
                            <Checkbox.Control/>
                            <Checkbox.Label>{song.title} - {song.artist__name}</Checkbox.Label>
                        </Checkbox.Root> 
                    ))}

                </Form>
            </Box>
        </>
    )
}