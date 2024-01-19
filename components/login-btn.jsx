import { useSession, signIn, signOut } from "next-auth/react";

export default function Button() {
  const { data: session } = useSession();
  return !session ? (
    <>
      <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => signIn("strava")}
      >
        Sign in with Strava
      </button>
    </>
  ) : null;
}
