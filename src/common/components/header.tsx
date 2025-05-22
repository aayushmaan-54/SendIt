import Link from "next/link";
import checkAuth from "../utils/check-auth";
import HeaderRight from "./header-right";


export default async function Header() {
  const session = await checkAuth();

  return (
    <>
      <header className="w-full fixed border-b border-border text-white bg-primary z-40">
        <div className="mx-auto max-w-7xl w-full flex items-center justify-between px-4 py-4">
          <Link href="/">
            <span className="sm:text-2xl text-xl font-bold flex items-center justify-center gap-1 text-primary-text">
              <span>📤</span>
              <span className="mt-1">SendIt</span>
            </span>
          </Link>

          <HeaderRight session={session} />
        </div>
      </header>
    </>
  );
}
