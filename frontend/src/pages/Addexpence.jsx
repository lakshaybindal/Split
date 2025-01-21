import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function AddExpense() {
  const [userAmount, setUserAmount] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [members, setMembers] = useState([]);
  const [equal, setEqual] = useState(false); // State to toggle equal split
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("id");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/groupusers?id=${groupId}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMembers(response.data.member);
        console.log(response.data.member); // Assuming API returns members array
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    if (groupId) {
      fetchUsers();
    }
  }, [groupId]);

  const handleUser = (amount, userId) => {
    const updatedUserAmount = [...userAmount];
    const existingUser = updatedUserAmount.find((u) => u.userId === userId);

    if (existingUser) {
      existingUser.amount = amount;
    } else {
      updatedUserAmount.push({ userId, amount });
    }
    setUserAmount(updatedUserAmount);
  };

  const distributeEqually = () => {
    const equalAmount = amount / members.length;
    const updatedUserAmount = members.map((m) => ({
      userId: m.userId,
      amount: equalAmount,
    }));
    setUserAmount(updatedUserAmount);
  };

  const addExpense = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/expense/add?id=${groupId}`,
        {
          desc,
          amount,
          participants: userAmount,
          paidBy,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      //   console.log(response.data);
      navigate(`/mygroup?id=${groupId}`);
      alert("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error.message);
    }
  };
  if (!members) {
    return (
      <>
        <div>loading..</div>
      </>
    );
  }
  console.log(userAmount);
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Expense</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="paid" className="block mb-2 font-semibold">
          Paid By
        </label>
        <select
          id="paid"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select</option>
          {members.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Split Mode</label>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="equal"
            name="splitMode"
            checked={equal}
            onChange={() => {
              setEqual(true);
              distributeEqually();
            }}
            className="mr-2"
          />
          <label htmlFor="equal" className="mr-4">
            Equal Split
          </label>
          <input
            type="radio"
            id="custom"
            name="splitMode"
            checked={!equal}
            onChange={() => {
              setEqual(false);
              setUserAmount([]); // Clear user amounts for custom entry
            }}
            className="mr-2"
          />
          <label htmlFor="custom">Custom Split</label>
        </div>
      </div>
      <div className="mb-4">
        {!equal ? (
          members.map((m) => (
            <div key={m.userId} className="flex items-center mb-2">
              <span className="w-1/3">{m.name}</span>
              <input
                type="number"
                placeholder="Amount"
                onChange={(e) => handleUser(Number(e.target.value), m.userId)}
                className="w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-500">Amounts distributed equally.</p>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={addExpense}
          className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}
