'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export interface ExperienceDetail {
  key: string;
  value: string;
}

export interface ExperienceDoc {
  id: number;
  title: string;
  desc: string;
  color: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  order_index: number;
  details: ExperienceDetail[];
  skills: string[];
  docs: string[]; // Array of image URL strings
  show_docs: boolean;
  created_at: string;
}

// 1. Fetch all experiences
export async function getExperiences(): Promise<{ success: boolean; data?: ExperienceItem[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as ExperienceItem[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Terjadi kesalahan jaringan.' };
  }
}

// 2. Add a new experience
export async function addExperience(formData: FormData) {
  try {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);
    const show_docs = formData.get('show_docs') === 'true';
    
    // Parse dynamic fields
    const detailsRaw = formData.get('details') as string;
    const skillsRaw = formData.get('skills') as string;
    const existingDocsRaw = formData.get('existing_docs') as string;

    const details = detailsRaw ? JSON.parse(detailsRaw) : [];
    const skills = skillsRaw ? JSON.parse(skillsRaw) : [];
    const existingDocs = existingDocsRaw ? JSON.parse(existingDocsRaw) : [];

    // Get files uploaded
    const imageFiles = formData.getAll('images') as File[];
    const uploadedUrls: string[] = [];

    // Process file uploads
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `experience-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `experiences/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          return { success: false, error: `Gagal mengunggah foto dokumentasi: ${uploadError.message}` };
        }

        const { data: urlData } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }
    }

    const docs = [...existingDocs, ...uploadedUrls];

    if (!title) {
      return { success: false, error: 'Judul pengalaman (nama magang) wajib diisi.' };
    }

    if (show_docs && docs.length === 0) {
      return { success: false, error: 'Jika Dokumentasi diaktifkan, minimal harus mengunggah 1 foto dokumentasi.' };
    }

    const { error: dbError } = await supabase.from('experiences').insert({
      title,
      order_index,
      details,
      skills,
      docs,
      show_docs
    });

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/services');
    revalidatePath('/admin/experiences');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menambahkan pengalaman.' };
  }
}

// 3. Update an existing experience
export async function updateExperience(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);
    const show_docs = formData.get('show_docs') === 'true';
    
    // Parse dynamic fields
    const detailsRaw = formData.get('details') as string;
    const skillsRaw = formData.get('skills') as string;
    const existingDocsRaw = formData.get('existing_docs') as string;

    const details = detailsRaw ? JSON.parse(detailsRaw) : [];
    const skills = skillsRaw ? JSON.parse(skillsRaw) : [];
    const existingDocs = existingDocsRaw ? JSON.parse(existingDocsRaw) : [];

    // Get files uploaded
    const imageFiles = formData.getAll('images') as File[];
    const uploadedUrls: string[] = [];

    // Process file uploads
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `experience-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `experiences/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          return { success: false, error: `Gagal mengunggah foto dokumentasi baru: ${uploadError.message}` };
        }

        const { data: urlData } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }
    }

    const docs = [...existingDocs, ...uploadedUrls];

    if (!title) {
      return { success: false, error: 'Judul pengalaman (nama magang) wajib diisi.' };
    }

    if (show_docs && docs.length === 0) {
      return { success: false, error: 'Jika Dokumentasi diaktifkan, minimal harus mengunggah 1 foto dokumentasi.' };
    }

    const { error: dbError } = await supabase
      .from('experiences')
      .update({
        title,
        order_index,
        details,
        skills,
        docs,
        show_docs
      })
      .eq('id', id);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/services');
    revalidatePath('/admin/experiences');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal memperbarui pengalaman.' };
  }
}

// 4. Delete an experience
export async function deleteExperience(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/services');
    revalidatePath('/admin/experiences');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menghapus pengalaman.' };
  }
}
