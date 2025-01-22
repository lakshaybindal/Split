import axios from "axios";
import { ButtomWarning } from "../components/bottomWarning";
import { Button } from "../components/button";
import { Heading } from "../components/heading";
import { InputBox } from "../components/inputBox";
import { SubHeading } from "../components/subheading";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Signin() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const Navigator = useNavigate();
  async function handleSignin() {
    try {
      const response = await axios.post(
        "https://split-5spa.onrender.com/api/v1/user/signin",
        {
          username,
          pswd: password,
        }
      );
      localStorage.setItem("token", response.data.token);
      Navigator("/dash");
    } catch (e) {
      alert("Incorrect inputs");
    }
  }
  return (
    <div className=" bg-gray-300 h-screen flex justify-center items-center	">
      <div className="p-7 bg-white rounded-2xl flex flex-col items-center text-center shadow-lg">
        <Heading title="Sign In" class=" text-5xl font-bold p-3"></Heading>
        <SubHeading
          class="w-60  pb-3 pt-2 "
          subject="Enter your credentials to access your account "
        ></SubHeading>
        <InputBox
          set={setusername}
          inputHead="Email"
          placehead="jon@gmail.com"
        ></InputBox>
        <InputBox set={setpassword} inputHead="Password"></InputBox>
        <Button
          onclick={handleSignin}
          class="bg-black p-2 w-72 rounded-xl text-white mt-2"
          text="SignIn"
        ></Button>
        <ButtomWarning
          warning="Don't have an account?"
          to="/signup"
          text="signUp"
        ></ButtomWarning>
      </div>
    </div>
  );
}
