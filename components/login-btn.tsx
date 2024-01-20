import { useSession, signIn, signOut } from "next-auth/react";

// export default function AuthButton({text: string, method}) {
//   const { data: session } = useSession();
// return !session ? (
//   <>
//     <button
//       className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
//       onClick={method}//signIn("strava")}
//     >
//       {text}
//     </button>
//   </>
// ) : null;
// }

type AuthButtonProps = {
  text: string;
  mthd: any;
};

const AuthButton: React.FC<AuthButtonProps> = ({ text, mthd }) => {
  return (
    <>
      <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        onClick={mthd} //signIn("strava")}
      >
        {text}
      </button>
    </>
  );
};

export default AuthButton;

// export default function LogOutButton() {
//   const { data: session } = useSession();
//   return !session ? (
//     <>
//       <button
//         className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
//         onClick={() => signIn("strava")}
//       >
//         Sign in with Strava
//       </button>
//     </>
//   ) : null;
// }
