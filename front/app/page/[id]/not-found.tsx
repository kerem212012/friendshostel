import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-black dark:text-white">404</h1>
        <h2 className="text-2xl mb-4 text-zinc-700 dark:text-zinc-300">
          Page Not Found
        </h2>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/front/public"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
