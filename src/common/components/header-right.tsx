"use client";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import cn from "../utils/cn";
import { auth } from "../lib/auth";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import DefaultProfile from "./default-profile";
import authClient from "../lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;


export default function HeaderRight({ session }: { session: SessionType }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(session);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const profileMenu = [
    {
      label: "Profile",
      link: '/profile',
    },
    {
      label: 'Dashboard',
      link: '/dashboard',
    }
  ];

  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const res = await authClient.signOut();
    if (res.error) {
      toast.error(res.error.message || "Something went wrong.");
    } else {
      setCurrentSession(null);
      toast.success("Logged out successfully.");
      router.push("/login");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      {currentSession ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="focus:outline-none"
          >
            {currentSession.user.image ? (
              <Image
                src={currentSession.user.image!}
                alt="user profile"
                className="size-10 rounded-full cursor-pointer transition-all"
                width={40}
                height={40}
              />
            ) : (
              <DefaultProfile
                className="size-10 rounded-full"
                letter={currentSession?.user?.name?.charAt(0)}
              />
            )}

          </button>

          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-secondary border border-border focus:outline-none z-10 transform origin-top-right transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-5"
            >
              {profileMenu.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="block px-4 py-2 text-sm text-primary-text font-semibold hover:bg-quaternary-hover"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                className="w-full text-left block px-4 py-2 text-sm text-danger hover:bg-quaternary-hover border-t border-border font-semibold"
                onClick={() => {
                  handleLogout();
                  setIsProfileMenuOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link href="/login" className={cn("button")}>Login</Link>
          <Link href="/sign-up" className={cn("button-accent")}>Sign Up</Link>
        </>
      )}
    </div>
  );
}
