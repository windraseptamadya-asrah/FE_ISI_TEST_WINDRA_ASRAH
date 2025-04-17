"use client";

import { IState } from "@/lib/scripts/store/store-provider";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button";
import Modal from "../modals";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { clearAuthState } from "@/lib/scripts/store/slices/user-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user } = useSelector((state: IState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    dispatch(clearAuthState());
    setLogoutModalOpen(false);
    toast.success("Signed out successfully!");
    router.refresh();
  }

  return (
    <>
      <header className="flex justify-between items-center w-full h-16 bg-gray-800 text-white px-4">
        <div className="text-lg font-bold">Todo</div>
        <div>
          Signed in as <b>{user ? user.name : "Guest"}</b>
          <Button onClick={() => setLogoutModalOpen(true)} className="ml-4 !px-2 !py-1">
            <FontAwesomeIcon icon={faSignOut} className="mr-2" size="sm" fixedWidth />
            Sign out
          </Button>
        </div>
      </header>

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Sign out?"
        description="Are you sure you want to sign out?"
        confirmText="Sign out"
        cancelText="Cancel"
        onConfirm={handleSignOut}
      />
    </>
  );
}
