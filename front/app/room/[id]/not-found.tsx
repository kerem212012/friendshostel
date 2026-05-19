import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold mb-4 text-black dark:text-white">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          Room not found
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300 mb-8">
          Unfortunately, a room with this ID does not exist or has been deleted.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
