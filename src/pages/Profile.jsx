import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogOut() {
    auth.signOut();
    navigate("/");
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Profile</h1>
      <div className="w-full md:w-[50%] mx-auto mt-6">
        <form>
          {/* Name Input */}
          <input
            type="text"
            id="name"
            value={name}
            disabled
            className="mb-6 w-full px-4 text-gray-700 bg-white text-xl border border-gray-300 rounded transition ease-in-out"
          />
          {/* Email Input */}
          <input
            type="text"
            id="email"
            value={email}
            disabled
            className="mb-6 w-full px-4 text-gray-700 bg-white text-xl border border-gray-300 rounded transition ease-in-out"
          />

          <div className="flex justify-between whitespace-nowrap text-sm md:text-lg">
            <p>
              Do you want to change your name?{" "}
              <span className="text-red-600 hover:text-red-700 transition cursor-pointer ml-1 ease-in-out">
                Edit
              </span>
            </p>
            <p
              onClick={onLogOut}
              className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
            >
              Sign Out
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
