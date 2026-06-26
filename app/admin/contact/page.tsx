import React from 'react';
import { getSocialLinks } from './actions';
import ContactForm from './ContactForm';
import { Globe } from 'lucide-react';

export default async function AdminContactPage() {
  // Fetch initial social links data from Supabase
  const res = await getSocialLinks();
  const initialLinks = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-8 flex-grow flex flex-col justify-start">
      
      {/* Title Header Banner */}
      <div className="pb-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5 text-brand-500 font-mono text-xs tracking-wider uppercase font-semibold">
          <Globe className="w-4 h-4" />
          <span>Pengaturan Konten</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1.5 select-none">
          Contact Settings
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1 select-none">
          Kelola tautan media sosial dan informasi kontak yang tampil pada halaman portofolio Contact Anda.
        </p>
      </div>

      {/* Render Contact CRUD Form */}
      <ContactForm initialLinks={initialLinks} />

    </div>
  );
}
