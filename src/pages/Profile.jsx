import { getAuth, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";
import ListItem from "../components/ListItem";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeProfile, setChangeProfile] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function fetchUserListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("userRef", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc")
        );

        const querySnap = await getDocs(q);
        let listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Listing is not valid");
      }
    }

    fetchUserListings();
  }, [auth.currentUser.uid]);

  function onEdit(listingId) {
    navigate(`/edit-listing/${listingId}`);
  }

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      console.log(updatedListings);

      setListings(updatedListings);

      toast.success("Successfully deleted the listing");
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

      <div className="max-w-6xl mx-auto px-3 mt-6">
        {!loading && listings.length > 0 && (
          <>
            <h1 className="text-3xl font-semibold text-center mb-6">
              My Listings
            </h1>

            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => {
                return (
                  <ListItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onEdit={() => {
                      return onEdit(listing.id);
                    }}
                    onDelete={() => onDelete(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
