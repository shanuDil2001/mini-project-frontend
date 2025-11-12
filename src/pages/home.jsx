import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/files`
        );
        setFiles(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading files...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Error</p>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[80%] flex flex-col items-center pt-[85px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Uploaded Files
      </h1>

      {files.length === 0 ? (
        <p className="text-gray-500">No files found.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white shadow-sm rounded-lg px-5 py-5 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
                <span className="text-gray-800 font-medium">{file.fileName || "Untitled File"}</span>
              </div>
              <button
                onClick={() => window.open(file.fileUrl, "_blank")}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
