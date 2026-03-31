export default function ContactMeSection() {
  return (
    <section className="w-full min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden px-4 sm:px-6 relative z-10 bg-gradient-to-b from-[inkBlack] via-deepSpaceBlue to-[inkBlack]">
      <div className="ContactMe-Content w-full max-w-3xl flex flex-col justify-center min-h-0">
        <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-left">
            Contact
            <span className="text-brightBlue font-extrabold italic"> Me</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-left pt-2 md:pt-3 ">
            I’m always happy to connect! If you’d like to see more of my work,
            discuss opportunities, or just say hello, feel free to get in touch.
          </p>

          {/* NAME */}
          <div className="mt-5 md:mt-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white text-left"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-gray-300 
             outline-1 -outline-offset-1 outline-white/10 
             placeholder:text-gray-500 
             focus:outline-2 focus:-outline-offset-2 
             focus:outline-brightBlue 
             sm:text-sm"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="mt-4 md:mt-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white text-left"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-gray-300 
             outline-1 -outline-offset-1 outline-white/10 
             placeholder:text-gray-500 
             focus:outline-2 focus:-outline-offset-2 
             focus:outline-brightBlue 
             sm:text-sm"
              />
            </div>
          </div>

          {/* MESSAGE */}
          <div className="mt-4 md:mt-5">
            <label
              htmlFor="yourMessage"
              className="block text-sm font-medium text-white text-left"
            >
              Your Message
            </label>
            <div className="mt-2">
              <textarea
                id="yourMessage"
                name="yourMessage"
                rows={3}
                placeholder="Your Message"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-gray-300 
             outline-1 -outline-offset-1 outline-white/10 
             placeholder:text-gray-500 
             focus:outline-2 focus:-outline-offset-2 
             focus:outline-brightBlue 
             sm:text-sm resize-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-yaleBlue px-6 sm:px-8 py-2 text-sm font-semibold text-white hover:bg-brightBlue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
