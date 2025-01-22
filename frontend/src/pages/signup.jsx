import axios from "axios";
import { useState } from "react";
import { ButtomWarning } from "../components/bottomWarning";
import { Button } from "../components/button";
import { Heading } from "../components/heading";
import { InputBox } from "../components/inputBox";
import { SubHeading } from "../components/subheading";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [username, setusername] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setpassword] = useState("");
  const Navigator = useNavigate();
  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "https://split-5spa.onrender.com/api/v1/user/signup",
        {
          username,
          fName: firstName,
          lName: lastName,
          pswd: password,
        }
      );
      localStorage.setItem("token", response.data.token);
      Navigator("/dash");
    } catch (e) {
      alert("Email already taken / Incorrect inputs");
    }
  };
  return (
    <>
      <div className=" bg-gray-300 h-screen flex justify-center items-center	">
        <div className="p-7 bg-white rounded-2xl flex flex-col items-center text-center shadow-lg">
          <Heading title="SignUp" class=" text-5xl font-bold p-3"></Heading>
          <SubHeading
            class="w-60 pb-3 pt-2 "
            subject="Enter your information to create an account"
          ></SubHeading>
          <InputBox
            set={setusername}
            inputHead="Username"
            placehead="jon@gmail.com"
          ></InputBox>
          <InputBox
            set={setfirstName}
            inputHead="FirstName"
            placehead="don"
          ></InputBox>
          <InputBox
            set={setlastName}
            inputHead="LastName"
            placehead="jon"
          ></InputBox>
          <InputBox set={setpassword} inputHead="Password"></InputBox>
          <Button
            onclick={handleSignup}
            class="bg-black p-2 w-72 rounded-xl text-white mt-2"
            text="SignUp"
          ></Button>
          <ButtomWarning
            warning={"Already have an account?"}
            to="/signin"
            text="signin"
          ></ButtomWarning>
        </div>
      </div>
    </>
  );
}
