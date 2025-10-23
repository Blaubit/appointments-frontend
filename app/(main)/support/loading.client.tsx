// Reutiliza el SSR skeleton, pero podrías animar diferente o cambiar color.
export default function SupportClientLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded bg-gray-100 dark:bg-gray-800 p-6 space-y-3"
          >
            <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
