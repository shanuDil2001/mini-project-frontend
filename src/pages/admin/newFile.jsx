import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utilities/mediaUpload";

function NewFile() {
   const [fileName, setFileName] = useState("");
   const [description, setDescription] = useState("");
   const [files, setFiles] = useState(null);

   const navigate = useNavigate();

   async function handleSubmit() {
      if (!files || files.length === 0) {
         return toast.error("Please select a file before submitting.");
      }

      try {
         const uploadedUrls = await Promise.all([mediaUpload(files[0])]);
         console.log(uploadedUrls);

         await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/files`,
            {
               fileName: fileName,
               description: description,
               fileUrl: uploadedUrls
            },
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            }
         );

         toast.success("File added successfully!");
         navigate("/dashboard");
      } catch (err) {
         console.error(err);
         toast.error("Failed to add file. Please try again.");
      }
   }

   return (
      <div className="w-[90%] min-h-[calc(screen-65px)] flex flex-col items-center my-10 pt-[65px]">
         <div className="w-full bg-white p-6 rounded-md shadow-md border border-green-200 md:w-[80%]">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 text-center">Add a New File</h2>
            <hr className="border border-green-200 w-full my-5" />
            <div className="flex flex-col gap-4">
               <input
                  type="text"
                  placeholder="File Name"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
               />
               <textarea
                  placeholder="Description"
                  className="border border-gray-300 p-2 rounded-md w-full h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
               ></textarea>
               <input
                  type="file"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  onChange={(e) => setFiles(e.target.files)}
               />
               <button
                  type="submit"
                  className="cursor-pointer bg-white border border-blue-400 text-blue-400 p-2 rounded-md font-semibold hover:bg-blue-500 hover:text-white"
                  onClick={handleSubmit}
               >
                  Add File
               </button>
            </div>
            <div className="flex flex-col">
               <hr className="border border-green-200 w-full my-5" />
               <button
                  onClick={() => { navigate(-1); }}
                  className="cursor-pointer bg-white border border-red-400 text-red-400 p-2 rounded-md font-semibold hover:bg-red-500 hover:text-white"
               >
                  Cancel
               </button>
            </div>
         </div>
      </div>
   );
}
export default NewFile;