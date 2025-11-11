import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Dashboard() {
   const [files, setFiles] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      async function fetchFiles() {
         try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/files`, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            });
            setFiles(response.data);
         } catch (error) {
            setError(error.message);
         } finally {
            setLoading(false);
         }
      }

      fetchFiles();
   }, [loading]);

   async function deleteFile(fileId, fileUrls) {
      try {
         if (!fileUrls || fileUrls.length === 0) {
            toast.error("No file URLs found to delete.");
            return;
         }

         // Convert full URLs to Supabase storage paths
         const pathsToDelete = fileUrls
            .map(url => {
               // Remove prefix to get relative path
               const prefix = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/new-project/`;
               if (url.startsWith(prefix)) {
                  return url.replace(prefix, "");
               }
               return null;
            })
            .filter(Boolean); // remove null/undefined entries

         console.log("Paths to delete:", pathsToDelete);

         if (pathsToDelete.length === 0) {
            toast.error("Could not extract file paths from URLs.");
            return;
         }

         const { error: storageError } = await supabase.storage
            .from("new-project")
            .remove(pathsToDelete);

         if (storageError) {
            console.error("Supabase delete error:", storageError);
            toast.error("Failed to delete from Supabase Storage.");
            return;
         }

         await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/files/${fileId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         });

         setFiles(prev => prev.filter(f => f.fileId !== fileId));
         toast.success("File deleted successfully!");
      } catch (error) {
         console.error("Delete failed:", error);
         toast.error("Failed to delete file. Please try again.");
      }
   }


   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <h1 className="text-xl font-semibold text-gray-600">Loading...</h1>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <h1 className="text-red-500 text-lg font-semibold">Error: {error}</h1>
         </div>
      );
   }

   return (
      <div className="w-[90%] h-screen pt-[65px]">
         <button
            onClick={() => navigate("/dashboard/new-file")}
            className="fixed w-[150px] h-[50px] bg-green-200 bottom-5 right-5 flex justify-center items-center rounded-md shadow-md hover:bg-green-300 cursor-pointer font-semibold"
         >
            New File
         </button>

         <div className="w-full bg-white shadow-md border border-gray-200 mt-6">
            <table className="w-full text-sm text-gray-700">
               <thead className="bg-green-400 text-white">
                  <tr>
                     <th className="py-3 px-4 text-left">#</th>
                     <th className="py-3 px-4 text-left">File Name</th>
                     <th className="py-3 px-4 text-left">Description</th>
                     <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {files.length === 0 ? (
                     <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                           No Files available.
                        </td>
                     </tr>
                  ) : (
                     files.map((file, index) => (
                        <tr
                           key={file._id || index}
                           className="border-b hover:bg-gray-50 transition-colors duration-150"
                        >
                           <td className="py-3 px-4">{index + 1}</td>
                           <td className="py-3 px-4 font-medium">{file.fileName}</td>
                           {/* <a href={file.file_url} target="_blank" rel="noopener noreferrer"> Download </a> */}
                           <td className="py-3 px-4 font-medium">{file.description}</td>
                           {/* <td className="py-3 px-4 font-medium"></td> */}
                           <td className="py-3 px-4 flex gap-3">
                              <a className="p-1.5 px-3 bg-blue-400 text-white rounded-md hover:bg-blue-500 cursor-pointer font-normal" href={file.fileUrl} target="_blank" rel="noopener noreferrer"> Download </a>
                              <button
                                 onClick={() => {
                                    deleteFile(file.fileId, file.fileUrl)
                                    setLoading(true);
                                 }}
                                 className="p-1.5 px-3 bg-red-400 text-white rounded-md hover:bg-red-500 cursor-pointer"
                              >
                                 Delete
                              </button>

                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}

export default Dashboard;
