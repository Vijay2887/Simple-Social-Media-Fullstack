import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const handleUserRegistration = async () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.password
    ) {
      alert("All fields are required");
      return;
    }
    try {
      await axios.post("http://localhost:4000/register", newUser);
      setNewUser({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
      });
      alert("Registration Successful");
    } catch (error) {
      console.log(error.message);
      alert("Error ", error.message);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="flex flex-col items-center border-gray-400 border-2 px-10 py-4 w-[300px] rounded-lg gap-y-4 sm:w-[420px] shrink-0">
        <h1 className="text-2xl font-bold">Register</h1>
        <div className="flex flex-col  w-full gap-2">
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
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Email</label>
            <input
              type="text"
              placeholder="Enter email"
              className="focus: outline-none bg-gray-300 rounded-md px-2 py-1 w-[90%] text-black placeholder:text-gray-600"
              required
              value={newUser.email}
              onChange={(e) => {
                return setNewUser((n) => {
                  return { ...n, email: e.target.value };
                });
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              className="focus: outline-none bg-gray-300 rounded-md px-2 py-1 w-[90%] text-black placeholder:text-gray-600"
              required
              value={newUser.firstName}
              onChange={(e) => {
                return setNewUser((n) => {
                  return { ...n, firstName: e.target.value };
                });
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              className="focus: outline-none bg-gray-300 rounded-md px-2 py-1 w-[90%] text-black placeholder:text-gray-600"
              required
              value={newUser.lastName}
              onChange={(e) => {
                return setNewUser((n) => {
                  return { ...n, lastName: e.target.value };
                });
              }}
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
            onClick={handleUserRegistration}
          >
            Register
          </button>
        </div>
        <div>
          <p className="text-[12px] sm:text-[15px]">
            Already have an account?{" "}
            <Link
              className="text-purple-600 underline hover:cursor-pointer"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
