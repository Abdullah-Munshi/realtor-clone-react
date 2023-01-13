import { getAuth, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeProfile, setChangeProfile] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogOut() {
    auth.signOut();
    navigate("/");
  }

  function onChangeProfile() {
    changeProfile && onSubmit();
    setChangeProfile((prevState) => !prevState);
  }

  function onChange(e) {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });
  }

  async function onSubmit() {
    try {
      // Update display name in the firestore auth
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update the name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        updateDoc(docRef, {
          name: name,
        });

        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error("Profile is not updated");
    }
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
            disabled={!changeProfile}
            onChange={onChange}
            className={`mb-6 w-full px-4 text-gray-700 bg-white text-xl border border-gray-300 rounded transition ease-in-out ${
              changeProfile && "bg-red-200"
            } `}
          />
          {/* Email Input */}
          <input
            type="text"
            id="email"
            value={email}
            disabled
            className="mb-6 w-full px-4 text-gray-700 bg-white text-xl border border-gray-300 rounded transition ease-in-out"
          />

          <div className="flex justify-between whitespace-nowrap text-sm md:text-lg mb-6">
            <p>
              Do you want to change your name?{" "}
              <span
                onClick={onChangeProfile}
                className="text-red-600 hover:text-red-700 transition cursor-pointer ml-1 ease-in-out"
              >
                {changeProfile ? "Apply Changes" : "Edit"}
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
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:shadow-lg active:bg-blue-800"
        >
          <Link
            to="/create-listing"
            className="flex items-center justify-center"
          >
            <FcHome className="text-3xl mr-2 bg-red-100 rounded-full border-2" />
            Sell or Rent your home
          </Link>
        </button>
      </div>
    </section>
  );
}
