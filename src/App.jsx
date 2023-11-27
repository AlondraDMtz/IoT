import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Dashboard from "./components/Dashboard";
import { SessionContext } from "./hooks/userSession";



function SingOut() {
  return (
    <>
      <span>Autenticado</span>
      <button onClick={() => supabase.auth.signOut()}>
        Cierra Sesi&oacute;n
      </button>

    </>
  )
}
function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      });


    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <SessionContext.Provider value={{ session, setSession }}>
        {!session ?
          <Auth />
          :
          <Dashboard title={"Dashboard"}
            >
            <p>Hola mundo</p>
          </Dashboard>
        }
      </SessionContext.Provider>
    </>
  );
}


export default App

