import { Disclosure } from "@headlessui/react";
import NavBarDesktop from "./NavBarDesktop";
import NavBarMobile from "./NavBarMobile";

export default function NavBar() {
  return (
    <Disclosure
      as="nav"
      className="nav fixed top-0 left-0 right-0 z-50 bg-inkBlack"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <NavBarDesktop />
          </div>

          <NavBarMobile open={open} />
        </>
      )}
    </Disclosure>
  );
}
