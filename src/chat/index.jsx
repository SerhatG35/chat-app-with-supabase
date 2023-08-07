import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ChatMessage from "./chatMessage";

const Chat = () => {
  const navigate = useNavigate();
  const [chatting, setChatting] = useState([]);
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  const isSessionPresent = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
    }

    console.log(session);

    if (session.user.id) {
      setUserId(session.user.id);
    }
  }, [navigate]);

  useEffect(() => {
    isSessionPresent();
  }, [isSessionPresent]);

  const getUsername = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();
    setUsername(data.username);
  }, [userId]);

  useEffect(() => {
    if (userId) getUsername();
  }, [getUsername, userId]);

  const channel = supabase.channel("room-1", {
    config: {
      broadcast: {
        self: true,
      },
    },
  });

  const date = new Date();

  channel
    .on("broadcast", { event: "chat" }, (payload) => {
      setChatting((state) => [...state, payload.payload]);
      setMessage("");
    })
    .subscribe();

  const sendMessage = async () => {
    if (message.length < 1 || message === " ") {
      return;
    }
    channel.send({
      type: "broadcast",
      event: "chat",
      payload: {
        message: message.trim(),
        userId,
        username,
        timestamp: `${date.getHours()}:${date.getMinutes()}`,
      },
    });
  };

  return (
    <Center flexDirection="column" w="100%" color="purple.400" h="100%" p="10">
      <Center
        flexDirection="column"
        justifyContent="end"
        w="100%"
        h="95%"
        pb="4"
        gap={5}
      >
        {chatting.map((chat, index) => (
          <ChatMessage
            key={`${chat.userId}-${index}`}
            chat={chat}
            currentUserId={userId}
          />
        ))}
      </Center>
      <Center h="5%" w="100%">
        <InputGroup size="md">
          <Input
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            bg="purple.900"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              onClick={() => {
                sendMessage();
              }}
              size="xs"
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </Center>
    </Center>
  );
};

export default Chat;
