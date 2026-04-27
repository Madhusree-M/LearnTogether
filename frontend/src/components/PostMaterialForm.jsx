import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const PostMaterialForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const mongo_id = sessionStorage.getItem("mongo_id");
  const uploader_name = sessionStorage.getItem("username") || "Anonymous User";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validation: Max 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File is too large (max 10MB)");
      return;
    }

    // Validation: Allowed types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip"
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("File type not supported (PDF, Images, DOCX, ZIP only)");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      // Step 1: Get Pre-signed URL from Backend
      const { data: presignedData } = await axios.post("http://localhost:3000/upload/presigned-url", {
        fileName: file.name,
        fileType: file.type
      });

      const { uploadUrl, fileUrl } = presignedData;
      setProgress(30);

      // Step 2: Upload file directly to Cloudflare R2 using the signed URL
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(30 + (percentCompleted * 0.5)); // Map 0-100 to 30-80
        }
      });

      setProgress(80);

      // Step 3: Save file metadata to MongoDB
      await axios.post("http://localhost:3000/materials", {
        title,
        subject,
        file_url: fileUrl,
        uploaded_by: mongo_id,
        uploader_name: uploader_name
      });

      setProgress(100);
      toast.success("Material uploaded successfully to R2!");
      
      setTimeout(() => {
        navigate("/materials");
      }, 1000);

    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col w-[520px] mt-20 mx-auto px-10 py-10 gap-6 
                      border border-indigo-950/30 rounded-2xl shadow-2xl mb-62 bg-white/80 backdrop-blur-md">

      <h1 className="text-3xl font-extrabold text-center text-indigo-950 tracking-tight">
        Share Study Material
      </h1>
      
      <p className="text-center text-gray-500 -mt-4 text-sm font-medium">
        Upload PDFs, Images, or Documents directly to our secure storage.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-indigo-950 ml-1">Title</label>
          <input
            type="text"
            placeholder="e.g. DBMS Unit 1 Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-indigo-950 ml-1">Subject</label>
          <input
            type="text"
            placeholder="e.g. DBMS / OS / AI"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-indigo-950 ml-1">Select File</label>
          <div className="relative group">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              required
            />
            <label 
              htmlFor="file-upload"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer group-hover:border-indigo-500 transition-colors bg-gray-50 group-hover:bg-indigo-50/30"
            >
              <div className="text-center">
                <i className={`bi ${file ? 'bi-file-earmark-check-fill text-green-500' : 'bi-cloud-arrow-up text-indigo-400'} text-2xl`}></i>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {file ? file.name : "Click to select file (Max 10MB)"}
                </p>
              </div>
            </label>
          </div>
        </div>

        {uploading && (
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`mt-2 w-full py-3.5 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-950 hover:bg-black'} text-white 
                     rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Uploading... {progress}%
            </>
          ) : (
            "Share Material"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostMaterialForm;
