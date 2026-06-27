'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  icon_type: string;
  url: string;
  order_index: number;
  created_at: string;
}

// 1. Fetch all social links
export async function getSocialLinks(): Promise<{ success: boolean; data?: SocialLink[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as SocialLink[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Terjadi kesalahan jaringan.' };
  }
}

// 2. Add a new social link
export async function addSocialLink(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Akses ditolak. Anda harus masuk terlebih dahulu.' };
    }

    const platform = formData.get('platform') as string;
    const username = formData.get('username') as string;
    const icon_type = formData.get('icon_type') as string;
    const url = formData.get('url') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);

    if (!platform || !username || !icon_type || !url) {
      return { success: false, error: 'Semua field wajib diisi.' };
    }

    const { error } = await supabase.from('social_links').insert({
      platform,
      username,
      icon_type,
      url,
      order_index,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/contact');
    revalidatePath('/admin/contact');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menambahkan link.' };
  }
}

// 3. Update an existing social link
export async function updateSocialLink(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Akses ditolak. Anda harus masuk terlebih dahulu.' };
    }

    const platform = formData.get('platform') as string;
    const username = formData.get('username') as string;
    const icon_type = formData.get('icon_type') as string;
    const url = formData.get('url') as string;
    const order_index = parseInt(formData.get('order_index') as string || '0', 10);

    if (!platform || !username || !icon_type || !url) {
      return { success: false, error: 'Semua field wajib diisi.' };
    }

    const { error } = await supabase
      .from('social_links')
      .update({
        platform,
        username,
        icon_type,
        url,
        order_index,
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/contact');
    revalidatePath('/admin/contact');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal memperbarui link.' };
  }
}

// 4. Delete a social link
export async function deleteSocialLink(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Akses ditolak. Anda harus masuk terlebih dahulu.' };
    }

    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/contact');
    revalidatePath('/admin/contact');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menghapus link.' };
  }
}
