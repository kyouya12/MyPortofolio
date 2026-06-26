import { login } from './actions';
import { Shield } from 'lucide-react';

interface SearchParams {
  error?: string;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error;

  return (
    <section className="flex-1 flex items-center justify-center min-h-[calc(100vh-160px)] py-12">
      <div className="w-full max-w-md p-8 md:p-10 rounded-[2rem] border border-gray-800 bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
        
        {/* Header Form */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 text-brand-500 shadow-[0_0_15px_rgba(70,95,255,0.1)]">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white select-none">
            Admin <span className="text-brand-500">Login</span>
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            Autentikasi diperlukan untuk mengakses halaman dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium">
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Login Form */}
        <form action={login} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold tracking-wide text-text-secondary"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="admin@email.com"
              className="w-full px-5 py-3.5 rounded-[1.25rem] border border-gray-800 bg-gray-950/40 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold tracking-wide text-text-secondary"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="••••••••"
              className="w-full px-5 py-3.5 rounded-[1.25rem] border border-gray-800 bg-gray-950/40 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-[1.25rem] bg-brand-500 hover:bg-brand-600 text-white font-bold tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(70,95,255,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-4 border border-transparent"
          >
            Masuk ke Dashboard
          </button>
        </form>

      </div>
    </section>
  );
}
