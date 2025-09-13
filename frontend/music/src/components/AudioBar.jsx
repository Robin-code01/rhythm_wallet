import { Box, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

function NextSong(currentSong, state, setState) {
    if (currentSong && state.songs.length > 0) {
        let currentIndex = state.songs.findIndex((song) => song.song_id === currentSong.song_id);
        let nextIndex = (currentIndex + 1) % state.songs.length;
        setState((prevState) => ({
            ...prevState,
            current_song: state.songs[nextIndex].song_id,
        }));
        // console.log("Next song:", currentSong);
    }
}

function PrevSong(currentSong, state, setState) {
    if (currentSong && state.songs.length > 0) {
        let currentIndex = state.songs.findIndex((song) => song.song_id === currentSong.song_id);
        let prevIndex = (currentIndex - 1 + state.songs.length) % state.songs.length;
        setState((prevState) => ({
            ...prevState,
            current_song: state.songs[prevIndex].song_id,
        }));
        // console.log("Previous song:", currentSong);
    }
}

export default function AudioBar ({currentSong, state, setState}) {
    const audioRef = useRef(null);
    useEffect(() => {
        // console.log("AudioBar received currentSong:", currentSong);

        if (audioRef.current) {
            audioRef.current.load(); // Reload the audio element with the new source
            audioRef.current.play().catch((error) => {
                console.warn("Error playing audio:", error);
            });;
        }
    }, [currentSong])

    return (
        <Flex
            position={"fixed"}
            bottom={0}
            left={0}
            width={"100%"}
            height={"64px"}
        >
            <VStack style={{ width: "100%", height: "100", backdropFilter: "blur(5px)"}} >
                <Box style={{ width: "100%", textAlign: "center", fontSize: "14px", fontWeight: "bold"}} >
                    <HStack justifyContent={"center"} alignItems={"center"} >
                        <Box onClick={() => PrevSong(currentSong, state, setState)}>|◀</Box>
                        <Box>{currentSong ? (currentSong.title) : ("No song selected")}</Box>
                        <Box>{currentSong ? (`- ${currentSong["artist__name"]}`) : ("")}</Box>
                        <Box>{currentSong ? (`| ${currentSong["bit_rate"]} Kbps`) : ("")}</Box>
                        <Box>{currentSong ? (`${currentSong["bit_depth"]} Bit`) : ("")}</Box>
                        <Box>{currentSong ? (`${currentSong["sample_rate"]} Hz`) : ("")}</Box>
                        <Box onClick={() => NextSong(currentSong, state, setState)}>▶|</Box>
                    </HStack>
                </Box>
                <audio ref={audioRef} type="audio/flac" controls style={{ width: "100%" }} src={currentSong ? (currentSong.file_path) : (null)} onEnded={() => NextSong(currentSong, state, setState)}></audio>
            </VStack>
        </Flex>
        
    )
}