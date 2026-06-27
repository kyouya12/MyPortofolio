'use client';

import React, { useState, useTransition } from 'react';
import { 
  ExperienceItem, 
  ExperienceDetail, 
  addExperience, 
  updateExperience, 
  deleteExperience 
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
  Briefcase,
  PlusCircle,
  Eye,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface ExperienceFormProps {
  initialExperiences: ExperienceItem[];
}

const GRADIENT_OPTIONS = [
  { name: 'Brand & Indigo (Default)', value: 'from-brand/10 to-indigo-950/20' },
  { name: 'Emerald & Brand', value: 'from-emerald-950/20 to-brand/10' },
  { name: 'Purple & Brand', value: 'from-purple-950/30 to-brand/5' },
  { name: 'Blue & Brand', value: 'from-blue-950/20 to-brand/10' },
  { name: 'Pink & Brand', value: 'from-pink-950/30 to-brand/5' },
  { name: 'Rose & Brand', value: 'from-rose-950/30 to-brand/10' },
  { name: 'Amber & Brand', value: 'from-amber-950/30 to-brand/5' },
  { name: 'Fuchsia & Brand', value: 'from-fuchsia-950/30 to-brand/10' },
  { name: 'Cyan & Brand', value: 'from-cyan-950/30 to-brand/15' },
  { name: 'Lime & Brand', value: 'from-lime-950/30 to-brand/20' },
];

export default function ExperienceForm({ initialExperiences }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [details, setDetails] = useState<ExperienceDetail[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [docs, setDocs] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showDocs, setShowDocs] = useState(false);

  // Helpers for editing dynamic arrays
  const [newSkill, setNewSkill] = useState('');

  const openAddForm = () => {
    setEditingExperience(null);
    setTitle('');
    setOrderIndex(experiences.length > 0 ? Math.max(...experiences.map(e => e.order_index)) + 1 : 1);
    setDetails([
      { key: 'Lokasi', value: '' },
      { key: 'Bidang', value: '' },
      { key: 'Jadwal', value: '' }
    ]);
    setSkills([]);
    setDocs([]);
    setSelectedFiles([]);
    setShowDocs(false);
    setIsFormOpen(true);
    setStatus({ type: null, message: '' });
  };

  const openEditForm = (exp: ExperienceItem) => {
    setEditingExperience(exp);
    setTitle(exp.title);
    setOrderIndex(exp.order_index);
    setDetails((exp.details || []).filter(d => !d.key.startsWith('__')));
    setSkills(exp.skills || []);
    setDocs(exp.docs || []);
    setSelectedFiles([]);
    setShowDocs(exp.show_docs || false);
    setIsFormOpen(true);
    setStatus({ type: null, message: '' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExperience(null);
  };

  // Detail item management
  const handleDetailChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...details];
    updated[index][field] = val;
    setDetails(updated);
  };

  const addDetailRow = () => {
    setDetails([...details, { key: '', value: '' }]);
  };

  const removeDetailRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  // Skills management
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // File Select & Deletion management
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const removeExistingDoc = (urlToRemove: string) => {
    setDocs(docs.filter(url => url !== urlToRemove));
  };

  const removeSelectedFile = (indexToRemove: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== indexToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (!title.trim()) {
      setStatus({ type: 'error', message: 'Judul pengalaman (nama magang) wajib diisi.' });
      return;
    }

    if (showDocs && (docs.length + selectedFiles.length) === 0) {
      setStatus({ type: 'error', message: 'Jika Dokumentasi diaktifkan, minimal harus mengunggah 1 foto dokumentasi.' });
      return;
    }

    // Filter out details with empty keys
    const filteredDetails = details.filter(d => d.key.trim() !== '');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('order_index', orderIndex.toString());
    formData.append('details', JSON.stringify(filteredDetails));
    formData.append('skills', JSON.stringify(skills));
    formData.append('existing_docs', JSON.stringify(docs));
    formData.append('show_docs', showDocs.toString());

    // Append new files
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    startTransition(async () => {
      let res;
      if (editingExperience) {
        res = await updateExperience(editingExperience.id, formData);
      } else {
        res = await addExperience(formData);
      }

      if (res.success) {
        setStatus({
          type: 'success',
          message: editingExperience 
            ? 'Pengalaman berhasil diperbarui!' 
            : 'Pengalaman baru berhasil ditambahkan!',
        });
        
        // Reload page to fetch updated SSR state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        closeForm();
      } else {
        setStatus({
          type: 'error',
          message: res.error || 'Terjadi kesalahan saat menyimpan data.',
        });
      }
    });
  };

  // Delete Handler
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengalaman "${name}"?`)) {
      setStatus({ type: null, message: '' });
      startTransition(async () => {
        const res = await deleteExperience(id);
        if (res.success) {
          setStatus({ type: 'success', message: `Pengalaman "${name}" berhasil dihapus!` });
          setExperiences(experiences.filter(e => e.id !== id));
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setStatus({ type: 'error', message: res.error || 'Gagal menghapus data.' });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Status Notification */}
      {status.type && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 select-none animate-fadeIn ${
          status.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-sm block">
              {status.type === 'success' ? 'Berhasil' : 'Kesalahan'}
            </span>
            <span className="text-xs opacity-90 mt-0.5 block leading-relaxed">{status.message}</span>
          </div>
        </div>
      )}

      {/* Control Actions Row */}
      <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-4 rounded-xl">
        <div className="text-sm font-semibold text-gray-400 select-none">
          Daftar Pengalaman ({experiences.length})
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2 border border-brand/20 bg-brand/10 hover:bg-brand/25 text-brand rounded-lg text-sm font-bold transition-all cursor-pointer hover:border-brand/40 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      {/* Grid of Experiences */}
      {experiences.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 bg-gray-900/50 rounded-2xl">
          <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Belum ada data pengalaman magang.</p>
          <p className="text-gray-600 text-xs mt-1">Klik tombol di atas untuk menambahkan pengalaman pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="border border-gray-800 bg-gray-900 rounded-2xl p-6 flex flex-col justify-between hover:border-brand/20 transition-all duration-300 group hover:bg-gray-900/80"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono bg-gray-800 border border-gray-700 text-brand px-2 py-0.5 rounded-md">
                      Order: {exp.order_index}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2 group-hover:text-brand transition-colors">
                      {exp.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditForm(exp)}
                      className="p-2 border border-gray-800 hover:border-brand-500/30 bg-gray-950 text-gray-400 hover:text-brand rounded-lg transition-all cursor-pointer hover:bg-brand-500/5"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id, exp.title)}
                      className="p-2 border border-gray-800 hover:border-red-500/30 bg-gray-950 text-gray-400 hover:text-red-400 rounded-lg transition-all cursor-pointer hover:bg-red-500/5"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details list */}
                {exp.details && exp.details.filter(d => !d.key.startsWith('__')).length > 0 && (
                  <div className="border-t border-gray-800/60 pt-3 space-y-1 text-xs text-gray-400">
                    {exp.details
                      .filter(d => !d.key.startsWith('__'))
                      .map((detail, idx) => (
                        <p key={idx} className="font-medium">
                          {detail.key} : <span className="text-gray-200">{detail.value}</span>
                        </p>
                      ))}
                  </div>
                )}

                {/* Skills list */}
                {exp.skills && exp.skills.length > 0 && (
                  <div className="border-t border-gray-800/60 pt-3">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1.5 font-bold">Skills:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} className="text-[11px] bg-black/40 border border-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mockups list */}
                <div className="border-t border-gray-800/60 pt-3 flex items-center justify-between">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 font-bold">Link Dokumentasi:</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    exp.show_docs 
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 font-semibold' 
                      : 'bg-gray-850 border-gray-800 text-gray-400 font-normal'
                  }`}>
                    {exp.show_docs ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                 {exp.show_docs && exp.docs && exp.docs.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1.5 font-bold">Foto Dokumentasi:</div>
                    <div className="grid grid-cols-4 gap-2">
                      {exp.docs.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-800 bg-black/40">
                          <img
                            src={url}
                            alt={`Dokumentasi ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Experience Form Overlay Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand" />
                <h3 className="text-xl font-bold text-white">
                  {editingExperience ? `Edit Pengalaman: ${editingExperience.title}` : 'Tambah Pengalaman Baru'}
                </h3>
              </div>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-grow p-6 space-y-8">
              
              {/* Row 1: Title and Order Index */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-gray-400 font-mono tracking-wider uppercase">
                    Judul Pengalaman / Nama Magang
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Magang 1 atau Magang Kantor Dinas"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-brand rounded-xl px-4 py-3 text-sm text-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 font-mono tracking-wider uppercase">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value, 10))}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-brand rounded-xl px-4 py-3 text-sm text-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Dynamic Info Details */}
              <div className="space-y-4 border-t border-gray-800/80 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-bold text-white">Detail Informasi</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Atur detail label seperti Lokasi, Bidang, Jadwal, Kepala Dinas, dsb.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addDetailRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-800 bg-gray-950 hover:bg-gray-800 rounded-lg text-xs font-bold text-gray-300 transition-all cursor-pointer hover:text-white"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-brand" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3 animate-slideDown">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={detail.key}
                          onChange={(e) => handleDetailChange(idx, 'key', e.target.value)}
                          placeholder="Label (misal: Lokasi, Kepala Dinas)"
                          className="w-full bg-gray-950 border border-gray-800 focus:border-brand rounded-xl px-4 py-2.5 text-xs text-white transition-all outline-none"
                        />
                        <input
                          type="text"
                          required
                          value={detail.value}
                          onChange={(e) => handleDetailChange(idx, 'value', e.target.value)}
                          placeholder="Nilai (misal: Disduk, Bpk. Andi)"
                          className="w-full bg-gray-950 border border-gray-800 focus:border-brand rounded-xl px-4 py-2.5 text-xs text-white transition-all outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDetailRow(idx)}
                        className="p-2 border border-gray-800 hover:border-red-500/30 hover:bg-red-500/5 text-gray-400 hover:text-red-400 rounded-xl cursor-pointer transition-all flex-shrink-0"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {details.length === 0 && (
                    <p className="text-xs text-gray-600 italic">Belum ada detail informasi. Klik "Tambah Baris" untuk membuat.</p>
                  )}
                </div>
              </div>

              {/* Row 3: Skills Learned (Chip/Tags Interface) */}
              <div className="space-y-4 border-t border-gray-800/80 pt-6">
                <div>
                  <h4 className="text-base font-bold text-white">Skill yang Dipelajari</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Tambahkan keahlian atau materi yang dikuasai selama masa magang.</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Masukkan skill baru (contoh: public speaking, Next.js)"
                    className="flex-grow bg-gray-950 border border-gray-800 focus:border-brand rounded-xl px-4 py-2.5 text-xs text-white transition-all outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                          setSkills([...skills, newSkill.trim()]);
                          setNewSkill('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => handleAddSkill(e)}
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white rounded-xl cursor-pointer transition-all border border-gray-700 hover:border-gray-600"
                  >
                    Tambah
                  </button>
                </div>

                {/* Displaying Skills Badges */}
                <div className="flex flex-wrap gap-2 p-3 border border-gray-800 bg-gray-950/40 rounded-xl min-h-[50px] items-center">
                  {skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center gap-1.5 text-xs bg-gray-900 border border-gray-800 text-white pl-3 pr-2 py-1 rounded-full group hover:border-brand/40"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-gray-500 hover:text-red-400 p-0.5 rounded-full hover:bg-gray-800 cursor-pointer"
                        title="Hapus"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-xs text-gray-600 italic">Belum ada skill yang ditambahkan. Ketik dan tekan Enter.</span>
                  )}
                </div>
              </div>

              {/* Row 4: Mockups Documentation List */}
              <div className="space-y-4 border-t border-gray-800/80 pt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white">Dokumentasi Foto Magang</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Unggah foto atau bukti kegiatan Anda selama masa magang.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2.5 text-xs font-bold text-gray-300 cursor-pointer select-none bg-gray-950 border border-gray-800 px-3.5 py-2 rounded-xl hover:border-brand/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={showDocs}
                        onChange={(e) => {
                          setShowDocs(e.target.checked);
                        }}
                        className="w-4 h-4 accent-brand rounded border-gray-800 bg-gray-950 focus:ring-0 cursor-pointer"
                      />
                      <span>Aktifkan Link Dokumentasi</span>
                    </label>

                    {showDocs && (
                      <label className="flex items-center gap-1.5 px-3 py-1.5 border border-brand/20 bg-brand/10 hover:bg-brand/25 text-brand rounded-lg text-xs font-bold transition-all cursor-pointer hover:border-brand/40 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Foto</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {showDocs ? (
                  <div className="space-y-4">
                    {/* Image Previews Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-gray-800 bg-gray-950/45 rounded-2xl min-h-[120px]">
                      
                      {/* Retained database images */}
                      {docs.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-800 bg-gray-950 flex items-center justify-center">
                          <img
                            src={url}
                            alt={`Dokumentasi ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingDoc(url)}
                            className="absolute top-2 right-2 p-1.5 bg-black/70 border border-white/10 hover:border-red-500/30 text-white hover:text-red-400 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                            title="Hapus Foto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Newly selected files */}
                      {selectedFiles.map((file, idx) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                          <div key={`new-${idx}`} className="relative group aspect-video rounded-xl overflow-hidden border border-brand/25 bg-gray-950 flex items-center justify-center">
                            <img
                              src={previewUrl}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute top-2 left-2 text-[9px] font-bold font-mono bg-brand text-black px-1.5 py-0.5 rounded uppercase">
                              Baru
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(idx)}
                              className="absolute top-2 right-2 p-1.5 bg-black/70 border border-white/10 hover:border-red-500/30 text-white hover:text-red-400 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                              title="Hapus Foto"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}

                      {docs.length === 0 && selectedFiles.length === 0 && (
                        <div className="col-span-full flex flex-col justify-center items-center py-6 text-gray-500">
                          <ImageIcon className="w-8 h-8 text-gray-700 mb-1" />
                          <p className="text-xs italic">Belum ada foto dokumentasi magang yang dipilih.</p>
                          <p className="text-[10px] text-gray-600 mt-0.5">Klik "Pilih Foto" di atas (minimal 1 foto).</p>
                        </div>
                      )}

                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-gray-800 bg-gray-950/20 rounded-2xl text-center select-none text-xs text-gray-500 py-8">
                    Link dokumentasi dinonaktifkan untuk pengalaman ini. Tombol "Dokumentasi" tidak akan muncul di halaman utama portofolio.
                  </div>
                )}
              </div>

              {/* Form Actions footer */}
              <div className="border-t border-gray-800 pt-6 flex justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-sm font-bold cursor-pointer transition-all hover:bg-gray-800/30"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand/90 text-black rounded-xl text-sm font-black shadow-[0_4px_15px_rgba(140,255,0,0.15)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
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
