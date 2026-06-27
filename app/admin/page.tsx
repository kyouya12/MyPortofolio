import { createClient } from '@/utils/supabase/server';
import { Code, FolderGit2, User, ChevronRight, Activity, Database, Key, Globe, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch actual counts from Supabase dynamically
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  let expCount = 0;
  try {
    const { count } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true });
    expCount = count || 0;
  } catch (e) {
    // Fallback if experiences table does not exist in schema yet
  }

  const menuItems = [
    {
      title: 'Manage Projects',
      description: 'Tambah, edit, dan hapus proyek portofolio Anda.',
      icon: FolderGit2,
      href: '/admin/projects',
      count: `${projectCount || 0} Projects`,
      color: 'text-brand border-brand/20 bg-brand/5'
    },
    {
      title: 'Manage Experiences',
      description: 'Atur riwayat pengalaman magang, detail info dinamis, dan dokumentasi.',
      icon: Briefcase,
      href: '/admin/experiences',
      count: `${expCount} Experiences`,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
    },
    {
      title: 'Manage Skills',
      description: 'Atur keahlian, teknologi, dan tingkat kemahiran.',
      icon: Code,
      href: '/admin/skills',
      count: '0 Skills',
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5'
    },
    {
      title: 'About Me Settings',
      description: 'Ubah informasi personal, bio, dan foto profil.',
      icon: User,
      href: '/admin/about',
      count: 'Active',
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5'
    },
    {
      title: 'Contact Settings',
      description: 'Kelola media sosial dan tautan kontak halaman Contact.',
      icon: Globe,
      href: '/admin/contact',
      count: 'Active',
      color: 'text-pink-400 border-pink-500/20 bg-pink-500/5'
    }
  ];

  return (
    <div className="space-y-8 flex-grow flex flex-col justify-between">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Selamat Datang Kembali, <span className="text-brand">Admin</span>!
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl">
            Di sini Anda dapat mengelola seluruh konten website portofolio secara real-time. Gunakan menu navigasi di sebelah kiri atau tombol pintasan di bawah untuk mulai mengedit.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* System Status / Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] font-mono tracking-wider uppercase text-text-secondary">Sistem</span>
            <span className="block text-sm font-bold text-white">Online & Aktif</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20">
          <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] font-mono tracking-wider uppercase text-text-secondary">Database</span>
            <span className="block text-sm font-bold text-white">Supabase Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] font-mono tracking-wider uppercase text-text-secondary">Akses</span>
            <span className="block text-sm font-bold text-white truncate max-w-[150px]">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-grow py-4">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group relative border border-white/5 rounded-2xl p-6 bg-black/20 transition-all duration-300 hover:border-brand/20 hover:bg-black/30 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5 text-text-secondary">
                    {item.count}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-white transition-colors cursor-pointer"
                >
                  <span>Buka Menu</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
