import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Signup } from "./pages/signup";
import { Signin } from "./pages/signin";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/Creategroup";
import Mygroup from "./pages/mygroup";
import { AddExpense } from "./pages/Addexpence";
import SettleList from "./pages/SettleList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/dash" element={<Dashboard />}></Route>

          <Route path="/createGroup" element={<CreateGroup />}></Route>
          <Route path="/mygroup" element={<Mygroup />}></Route>
          <Route path="/add" element={<AddExpense></AddExpense>}></Route>
          <Route path="/settlelist" element={<SettleList></SettleList>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
