import { useState } from "react";
import { useNavigate } from "react-router";

const MaterialCard = ({ material }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(
    material.upvotes?.includes(sessionStorage.getItem("mongo_id")) || false
  );
  const [upvoteCount, setUpvoteCount] = useState(material.upvotes?.length || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(material.title);
  const [editedFileUrl, setEditedFileUrl] = useState(material.file_url);

  const isOwner = sessionStorage.getItem("mongo_id") === material.uploaded_by;

  const getAvatarColor = (name) => {
    const colors = ["bg-indigo-500", "bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500"];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const handleLike = async () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/materials/${material.material_id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ user_id: sessionStorage.getItem("mongo_id") })
      });

      const data = await response.json();
      if (response.ok) {
        setLiked(!liked);
        setUpvoteCount(data.upvotes);
      }
    } catch (error) {
      console.error("Upvote failed", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("mongo_id");
      const response = await fetch(`http://localhost:3000/materials/${material.material_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editedTitle,
          file_url: editedFileUrl,
          userId
        })
      });

      if (response.ok) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("mongo_id");
      const response = await fetch(`http://localhost:3000/materials/${material.material_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-4">
      <div className="p-5 md:p-6">
        {/* Header: Uploader & Date */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${getAvatarColor(material.uploader_name)}`}>
              {material.uploader_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-950 leading-tight">{material.uploader_name}</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-widest">{material.createdAt?.split("T")[0]}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Edit Material"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  onClick={handleDelete} 
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Material"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-semibold uppercase tracking-tight rounded-full border border-amber-100 h-fit">
              {material.subject}
            </span>
          </div>
        </div>

        {/* Body: Title & File Icon */}
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={editedTitle} 
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-lg font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Material Title"
                />
                <input 
                  type="text" 
                  value={editedFileUrl} 
                  onChange={(e) => setEditedFileUrl(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="File URL (Google Drive / PDF link)"
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="px-4 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdate} 
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-indigo-950 mb-1 leading-tight">
                  {material.title}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Study Resource • {material.subject}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer: Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 group transition-all duration-300 ${liked ? "text-pink-600 scale-105" : "text-gray-400 hover:text-pink-400"}`}
          >
            <div className={`p-2 rounded-full transition-colors ${liked ? "bg-pink-50" : "group-hover:bg-pink-50"}`}>
              <svg
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${liked ? "fill-current" : "fill-none stroke-current"}`}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">{upvoteCount}</span>
          </button>

          <a
            href={material.file_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-indigo-950 text-white px-5 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>View / Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
