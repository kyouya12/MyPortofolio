'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { updateAboutMe } from './actions';
import { 
  Save, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  User,
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

interface AboutData {
  bio: string;
  avatar_url: string | null;
}

interface AboutFormProps {
  initialData: AboutData;
}

export default function AboutForm({ initialData }: AboutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Set initial content inside editor once mounted
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialData.bio;
    }
  }, [initialData.bio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Helper function to trigger document.execCommand
  const execEditorCommand = (command: string, value: string = '') => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, value);
      // Refocus editor to retain selection
      editorRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    // Retrieve html content from the contenteditable div
    const bioHtml = editorRef.current ? editorRef.current.innerHTML : '';

    const submissionData = new FormData();
    submissionData.append('bio', bioHtml);
    submissionData.append('current_avatar_url', initialData.avatar_url || '');
    if (selectedFile) {
      submissionData.append('avatar', selectedFile);
    }

    startTransition(async () => {
      try {
        const res = await updateAboutMe(submissionData);
        if (res.success) {
          setStatus({
            type: 'success',
            message: 'Konten halaman About Me (Deskripsi & Foto Profil) berhasil diperbarui!',
          });
        } else {
          setStatus({
            type: 'error',
            message: res.error || 'Terjadi kesalahan saat memperbarui biografi.',
          });
        }
      } catch (err: any) {
        setStatus({
          type: 'error',
          message: err?.message || 'Koneksi gagal. Silakan coba lagi.',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Left Column: Photo Upload Section */}
      <div className="w-full lg:w-80 flex flex-col items-center p-6 border border-gray-800 bg-gray-900 rounded-2xl space-y-5 flex-shrink-0">
        <span className="block text-sm font-bold text-gray-400 font-mono tracking-wider uppercase select-none">
          Foto Profil (PP)
        </span>
        
        {/* Avatar Display */}
        <div className="relative w-44 h-52 rounded-2xl overflow-hidden border border-gray-800 bg-gray-950 flex items-center justify-center group shadow-inner">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Portrait Preview"
              className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
            />
          ) : (
            <User className="w-16 h-16 text-gray-700" />
          )}
        </div>

        {/* Upload Trigger Button */}
        <label className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 border border-gray-800 rounded-xl bg-gray-950/40 text-sm font-bold text-gray-300 hover:text-white hover:border-brand-500 hover:bg-brand-500/5 cursor-pointer transition-all duration-300">
          <Upload className="w-4.5 h-4.5 text-brand-500" />
          <span>Unggah Foto Baru</span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <span className="block text-[11px] text-gray-500 text-center select-none leading-relaxed">
          Gunakan file format JPG, PNG, atau WEBP. Maksimal ukuran file 2MB.
        </span>
      </div>

      {/* Right Column: Rich Text Editor Input Section */}
      <div className="flex-grow w-full border border-gray-800 bg-gray-900 p-6 md:p-8 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-3">
          Informasi Deskripsi About Me
        </h3>

        {/* Action Banners */}
        {status.type === 'success' && (
          <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 text-[15px] font-semibold flex items-center gap-3">
            <CheckCircle className="w-5.5 h-5.5 flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {status.type === 'error' && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[15px] font-semibold flex items-center gap-3">
            <AlertCircle className="w-5.5 h-5.5 flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {/* Custom WYSIWYG Editor Container */}
        <div className="space-y-2.5">
          <label className="block text-[15px] font-bold text-gray-400 tracking-wide select-none">
            Deskripsi Halaman About Me (Editor Gaya Word)
          </label>

          {/* Editor Border Wrapper */}
          <div className="flex flex-col border border-gray-800 rounded-xl overflow-hidden bg-gray-950/40">
            
            {/* Toolbar Panel */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-950/80 border-b border-gray-800 select-none">
              
              {/* Bold Button */}
              <button
                type="button"
                onClick={() => execEditorCommand('bold')}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Tebal (Ctrl+B)"
              >
                <Bold className="w-5 h-5" />
              </button>

              {/* Italic Button */}
              <button
                type="button"
                onClick={() => execEditorCommand('italic')}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Miring (Ctrl+I)"
              >
                <Italic className="w-5 h-5" />
              </button>

              {/* Underline Button */}
              <button
                type="button"
                onClick={() => execEditorCommand('underline')}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Garis Bawah (Ctrl+U)"
              >
                <Underline className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="w-[1px] h-6 bg-gray-800 mx-1" />

              {/* Align Left Button */}
              <button
                type="button"
                onClick={() => execEditorCommand('justifyLeft')}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Rata Kiri"
              >
                <AlignLeft className="w-5 h-5" />
              </button>

              {/* Align Center Button */}
              <button
                type="button"
                onClick={() => execEditorCommand('justifyCenter')}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Rata Tengah"
              >
                <AlignCenter className="w-5 h-5" />
              </button>

              {/* Align Right Button */}
              <button
                type="button"
                onClick={() => execEditorCommand('justifyRight')}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Rata Kanan"
              >
                <AlignRight className="w-5 h-5" />
              </button>

              {/* Align Justify Button */}
              <button
                type="button"
                onClick={() => execEditorCommand('justifyFull')}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Rata Kiri-Kanan"
              >
                <AlignJustify className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="w-[1px] h-6 bg-gray-800 mx-1" />

              {/* Font Size Dropdown */}
              <div className="flex items-center gap-1.5 px-1">
                <Type className="w-4 h-4 text-gray-400" />
                <select
                  onChange={(e) => execEditorCommand('fontSize', e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-300 px-2 py-1 focus:outline-none focus:border-brand-500 cursor-pointer h-8"
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
              <div className="w-[1px] h-6 bg-gray-800 mx-1" />

              {/* Color Picker & Presets */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                <div className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-gray-400" />
                  
                  {/* Custom Color Input Icon Trigger */}
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-800 bg-gray-900 hover:border-gray-700 transition-colors flex items-center justify-center">
                    <input
                      type="color"
                      onChange={(e) => execEditorCommand('foreColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Pilih Warna Kustom"
                    />
                    <div className="w-4.5 h-4.5 rounded-full border border-gray-750 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500" />
                  </div>
                </div>

                {/* Preset Circles */}
                <div className="flex items-center gap-1">
                  {[
                    { color: '#FFFFFF', name: 'Putih' },
                    { color: '#8CFF00', name: 'Lime/Brand' },
                    { color: '#7A7A7A', name: 'Abu-abu' },
                    { color: '#EF4444', name: 'Merah' },
                    { color: '#3B82F6', name: 'Biru' },
                    { color: '#FBBF24', name: 'Kuning' }
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => execEditorCommand('foreColor', preset.color)}
                      className="w-5 h-5 rounded-full border border-gray-950 hover:scale-120 active:scale-95 transition-transform cursor-pointer shadow-sm"
                      style={{ backgroundColor: preset.color }}
                      title={`Warna ${preset.name}`}
                    />
                  ))}
                </div>
              </div>

            </div>


            {/* Editable Content Workspace */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="px-5 py-4 min-h-[250px] max-h-[400px] overflow-y-auto text-[16px] text-white focus:outline-none leading-relaxed custom-scrollbar"
              style={{ minHeight: '250px' }}
            />

          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 py-4 px-8 border border-transparent rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(70,95,255,0.25)] hover:shadow-[0_6px_20px_rgba(70,95,255,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>

      </div>

    </form>
  );
}
