import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AboutForm from './AboutForm';
import { User } from 'lucide-react';

export default async function AdminAboutPage() {
  const supabase = await createClient();

  // Fetch bio details from Supabase database profiles table
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', 'default_profile')
    .single();

  // Set default fallback details
  const initialData = {
    bio: profileData?.bio || 'Tuliskan biografi singkat Anda di sini...',
    avatar_url: profileData?.avatar_url || '/profile.jpg',
  };

  return (
    <div className="space-y-8 flex-grow flex flex-col justify-start">
      
      {/* Title Header Banner */}
      <div className="pb-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5 text-brand-500 font-mono text-xs tracking-wider uppercase font-semibold">
          <User className="w-4 h-4" />
          <span>Pengaturan Konten</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1.5 select-none">
          About Me Settings
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1 select-none">
          Kelola isi halaman "About Me" Anda dengan memperbarui deskripsi biografi dan foto profil utama.
        </p>
      </div>

      {/* Render About Form Component */}
      <AboutForm initialData={initialData} />

    </div>
  );
}
