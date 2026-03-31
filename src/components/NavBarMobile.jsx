import { Fragment, useState, useEffect } from "react";
import {
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "../assets/logo.png";

export default function NavBarMobile({ open }) {
  const [activeLink, setActiveLink] = useState("");

  const links = [
    {
      label: "Home",
      path: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      ),
    },
    {
      label: "About Me",
      path: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      ),
    },
    {
      label: "My Skills",
      path: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      ),
    },
    {
      label: "My Projects",
      path: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
        />
      ),
    },
    {
      label: "Contact Me",
      path: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      ),
    },
    {
      label: "My GitHub",
      path: (
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      ),
    },
  ];

  useEffect(() => {
    if (!open) return;

    console.log(`Mobile Sidebar is open ${open}`);

    let gsapScope;
    let timeout;

    timeout = setTimeout(() => {
      const links = document.querySelectorAll(".mobileNav-links");
      if (!links.length) return;

      gsapScope = gsap.context(() => {
        gsap.killTweensOf(links);

        gsap.to(links, {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.1,
          ease: "power2.out",
        });
      });
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (gsapScope) gsapScope.revert();
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button (closed state) */}
      {!open && (
        <div className="fixed top-4 right-4 z-50 lg:hidden">
          <DisclosureButton className="p-2 rounded-md hover:text-white">
            <Bars3Icon className="size-6" />
          </DisclosureButton>
        </div>
      )}

      {/* Sidebar + backdrop with animation */}
      <Transition
        as={Fragment}
        show={open}
        enter="transition duration-300 ease-out"
        enterFrom="-translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition duration-300 ease-in"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="-translate-x-full opacity-0"
      >
        <DisclosurePanel className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-70"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-70"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-inkDarkLightBlack/70" />
          </Transition.Child>

          {/* Sidebar */}
          <Transition.Child
            as={Fragment}
            enter="transition transform duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition transform duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative w-4/6 sm:w-2/4 md:w-2/5 bg-inkBlack flex flex-col">
              {/* Sidebar header */}
              <div className="flex items-center gap-2 p-4">
                <img src={Logo} className="size-6" />
                <p className="text-white font-bold text-2xl">Seun</p>
              </div>

              {/* Menu links */}

              <nav className="flex-1 space-y-1 px-4">
                {links.map(({ label, path }) => (
                  <a
                    key={label}
                    onClick={() => setActiveLink(label)}
                    style={{ opacity: 0, transform: "translateY(120px)" }}
                    className={`mobileNav-links flex items-center gap-2 pl-2 py-2 text-base font-bold cursor-pointer border-l-4 transition-all duration-550
  bg-gradient-to-r from-inkDarkLightBlack to-transparent bg-no-repeat
  ${
    activeLink === label
      ? "border-4-yaleBlue text-white bg-[length:100%_100%]"
      : "border-l-transparent text-white bg-[length:0%_100%]"
  }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 shrink-0"
                    >
                      {path}
                    </svg>
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </Transition.Child>
        </DisclosurePanel>
      </Transition>

      {/* X button (open state, fixed right) */}
      {open && (
        <div className="fixed top-4 right-4 z-50 lg:hidden">
          <DisclosureButton className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
            <XMarkIcon className="size-6" onClick={() => setActiveLink("")} />
          </DisclosureButton>
        </div>
      )}
    </>
  );
}
