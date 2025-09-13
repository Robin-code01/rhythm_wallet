import {Heading, Flex, Box, useBreakpointValue} from '@chakra-ui/react'
import { Input, InputGroup, Kbd } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { useRef, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

export default function NavBar({search, setSearch}) {
  const inputRef = useRef(null)

  const navigate = useNavigate();

  const showKbd = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Flex
      as="nav"
      bg="grey.200"
      justify={'space-between'}
      gap={2}
      wrap={"wrap"}
      padding={"10px"}
      alignItems="center"
      position={"fixed"}
      width={"100%"}
      background={"white"}
      top="0"
      zIndex={1000}
      sx={{
        flexDirection: ["column", null, null, null, "row"], // fallback for breakpoints
        '@media (min-width: 400px)': {
          flexDirection: "row"
        }
      }}
    >
      <Heading fontSize="1.2em" onClick={() => navigate("/")} margin={"auto"}>Dashboard</Heading>
      <Heading fontSize="1.2em" margin={"auto"} onClick={() => navigate("/albums/")}>Albums</Heading>
      <Heading fontSize="1.2em" margin={"auto"} onClick={() => navigate("/playlists/")}>Playlists</Heading>
      {/* <Box minW={"150px"} flexGrow={2} bgColor={'purple.300'}>search bar</Box> */}
      <InputGroup flex="1" startElement={<LuSearch />} endElement={showKbd ? <Kbd>Ctrl+K</Kbd> : undefined}>
        <Input
          ref={inputRef}
          bgColor={"green.200"}
          placeholder="Search Music"
          id="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </InputGroup>
    </Flex>
  )
}