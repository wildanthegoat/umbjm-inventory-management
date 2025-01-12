import { useRouter } from "next/router";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-md mx-auto">
        <p className="text-9xl font-extrabold text-gray-800">401</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          Unauthorized Access
        </h1>
        <p className="mt-4 text-gray-600">
          You do not have permission to access this page. Please go back or contact support if you believe this is an error.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
