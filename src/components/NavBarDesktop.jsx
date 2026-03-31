import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/logo.png";

export default function NavBarDesktop() {
  return (
    <div className="flex h-16 justify-between">
      {/* Left */}
      <div className="flex items-center gap-2">
        <img src={Logo} className="size-6" />
        <p className="text-white font-bold text-2xl">Seun</p>
        <div className="hidden lg:ml-6 lg:flex sm:space-x-8">
          <a className="text-white border-b-2 border-transparent hover:border-brightBlue transition duration-300 cursor-pointer">
            Home
          </a>
          <a className="text-white border-b-2 border-transparent hover:border-brightBlue transition duration-300 cursor-pointer">
            About Me
          </a>
          <a className="text-white border-b-2 border-transparent hover:border-brightBlue transition duration-300 cursor-pointer">
            My Skills
          </a>
          <a className="text-white border-b-2 border-transparent hover:border-brightBlue transition duration-300 cursor-pointer">
            My Projects
          </a>
          <a className="text-white border-b-2 border-transparent hover:border-brightBlue transition duration-300 cursor-pointer">
            Contact Me
          </a>
        </div>
      </div>

      {/* Right */}
      <div className="hidden lg:flex items-center">
        <div className="flex items-center gap-2 border-b-2 border-transparent transition duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
            />
          </svg>
          <a className="text-white">My Github</a>
        </div>
      </div>
    </div>
  );
}
