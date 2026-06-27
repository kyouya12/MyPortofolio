import React from 'react';
import { getExperiences } from './actions';
import ExperienceForm from './ExperienceForm';
import { Briefcase } from 'lucide-react';

export default async function AdminExperiencesPage() {
  // Fetch initial experiences data from Supabase
  const res = await getExperiences();
  const initialExperiences = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-8 flex-grow flex flex-col justify-start">
      
      {/* Title Header Banner */}
      <div className="pb-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5 text-brand-500 font-mono text-xs tracking-wider uppercase font-semibold">
          <Briefcase className="w-4 h-4" />
          <span>Pengaturan Konten</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1.5 select-none">
          Experiences Settings
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1 select-none">
          Kelola portofolio pengalaman (magang) Anda, termasuk detail informasi dinamis, keahlian yang dipelajari, dan dokumentasi terkait.
        </p>
      </div>

      {/* Render Experience CRUD Form */}
      <ExperienceForm initialExperiences={initialExperiences} />

    </div>
  );
}
