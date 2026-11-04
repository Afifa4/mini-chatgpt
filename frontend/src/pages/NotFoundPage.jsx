import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 text-[#ececec]">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-[#424242]">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-[#b4b4b4]">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#d9d9d9]"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
