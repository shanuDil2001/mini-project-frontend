import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `${import.meta.env.VITE_SUPABASE_URL}`;
const supabaseAnonKey = `${import.meta.env.VITE_ANON_KEY}`;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function mediaUpload(files) {
   const mediaUploadPromise = new Promise(async (resolve, reject) => {
      if (files == null) {
         reject("No file selected");
         return;
      }

      const fileName = `${Date.now()}_${files.name}`;

      try {
         await supabase.storage.from("new-project").upload(fileName, files);

         const publicUrl = await supabase.storage.from("new-project").getPublicUrl(fileName).data.publicUrl;

         resolve(publicUrl);
      } catch (error) {
         console.error(error);

         reject("Error occured in supabse connection.");
      }
   });
   return mediaUploadPromise;
}