import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";

type SideNaveProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SideNave({ darkMode, setDarkMode }: SideNaveProps) {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 p-4">
      <ul className="flex flex-col gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>
            <IconHoverEffect>
              <span className="flex items-center gap-4">
                <VscHome className="h-6 w-6" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          <IconHoverEffect>
            <button
              type="button"
              className="flex items-center gap-4"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {!darkMode ? (
                <BsFillMoonStarsFill className="h-5 w-5" />
              ) : (
                <BsFillSunFill className="h-6 w-6" />
              )}
              <span className="hidden text-lg md:inline">
                {!darkMode ? "Dark" : "Light"}
              </span>
            </button>
          </IconHoverEffect>
        </li>
        {!!user && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscAccount className="h-6 w-6" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        <li>
          {user == null ? (
            <button onClick={() => void signIn()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignIn className="h-6 w-6 fill-green-700" />
                  <span className="hidden text-lg text-green-700 md:inline">
                    Log In
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          ) : (
            <button onClick={() => void signOut()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignOut className="h-6 w-6 fill-red-700" />
                  <span className="hidden text-lg text-red-700 md:inline">
                    Log Out
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
