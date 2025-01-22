import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function MyGroup() {
  const [searchParams] = useSearchParams();
  const [groupName, setGroupName] = useState("");
  const [myTransactGet, setMyTransactGet] = useState([]);
  const [splits, setSplits] = useState([]);
  const [myTransactOwed, setMyTransactOwed] = useState([]);
  const groupId = searchParams.get("id");
  const navigate = useNavigate();

  const getSplits = async () => {
    const response = await axios.get(
      `https://split-5spa.onrender.com/api/v1/expense/splits?id=${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setSplits(response.data.splits);
  };

  const getMyGroup = async () => {
    const response = await axios.get(
      `https://split-5spa.onrender.com/api/v1/group/mygroup?id=${groupId}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setGroupName(response.data.groupName);
    setMyTransactGet(response.data.gets);
    setMyTransactOwed(response.data.owed);
  };

  useEffect(() => {
    getMyGroup();
    getSplits();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        {/* Group Name */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {groupName}
        </h1>

        {/* Owed Transactions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-rose-600 mb-4">
            Balances You Owe
          </h2>
          <div className="space-y-4">
            {myTransactOwed.length > 0
              ? myTransactOwed.map(
                  (owed, index) =>
                    owed.amount !== 0 && (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border hover:bg-gray-100 transition"
                      >
                        <div className="text-gray-700">
                          <span className="font-bold">{owed.name}</span> owes
                          you
                        </div>
                        <div className="text-rose-500 font-bold">
                          ₹{owed.amount}
                        </div>
                      </div>
                    )
                )
              : "You do not owe any amount"}
          </div>
        </div>

        {/* Get Transactions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-600 mb-4">
            Balances You Get
          </h2>
          <div className="space-y-4">
            {myTransactGet.length > 0
              ? myTransactGet.map(
                  (gets, index) =>
                    gets.amount !== 0 && (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border hover:bg-gray-100 transition"
                      >
                        <div className="text-gray-700">
                          You get from{" "}
                          <span className="font-bold">{gets.name}</span>
                        </div>
                        <div className="text-green-500 font-bold">
                          ₹{gets.amount}
                        </div>
                      </div>
                    )
                )
              : "You do not get any amount"}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              navigate(`/add?id=${groupId}`);
            }}
          >
            Add Expense
          </button>
          <button
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              navigate(`/settlelist?id=${groupId}`);
            }}
          >
            Settle Up
          </button>
        </div>

        {/* Splits */}
        <div className="space-y-4 mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Splits</h2>
          {splits.map((split, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border hover:bg-gray-100 transition"
            >
              <div>
                <div className="text-gray-800 font-medium">{split.desc}</div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold">{split.name}</span> paid
                </div>
              </div>
              <div className="text-green-600 font-bold">₹{split.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
