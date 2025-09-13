import {Heading, Flex, Box} from '@chakra-ui/react'
import { Input, InputGroup, Kbd } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { useRef, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

export default function NavBar({search, setSearch}) {
  const inputRef = useRef(null)

  const navigate = useNavigate();

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
    >
      <Heading fontSize="1.2em" onClick={() => navigate("/")} paddingX={"10px"}>Dashboard</Heading>
      <Heading fontSize="1.2em" paddingX={"10px"} onClick={() => navigate("/albums/")}>Albums</Heading>
      <Heading fontSize="1.2em" paddingX={"10px"} onClick={() => navigate("/playlists/")}>Playlists</Heading>
      {/* <Box minW={"150px"} flexGrow={2} bgColor={'purple.300'}>search bar</Box> */}
      <InputGroup flex="1" startElement={<LuSearch />} endElement={<Kbd>Ctrl+K</Kbd>}>
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