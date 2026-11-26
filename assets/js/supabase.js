
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { auth } from "./firebase.js";

const SUPABASE_URL = "https://eeveqwprzulouvbdrmvf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_XpVJT04blWb96iqk7xOpLA_8rjRdILz";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    accessToken: async () => {
      return (
        (await auth.currentUser?.getIdToken()) ?? null
      );
    }
  }
);
