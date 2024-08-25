export default function HomeBanner() {
    return (
      <div className="h-screen w-screen relative">
        <img
          className="w-full h-full"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/b2c3e95b-b7b5-4bb7-a883-f4bfc7472fb7/19fc1a4c-82db-4481-ad08-3a1dffbb8c39/IN-en-20240805-POP_SIGNUP_TWO_WEEKS-perspective_WEB_24a485f6-1820-42be-9b60-1b066f1eb869_large.jpg"
          alt=""
        />
        <div className="absolute h-full w-full bg-black bg-opacity-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white font-bold text-5xl">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-white text-3xl mt-3">
              Watch anywhere, Cancel anytime
            </p>
            <div className="mt-8">
              <a
                href="/login"
                className="bg-red-700 mt-8 text-white p-4 px-16 text-lg rounded font-semibold"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }