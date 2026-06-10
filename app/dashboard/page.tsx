import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white px-4">
      <h1 className="text-4xl font-semibold mb-4">About page</h1>
      <p className="text-lg max-w-2xl text-center mb-6">
        This route is served from <code>app/about/page.tsx</code> and maps to <code>/about</code>.
      </p>
      <Link href="/" className="rounded-md bg-slate-900 text-white px-5 py-2 hover:bg-slate-700 transition">
        Back to home
      </Link>
    </div>
  );
}
