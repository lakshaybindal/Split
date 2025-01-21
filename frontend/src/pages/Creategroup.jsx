import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const addUser = (id) => {
    if (members.some((member) => member.userId === id)) {
      setMembers(members.filter((member) => member.userId !== id));
    } else {
      setMembers([
        ...members,
        {
          userId: id,
          gets: [],
          owed: [],
        },
      ]);
    }
  };
  const createGroup = async () => {
    const response = await axios.post(
      "http://localhost:3000/api/v1/group/create",
      {
        name: name,
        members: members.map((member) => ({
          userId: member.userId,
          gets: member.gets,
          owed: member.owed,
        })),
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`, // Replace "token" with your actual key
        },
      }
    );
    if (response.data) {
      navigate(`/mygroup?id=${response.data.groupid}`);
    }
  };
  // Function to fetch users from the API
  const fetchUsers = async (filter = "") => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/list?filter=${filter}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`, // Replace "token" with your actual key
          },
        }
      );
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  console.log(users);
  // Debounced effect to call fetchUsers on search input change
  useEffect(() => {
    const delayFetch = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(delayFetch); // Cleanup timeout on unmount or re-run
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Search Input */}
      <div className=" font-mono font-bold text-5xl mb-20">Create Group </div>
      <div className="w-11/12 md:w-2/3 lg:w-1/2 mb-20">
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="w-11/12 md:w-2/3 lg:w-1/2">
        <input
          type="text"
          placeholder="Search Users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none ${isRadioToggle}focus:ring-2 focus:ring-blue-500` focus:border-transparent"
        />
      </div>

      {/* Users List */}
      <div className="w-11/12 md:w-2/3 lg:w-1/2 mt-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              onClick={() => addUser(user._id)}
              key={user._id}
              className={`${
                members.some((member) => member.userId === user._id)
                  ? "bg-blue-300"
                  : ""
              } flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-100 rounded-lg`}
            >
              {/* User Info */}
              <div className="text-sm font-medium text-gray-700">
                {user.fName} {user.lName}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">No users found</div>
        )}
      </div>
      <div>
        <button
          className=" mt-10 rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          onClick={createGroup}
        >
          Add Group{" "}
        </button>
      </div>
    </div>
  );
}
