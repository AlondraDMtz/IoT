import {createClient} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SB_URL;
const supabaseKey = import.meta.env.VITE_SB_KEY;

 export const supabase = createClient(supabaseUrl, supabaseKey);