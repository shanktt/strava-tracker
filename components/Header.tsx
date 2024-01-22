import AuthButton from "@/components/AuthButton";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="flex flex-row items-center justify-between h-16 px-4 border-b">
      <h1 className="text-2xl font-bold">
        Strava Tracker
      </h1>
      {session ? <AuthButton text={"Sign Out"} mthd={() => signOut()} /> : null}
    </header>
  );
}
