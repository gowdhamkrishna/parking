"use client"
import Link from 'next/link';
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          ParkEase
        </Link>
        
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/book" className="hover:text-gray-300">
                Book Parking
              </Link>
              <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                  Sign In
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                  Sign Up
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 