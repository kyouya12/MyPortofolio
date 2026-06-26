'use client';

import React, { useState, useTransition } from 'react';
import { 
  SocialLink, 
  addSocialLink, 
  updateSocialLink, 
  deleteSocialLink 
} from './actions';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  ExternalLink,
  Mail,
  Globe
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from '@/components/BrandIcons';

interface ContactFormProps {
  initialLinks: SocialLink[];
}

// Map icon types to Lucide Icons & Custom SVG Icons
export const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  whatsapp: WhatsappIcon,
  globe: Globe
};

export const IconLabelMap: Record<string, string> = {
  mail: 'Gmail / Email',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter / X',
  whatsapp: 'WhatsApp',
  globe: 'Website Lain'
};

export default function ContactForm({ initialLinks }: ContactFormProps) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  // Form Fields State
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [iconType, setIconType] = useState('globe');
  const [url, setUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);

  const openAddForm = () => {
    setEditingLink(null);
    setPlatform('');
    setUsername('');
    setIconType('globe');
    setUrl('');
    setOrderIndex(links.length > 0 ? Math.max(...links.map(l => l.order_index)) + 1 : 0);
    setIsFormOpen(true);
    setStatus({ type: null, message: '' });
  };

  const openEditForm = (link: SocialLink) => {
    setEditingLink(link);
    setPlatform(link.platform);
    setUsername(link.username);
    setIconType(link.icon_type);
    setUrl(link.url);
    setOrderIndex(link.order_index);
    setIsFormOpen(true);
    setStatus({ type: null, message: '' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingLink(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (!platform.trim() || !username.trim() || !url.trim()) {
      setStatus({ type: 'error', message: 'Platform, Username, dan URL harus diisi.' });
      return;
    }

    const formData = new FormData();
    formData.append('platform', platform.trim());
    formData.append('username', username.trim());
    formData.append('icon_type', iconType);
    formData.append('url', url.trim());
    formData.append('order_index', orderIndex.toString());

    startTransition(async () => {
      let res;
      if (editingLink) {
        res = await updateSocialLink(editingLink.id, formData);
      } else {
        res = await addSocialLink(formData);
      }

      if (res.success) {
        setStatus({
          type: 'success',
          message: editingLink 
            ? 'Media sosial berhasil diperbarui!' 
            : 'Media sosial baru berhasil ditambahkan!',
        });
        
        // Refresh local links state by re-querying or appending
        // For simple state management, we can build the new/updated object
        // but fetching fresh data is best. Since we revalidatePath on server,
        // we can just reload the window or manually patch the state to stay responsive:
        if (editingLink) {
          setLinks(prev => prev.map(l => l.id === editingLink.id 
            ? { ...l, platform, username, icon_type: iconType, url, order_index: Number(orderIndex) }
            : l
          ).sort((a,b) => a.order_index - b.order_index));
        } else {
          // Simple temporary reload or manually update list with fake random ID just to show it
          // Real reload is cleaner or let the user refresh.
          window.location.reload();
        }
        closeForm();
      } else {
        setStatus({
          type: 'error',
          message: res.error || 'Terjadi kesalahan saat menyimpan.',
        });
      }
    });
  };

  // Delete Handler
  const handleDelete = (id: string, platformName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus media sosial ${platformName}?`)) {
      return;
    }
    
    setStatus({ type: null, message: '' });

    startTransition(async () => {
      const res = await deleteSocialLink(id);
      if (res.success) {
        setStatus({
          type: 'success',
          message: `Berhasil menghapus ${platformName}!`,
        });
        setLinks(prev => prev.filter(l => l.id !== id));
      } else {
        setStatus({
          type: 'error',
          message: res.error || 'Gagal menghapus media sosial.',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Add Button */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Kelola Media Sosial Halaman Contact</h2>
          <p className="text-text-secondary text-sm">Tambahkan, edit, atau hapus media sosial yang akan tampil di halaman portofolio.</p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center gap-2 py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(70,95,255,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sosmed</span>
        </button>
      </div>

      {/* Action Banners */}
      {status.type === 'success' && (
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-sm font-semibold flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {status.type === 'error' && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {/* Cards List Grid */}
      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-800 rounded-2xl bg-gray-900/30 text-center space-y-3">
          <Globe className="w-12 h-12 text-gray-700" />
          <div className="space-y-1">
            <h4 className="text-white font-bold">Belum Ada Media Sosial</h4>
            <p className="text-gray-500 text-sm max-w-xs">Silakan tambahkan media sosial pertama Anda menggunakan tombol di atas.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => {
            const Icon = IconMap[link.icon_type] || Globe;
            return (
              <div 
                key={link.id} 
                className="flex items-center justify-between border border-gray-800 bg-gray-900 p-5 rounded-2xl group hover:border-brand-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-brand-500 group-hover:border-brand-500/20 transition-all flex-shrink-0">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">{link.platform}</span>
                      <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700 font-mono">Index: {link.order_index}</span>
                    </div>
                    <span className="text-base text-white font-semibold block truncate">{link.username}</span>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-brand-500 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span className="truncate max-w-[200px]">{link.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Edit & Delete Action Panel */}
                <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                  <button
                    type="button"
                    onClick={() => openEditForm(link)}
                    className="p-2.5 rounded-lg border border-gray-800 hover:border-blue-500/30 hover:bg-blue-500/5 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(link.id, link.platform)}
                    disabled={isPending}
                    className="p-2.5 rounded-lg border border-gray-800 hover:border-red-500/30 hover:bg-red-500/5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                    title="Hapus Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal Window (Form Overlay) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-950/40">
              <h3 className="text-lg font-bold text-white">
                {editingLink ? `Edit Media Sosial: ${editingLink.platform}` : 'Tambah Media Sosial Baru'}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
              
              {/* Row 1: Platform Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Nama Aplikasi / Website
                </label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="Contoh: Instagram, GitHub, WhatsApp, Portofolio"
                  className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Row 2: Account Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Nama Akun / Username / Email / Nomor
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: @username, email@gmail.com, 0812xxxx"
                  className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Row 3: URL Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  URL Tujuan (Link)
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Contoh: https://instagram.com/..., mailto:..., https://wa.me/..."
                  className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                  required
                />
                <span className="block text-[11px] text-gray-500 leading-normal">
                  Pastikan URL diawali dengan protokoler lengkap seperti `https://`, `http://`, atau `mailto:`.
                </span>
              </div>

              {/* Row 4: Icon & Sort Order (Two Columns) */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Icon Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Pilihan Icon
                  </label>
                  <select
                    value={iconType}
                    onChange={(e) => setIconType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors cursor-pointer h-12"
                  >
                    {Object.keys(IconLabelMap).map((key) => (
                      <option key={key} value={key} className="bg-gray-900">
                        {IconLabelMap[key]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Sort Order Index */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Index Urutan
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors h-12"
                  />
                </div>

              </div>

              {/* Submit Buttons Row */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="py-3 px-5 border border-gray-800 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 py-3 px-6 bg-brand-500 hover:bg-brand-600 rounded-xl text-white font-bold text-sm transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-[0_4px_12px_rgba(70,95,255,0.2)]"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Link</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
