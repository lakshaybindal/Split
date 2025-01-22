import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Settle() {
  const [searchParams] = useSearchParams();
  const [myId, setmyId] = useState("");
  const [amount, setamount] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [myTransactGet, setMyTransactGet] = useState([]);
  const [myTransactOwed, setMyTransactOwed] = useState([]);
  const groupId = searchParams.get("id");
  const navigate = useNavigate();
  const getMyGroup = async () => {
    const response = await axios.get(
      `https://split-5spa.onrender.com/api/v1/group/mygroup?id=${groupId}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setmyId(response.data.myId);
    setGroupName(response.data.groupName);
    setMyTransactGet(response.data.gets);
    setMyTransactOwed(response.data.owed);
  };

  useEffect(() => {
    getMyGroup();
  }, []);

  async function settleup(to, from) {
    try {
      const res = await axios.post(
        `https://split-5spa.onrender.com/api/v1/expense/settle?id=${groupId}`,
        {
          to: to,
          from: from,
          amount: amount,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("settle Successfull");
      navigate(`/mygroup?id=${groupId}`);
    } catch (e) {
      alert("Enter Correct Amount");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        {/* Group Name */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {groupName}
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4 text-center">
          Manage Your Balances
        </h2>

        {/* Owed Transactions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-rose-600 mb-4">
            Balances You Owe
          </h3>
          <div className="space-y-4">
            {myTransactOwed.length > 0
              ? myTransactOwed.map(
                  (owed, index) =>
                    owed.amount !== 0 && (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border"
                      >
                        <div className="w-1/3 text-gray-700">
                          You owe <span className="font-bold">{owed.name}</span>
                        </div>
                        <div className="text-rose-500 font-bold">
                          ₹{owed.amount}
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            max={owed.amount}
                            onChange={(e) => setamount(e.target.value)}
                            placeholder="Amount"
                            className="border rounded-md p-2 w-28"
                          />
                          <button
                            onClick={() => settleup(owed.userId, myId)}
                            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
                          >
                            Settle
                          </button>
                        </div>
                      </div>
                    )
                )
              : "You do not owe any amount"}
          </div>
        </div>

        {/* Get Transactions */}
        <div>
          <h3 className="text-lg font-semibold text-green-600 mb-4">
            Balances You Get
          </h3>
          <div className="space-y-4">
            {myTransactGet.length > 0
              ? myTransactGet.map(
                  (gets, index) =>
                    gets.amount !== 0 && (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border"
                      >
                        <div className="w-1/3 text-gray-700">
                          You get from{" "}
                          <span className="font-bold">{gets.name}</span>
                        </div>
                        <div className="text-green-500 font-bold">
                          ₹{gets.amount}
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            max={gets.amount}
                            onChange={(e) => setamount(e.target.value)}
                            placeholder="Amount"
                            className="border rounded-md p-2 w-28"
                          />
                          <button
                            onClick={() => settleup(myId, gets.userId)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                          >
                            Settle
                          </button>
                        </div>
                      </div>
                    )
                )
              : "You do not get any amount"}
          </div>
        </div>
      </div>
    </div>
  );
}
