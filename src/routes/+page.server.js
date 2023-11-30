import { supabase } from "$lib/supabase";

export const load = async () => {
	const { data: libraries, error } = await supabase
    .from('libraries')
    .select();
	if (!libraries) throw error;
		
  console.log("Ran layout load");
  return {
    data: await libraries,
	libraries: libraries ?? [], 
};

};
