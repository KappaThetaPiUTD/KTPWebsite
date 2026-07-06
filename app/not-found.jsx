import Link from "next/link";

export const metadata = {
  title: "Kappa Theta Pi UTD - Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
      <div className="text-primary text-7xl sm:text-8xl mb-4">𝚱𝚯𝚷</div>
      <h1 className="text-primary font-poppins font-bold text-5xl sm:text-6xl mb-4">
        404
      </h1>
      <h2 className="text-black font-poppins text-2xl sm:text-3xl font-semibold mb-3">
        Page not found
      </h2>
      <p className="text-black/70 max-w-md mb-8">
        Sorry, we couldn&apos;t find the page you were looking for. It may have
        been moved or no longer exists.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-lg font-poppins hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
        <Link
          href="/recruitment"
          className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-poppins hover:bg-primary hover:text-white transition-colors"
        >
          Join KTP
        </Link>
      </div>
    </div>
  );
}
