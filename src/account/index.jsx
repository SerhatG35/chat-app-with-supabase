import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import Avatar from "../avatar";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`username,  avatar_url`)
        .eq("id", user.id)
        .single();

      if (error) {
        toast({
          description: error.message,
          status: "error",
        });
      } else if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }

      setLoading(false);
    }

    getProfile();
  }, [session, toast]);

  async function updateProfile(event, avatarUrl) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    let { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      toast({
        description: error.message,
        status: "error",
      });
    } else {
      toast({
        description: "Profile updated",
        status: "success",
      });
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }

  return (
    <FormControl position="initial" w="300px">
      <Button
        isDisabled={!Boolean(username)}
        position="absolute"
        top="8px"
        right="8px"
        onClick={() => navigate("/chat")}
      >
        Go to chat
      </Button>
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(event, url) => {
          updateProfile(event, url);
        }}
      />
      <Box my="0.5rem">
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input id="email" disabled value={session.user.email} />
      </Box>
      <Box my="0.5rem">
        <FormLabel htmlFor="username">Name</FormLabel>
        <Input
          id="username"
          type="text"
          value={username ?? ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Box>
      <Center mt="2rem" gap="1rem" flexDir="column">
        <Button onClick={updateProfile} w="100%" isLoading={loading}>
          Update
        </Button>
        <Button
          variant="outline"
          colorScheme="red"
          w="100%"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </Button>
      </Center>
    </FormControl>
  );
}
