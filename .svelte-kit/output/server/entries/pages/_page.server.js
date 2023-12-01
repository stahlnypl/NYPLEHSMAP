import { createClient } from "@supabase/supabase-js";
import { a as PUBLIC_SUPABASE_URL, P as PUBLIC_SUPABASE_ANON_KEY } from "../../chunks/public.js";
const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);
const load = async () => {
  const { data: libraries, error } = await supabase.from("libraries").select();
  if (!libraries)
    throw error;
  console.log("Ran layout load");
  return {
    data: await libraries,
    libraries: libraries ?? []
  };
};
export {
  load
};
