import { supabase } from "../supabaseClient";
import { useSessionContext } from "../hooks/userSession";
import { useState } from "react";
import Table from "./Table";
import Forecasting from "./Forecasting";




export default function Dashboard({ children, title, }) {
    const [section, setSection] = useState("Dashboard");
    const { session } = useSessionContext();
    return (
        <>
            <div className="bg-slate-900 w-full text-white">
                <div className="flex justify-between px-5">

                    <div className="inline-flex items-center space-x-4">
                        <h3 className="text-2xl  font-bold">
                            Telematica Weather Station
                        </h3>
                        <p
                            className="cursor-pointer"
                            onClick={() => setSection("Dashboard")}>Dashboard</p>


                        <p
                            className="cursor-pointer"
                            onClick={() => setSection("Forecasting")}>Forecasting</p>
                    </div>

                    <div className="py-4 inline-flex  items-center space-x-4 ">
                        <p className="py-4 inline-flex  items-center space-x-4 ">
                            {session.user.email}
                        </p>

                        <button className="p-4 rounded-full bg-slate-100 font-bold text-black"
                            onClick={() => supabase.auth.signOut()}>
                            Cierra Sesi&oacute;n
                        </button>


                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="px-5 py-4 border-b border-black">
                    <h1 className="text-4xl font-bold">
                        {section}
                    </h1>
                </div>
            </div>
            <div className="px-5 py-8">
                {section === "Dashboard" && <Table/>}
                
                {section === "Forecasting" && <Forecasting />}
            </div>
            
        </>

    );

}
