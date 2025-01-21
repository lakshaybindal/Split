import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch groups from the backend
  const fetchGroups = async (filter = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/group/list?filter=${filter}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setGroups(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch groups on component mount and when search changes
  useEffect(() => {
    const delayFetch = setTimeout(() => {
      fetchGroups(search);
    }, 300); // Debounce to avoid excessive API calls
    return () => clearTimeout(delayFetch);
  }, [search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search groups"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading groups...</p>
        ) : (
          <div className="space-y-3">
            {/* Render Groups */}
            {groups.length > 0 ? (
              groups.map((group, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(`/mygroup?id=${group._id}`);
                  }}
                  className="p-4 bg-white border rounded-lg shadow-sm text-gray-700"
                >
                  {group.name}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No groups found.</p>
            )}
          </div>
        )}

        {/* Redirect Button */}
        <button
          onClick={() => navigate("/createGroup")}
          className="w-full mt-6 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
