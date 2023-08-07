import { Center, Text } from "@chakra-ui/react";

const ChatMessage = ({ chat, currentUserId }) => {
  return (
    <Center
      justifyContent={chat.userId === currentUserId ? "end" : "start"}
      w="100%"
    >
      <Center
        background={chat.userId === currentUserId ? "purple.700" : "yellow.200"}
        rounded="6px"
        px="2"
        py="1"
        position="relative"
      >
        <Text
          position="absolute"
          top="-20px"
          fontSize="12px"
          left={chat.userId === currentUserId ? null : "0px"}
          right={chat.userId === currentUserId ? "0px" : null}
          color={chat.userId === currentUserId ? "purple.200" : "yellow.700"}
        >
          {chat.username}
        </Text>
        <Text
          color={chat.userId === currentUserId ? "purple.200" : "yellow.700"}
        >
          {chat.message}
        </Text>
        <Text
          fontSize="10px"
          alignSelf="end"
          ml="2"
          color={chat.userId === currentUserId ? "purple.200" : "yellow.700"}
        >
          {chat.timestamp}
        </Text>
      </Center>
    </Center>
  );
};

export default ChatMessage;
