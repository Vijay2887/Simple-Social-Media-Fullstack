import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!newUser.username || !newUser.password) {
      alert("All fields are required");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        newUser,
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/feed");
      }
    } catch (error) {
      console.log(error.message); // log the error for debugging purpose
      alert("Invalid Credentials");
    }
    setNewUser({
      username: "",
      password: "",
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="flex flex-col items-center border-gray-400 border-2 px-10 py-4 w-[300px] rounded-lg gap-y-4 sm:w-[420px] shrink-0">
        <h1 className="text-2xl font-bold">Login</h1>

        <div className="flex flex-col  w-full gap-3">
          <div className="flex flex-col">
            <label className="font-bold">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="focus: outline-none bg-gray-300 rounded-md px-2 py-1 w-[90%] text-black placeholder:text-gray-600"
              required
              value={newUser.username}
              onChange={(e) => {
                return setNewUser((n) => {
                  return { ...n, username: e.target.value };
                });
              }}
              ref={inputRef}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="focus: outline-none bg-gray-300 rounded-md px-2 py-1 w-[90%] text-black placeholder:text-gray-600"
              required
              value={newUser.password}
              onChange={(e) => {
                return setNewUser((n) => {
                  return { ...n, password: e.target.value };
                });
              }}
            />
          </div>

          <button
            className="focus:outline-none bg-purple-700 w-[90%] mt-3 px-2 py-3 font-semibold rounded-sm hover:cursor-pointer hover:bg-purple-900 active:bg-purple-900"
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
