'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  repo_url: string;
  order_index: number;
  created_at: string;
}

// 1. Fetch all projects
export async function getProjects(): Promise<{ success: boolean; data?: ProjectItem[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as ProjectItem[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Terjadi kesalahan jaringan.' };
  }
}

// 2. Add a new project
export async function addProject(formData: FormData) {
  try {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const repo_url = formData.get('repo_url') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);
    const imageFile = formData.get('image') as File;

    if (!title || !description || !repo_url) {
      return { success: false, error: 'Judul, deskripsi, dan URL repositori wajib diisi.' };
    }

    if (!imageFile || imageFile.size === 0) {
      return { success: false, error: 'Gambar proyek wajib diunggah.' };
    }

    // Upload image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `project-${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: `Gagal mengunggah gambar: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from('projects').insert({
      title,
      description,
      image_url: imageUrl,
      repo_url,
      order_index,
    });

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/project');
    revalidatePath('/admin/projects');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menambahkan proyek.' };
  }
}

// 3. Update an existing project
export async function updateProject(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const repo_url = formData.get('repo_url') as string;
    const current_image_url = formData.get('current_image_url') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);
    const imageFile = formData.get('image') as File;

    if (!title || !description || !repo_url) {
      return { success: false, error: 'Judul, deskripsi, dan URL repositori wajib diisi.' };
    }

    let imageUrl = current_image_url;

    // Process new image upload if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `project-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: `Gagal mengunggah gambar baru: ${uploadError.message}` };
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    const { error: dbError } = await supabase
      .from('projects')
      .update({
        title,
        description,
        image_url: imageUrl,
        repo_url,
        order_index,
      })
      .eq('id', id);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/project');
    revalidatePath('/admin/projects');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal memperbarui proyek.' };
  }
}

// 4. Delete a project
export async function deleteProject(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/project');
    revalidatePath('/admin/projects');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menghapus proyek.' };
  }
}
