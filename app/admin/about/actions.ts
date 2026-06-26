'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function updateAboutMe(formData: FormData) {
  const supabase = await createClient();

  const bio = formData.get('bio') as string;
  const currentAvatarUrl = formData.get('current_avatar_url') as string;
  const avatarFile = formData.get('avatar') as File;

  let avatarUrl = currentAvatarUrl;

  // Process photo upload if a new file is uploaded
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `portrait-${Date.now()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, avatarFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: `Gagal mengunggah foto: ${uploadError.message}` };
    }

    // Retrieve public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);

    avatarUrl = urlData.publicUrl;
  }

  // Retrieve existing record to preserve fields like name and title
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', 'default_profile')
    .single();

  const name = existing?.name || 'Azmi';
  const title = existing?.title || 'Web Developer';

  // Perform upsert to modify only bio and avatar_url
  const { error: dbError } = await supabase.from('profiles').upsert({
    id: 'default_profile',
    name,
    title,
    bio,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  });

  if (dbError) {
    return { success: false, error: `Gagal memperbarui database: ${dbError.message}` };
  }

  revalidatePath('/about');
  revalidatePath('/admin/about');
  
  return { success: true };
}
