import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Mencegat semua request kecuali:
     * - _next/static (file statik Next.js)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico (favicon)
     * - File gambar/media (.svg, .png, .jpg, dll)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
