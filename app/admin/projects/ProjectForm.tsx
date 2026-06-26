'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { 
  ProjectItem, 
  addProject, 
  updateProject, 
  deleteProject 
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
  FolderGit2,
  Image as ImageIcon,
  Upload,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette
} from 'lucide-react';

interface ProjectFormProps {
  initialProjects: ProjectItem[];
}

export default function ProjectForm({ initialProjects }: ProjectFormProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync editor content when modal opens or active project changes
  useEffect(() => {
    if (isFormOpen && editorRef.current) {
      editorRef.current.innerHTML = editingProject ? editingProject.description : '';
    }
  }, [isFormOpen, editingProject]);

  const openAddForm = () => {
    setEditingProject(null);
    setTitle('');
    setRepoUrl('');
    setOrderIndex(projects.length > 0 ? Math.max(...projects.map(p => p.order_index)) + 1 : 0);
    setImagePreview(null);
    setSelectedFile(null);
    setIsFormOpen(true);
    setStatus({ type: null, message: '' });
  };

  const openEditForm = (project: ProjectItem) => {
    setEditingProject(project);
    setTitle(project.title);
    setRepoUrl(project.repo_url);
    setOrderIndex(project.order_index);
    setImagePreview(project.image_url);
    setSelectedFile(null);
    setIsFormOpen(true);
    setStatus({ type: null, message: '' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const execEditorCommand = (command: string, value: string = '') => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    const descriptionHtml = editorRef.current ? editorRef.current.innerHTML : '';

    if (!title.trim() || !descriptionHtml.trim() || descriptionHtml === '<br>') {
      setStatus({ type: 'error', message: 'Judul, deskripsi, dan URL repositori wajib diisi.' });
      return;
    }

    if (!repoUrl.trim()) {
      setStatus({ type: 'error', message: 'URL repositori wajib diisi.' });
      return;
    }

    if (!editingProject && !selectedFile) {
      setStatus({ type: 'error', message: 'Anda harus memilih/mengunggah gambar untuk proyek baru.' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', descriptionHtml);
    formData.append('repo_url', repoUrl.trim());
    formData.append('order_index', orderIndex.toString());
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    if (editingProject) {
      formData.append('current_image_url', editingProject.image_url);
    }

    startTransition(async () => {
      let res;
      if (editingProject) {
        res = await updateProject(editingProject.id, formData);
      } else {
        res = await addProject(formData);
      }

      if (res.success) {
        setStatus({
          type: 'success',
          message: editingProject 
            ? 'Proyek portofolio berhasil diperbarui!' 
            : 'Proyek portofolio baru berhasil ditambahkan!',
        });
        
        window.location.reload();
        closeForm();
      } else {
        setStatus({
          type: 'error',
          message: res.error || 'Terjadi kesalahan saat menyimpan.',
        });
      }
    });
  };

  const handleDelete = (id: string, projectTitle: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${projectTitle}"?`)) {
      return;
    }
    
    setStatus({ type: null, message: '' });

    startTransition(async () => {
      const res = await deleteProject(id);
      if (res.success) {
        setStatus({
          type: 'success',
          message: `Berhasil menghapus proyek "${projectTitle}"!`,
        });
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        setStatus({
          type: 'error',
          message: res.error || 'Gagal menghapus proyek.',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Add Button */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Kelola Proyek Portofolio</h2>
          <p className="text-text-secondary text-sm">Tambahkan, edit, atau hapus proyek utama yang akan tampil di slider halaman depan.</p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center gap-2 py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(70,95,255,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek</span>
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
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-800 rounded-2xl bg-gray-900/30 text-center space-y-3">
          <FolderGit2 className="w-12 h-12 text-gray-700" />
          <div className="space-y-1">
            <h4 className="text-white font-bold">Belum Ada Proyek</h4>
            <p className="text-gray-500 text-sm max-w-xs">Silakan tambahkan proyek pertunjukan pertama Anda menggunakan tombol di atas.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            return (
              <div 
                key={project.id} 
                className="flex flex-col border border-gray-800 bg-gray-900 rounded-3xl overflow-hidden group hover:border-brand-500/30 transition-all duration-300"
              >
                {/* Project Image Header */}
                <div className="relative h-48 bg-gray-950 flex items-center justify-center overflow-hidden border-b border-gray-800">
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  ) : (
                    <FolderGit2 className="w-12 h-12 text-gray-800" />
                  )}
                  <div className="absolute top-3 right-3 bg-gray-950/80 border border-gray-800 text-[10px] text-gray-400 px-2 py-0.5 rounded-full font-mono font-bold">
                    Index: {project.order_index}
                  </div>
                </div>

                {/* Project Text Body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-500 transition-colors">{project.title}</h3>
                    <div 
                      className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3 max-h-[60px] overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                    <a 
                      href={project.repo_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-brand-500 hover:underline flex items-center gap-1"
                    >
                      <span className="truncate max-w-[180px]">{project.repo_url}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditForm(project)}
                        className="p-2 rounded-lg border border-gray-800 hover:border-blue-500/30 hover:bg-blue-500/5 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                        title="Edit Proyek"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id, project.title)}
                        disabled={isPending}
                        className="p-2 rounded-lg border border-gray-800 hover:border-red-500/30 hover:bg-red-500/5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal Window (Form Overlay) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-950/40 bg-gray-900">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? `Edit Proyek: ${editingProject.title}` : 'Tambah Proyek Baru'}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow bg-gray-900">
              
              {/* Row 1: Image Upload & Preview */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Foto / Gambar Proyek (Landscape)
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Preview Image Block */}
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-gray-800 bg-gray-950 flex items-center justify-center group relative shadow-inner">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Project Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-700" />
                    )}
                  </div>

                  {/* Input trigger */}
                  <label className="flex items-center justify-center gap-2.5 py-3 px-4 border border-gray-800 rounded-xl bg-gray-950/40 text-xs font-bold text-gray-300 hover:text-white hover:border-brand-500 hover:bg-brand-500/5 cursor-pointer transition-all duration-300">
                    <Upload className="w-4 h-4 text-brand-500" />
                    <span>Pilih Gambar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Row 2: Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Judul Proyek
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: NeonSphere Portal, E-Commerce App"
                  className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Row 3: Description (Rich Text Editor gaya Word) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
                  Deskripsi Proyek (Editor Gaya Word)
                </label>

                {/* Editor Container */}
                <div className="flex flex-col border border-gray-800 rounded-xl overflow-hidden bg-gray-950/40">
                  
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-950/80 border-b border-gray-800 select-none">
                    
                    {/* Bold */}
                    <button
                      type="button"
                      onClick={() => execEditorCommand('bold')}
                      className="p-2 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Tebal"
                    >
                      <Bold className="w-4 h-4" />
                    </button>

                    {/* Italic */}
                    <button
                      type="button"
                      onClick={() => execEditorCommand('italic')}
                      className="p-2 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Miring"
                    >
                      <Italic className="w-4 h-4" />
                    </button>

                    {/* Underline */}
                    <button
                      type="button"
                      onClick={() => execEditorCommand('underline')}
                      className="p-2 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Garis Bawah"
                    >
                      <Underline className="w-4 h-4" />
                    </button>

                    {/* Divider */}
                    <div className="w-[1px] h-5 bg-gray-800 mx-1" />

                    {/* Alignment */}
                    <button
                      type="button"
                      onClick={() => execEditorCommand('justifyLeft')}
                      className="p-2 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Rata Kiri"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execEditorCommand('justifyCenter')}
                      className="p-2 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Rata Tengah"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execEditorCommand('justifyRight')}
                      className="p-2 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Rata Kanan"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execEditorCommand('justifyFull')}
                      className="p-2 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="Rata Kiri-Kanan"
                    >
                      <AlignJustify className="w-4 h-4" />
                    </button>

                    {/* Divider */}
                    <div className="w-[1px] h-5 bg-gray-800 mx-1" />

                    {/* Font Size Dropdown */}
                    <div className="flex items-center gap-1.5 px-0.5">
                      <Type className="w-3.5 h-3.5 text-gray-400" />
                      <select
                        onChange={(e) => execEditorCommand('fontSize', e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-lg text-[10px] text-gray-300 px-1 py-1 focus:outline-none cursor-pointer h-7"
                        defaultValue="3"
                        title="Ukuran Teks"
                      >
                        <option value="1">Sangat Kecil</option>
                        <option value="2">Kecil</option>
                        <option value="3">Normal</option>
                        <option value="4">Sedang</option>
                        <option value="5">Besar</option>
                        <option value="6">Sangat Besar</option>
                        <option value="7">Raksasa</option>
                      </select>
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-5 bg-gray-800 mx-1" />

                    {/* Colors */}
                    <div className="flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-gray-400 mr-1" />
                      <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center cursor-pointer">
                        <input
                          type="color"
                          onChange={(e) => execEditorCommand('foreColor', e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          title="Pilih Warna Kustom"
                        />
                        <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500" />
                      </div>

                      {/* Presets */}
                      {['#FFFFFF', '#8CFF00', '#7A7A7A', '#EF4444', '#3B82F6'].map((presetColor) => (
                        <button
                          key={presetColor}
                          type="button"
                          onClick={() => execEditorCommand('foreColor', presetColor)}
                          className="w-4 h-4 rounded-full border border-gray-950 hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: presetColor }}
                        />
                      ))}
                    </div>

                  </div>

                  {/* Workspace */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="px-4 py-3 min-h-[120px] max-h-[220px] overflow-y-auto text-sm text-white focus:outline-none leading-relaxed custom-scrollbar bg-gray-950/20"
                  />

                </div>
              </div>

              {/* Row 4: URL Repo Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Link Repositori / Demo
                </label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="Contoh: https://github.com/username/project"
                  className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Row 5: Sort Order Index */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Index Urutan Tampil
                </label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 focus:border-brand-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                />
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
                      <span>Simpan Proyek</span>
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
