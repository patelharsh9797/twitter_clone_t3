import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SideNave() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 p-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        {!!user && (
          <li>
            <Link href={`/profiles/${user.id}`}>Profile</Link>
          </li>
        )}
        <li>
          {user == null ? (
            <button className="btn-light" onClick={() => void signIn()}>
              Log In
            </button>
          ) : (
            <button className="btn" onClick={() => void signOut()}>
              Log Out
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
