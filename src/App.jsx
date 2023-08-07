import { useState, useEffect } from "react";
import { supabase } from "./supabase/client";
import Auth from "./auth";
import Account from "./account";
import { Center } from "@chakra-ui/react";
import Chat from "./chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Center background="#131313" h="100vh">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !session ? (
                <Auth />
              ) : (
                <Account key={session.user.id} session={session} />
              )
            }
          />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </Center>
  );
}

export default App;
