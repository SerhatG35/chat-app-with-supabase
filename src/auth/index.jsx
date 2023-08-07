import { useState } from "react";
import { supabase } from "../supabase/client";
import {
  Button,
  Center,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const toast = useToast();

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      toast({
        description: error.error_description ?? error.message,
        isClosable: true,
        title: "Error",
        status: "error",
        variant: "subtle",
        position: "top",
      });
    } else {
      toast({
        description: "Check your email for the login link!",
        isClosable: true,
        variant: "subtle",
        title: "Success",
        status: "success",
        position: "top",
      });
    }
    setLoading(false);
  };

  return (
    <Center flexDirection="column">
      <Heading>Chat App</Heading>
      <Text my="4">Sign in via magic link with your email below</Text>
      <Input
        my="4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outline"
        placeholder="Your email"
      />
      <Button onClick={handleLogin} isLoading={loading}>
        Send Magic Link
      </Button>
    </Center>
  );
}
