import { getAuth, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

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

          <div className="flex justify-between whitespace-nowrap text-sm md:text-lg">
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
      </div>
    </section>
  );
}
