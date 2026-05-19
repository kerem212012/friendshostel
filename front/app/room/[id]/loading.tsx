export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <main className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          {/* Title skeleton */}
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-2/3"></div>

          {/* Description skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
          </div>

          {/* Characteristics card skeleton */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Links skeleton */}
          <div className="flex gap-4">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
          </div>
        </div>
      </main>
    </div>
  );
}