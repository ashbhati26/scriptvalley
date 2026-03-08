"use client";

import LoginButton from "@/components/LoginButton";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function HeaderProfileBtn() {
  return (
    <>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "h-7 w-7",
            avatarImage: "h-7 w-7 rounded-full",
            userButtonTrigger: "focus:shadow-none",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            label="Profile"
            labelIcon={<User className="size-3.5" />}
            href="/profile"
          />
        </UserButton.MenuItems>
      </UserButton>

      <SignedOut>
        <LoginButton name="Sign in" className="outline-none focus:outline-none" />
      </SignedOut>
    </>
  );
}

export default HeaderProfileBtn;