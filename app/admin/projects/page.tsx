import React from 'react';
import { getProjects } from './actions';
import ProjectForm from './ProjectForm';
import { FolderGit2 } from 'lucide-react';

export default async function AdminProjectsPage() {
  // Fetch initial projects data from Supabase
  const res = await getProjects();
  const initialProjects = res.success && res.data ? res.data : [];

  return (
    <div className="space-y-8 flex-grow flex flex-col justify-start">
      
      {/* Title Header Banner */}
      <div className="pb-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5 text-brand-500 font-mono text-xs tracking-wider uppercase font-semibold">
          <FolderGit2 className="w-4 h-4" />
          <span>Pengaturan Konten</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1.5 select-none">
          Projects Settings
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1 select-none">
          Kelola portofolio proyek-proyek utama Anda, termasuk judul, deskripsi, tautan repositori, dan foto mockup.
        </p>
      </div>

      {/* Render Project CRUD Form */}
      <ProjectForm initialProjects={initialProjects} />

    </div>
  );
}
