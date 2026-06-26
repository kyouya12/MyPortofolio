import ScrollReveal from '../../components/ScrollReveal';
import { createClient } from '@/utils/supabase/server';

export default async function AboutPage() {
  const supabase = await createClient();

  // Fetch bio details dynamically from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', 'default_profile')
    .single();

  // Fallbacks if data doesn't exist yet
  const name = profile?.name || 'Azmi';
  const bio = profile?.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque faucibus ex sapien, vitae pellentesque sem placerat. In id cursus mi, pretium tellus duis convallis.';
  const avatarUrl = profile?.avatar_url || '/profile.jpg';

  return (
    <section 
      id="about" 
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 md:py-16 w-full"
    >
      {/* Glassmorphism transparent blur frame */}
      <div className="w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        {/* Two columns layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center w-full">
          
          {/* Left Column: Title + Bio */}
          <div className="md:col-span-7 flex flex-col items-start text-left space-y-6">
            <ScrollReveal direction="up">
              <div className="flex flex-col items-start">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white select-none">
                  About me...
                </h2>
                <div className="w-32 md:w-48 h-[6px] bg-white mt-3 rounded-full" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15} direction="left">
              {/* max-height and custom scrollbar so the text column scrolls internally and doesn't change card layout dimensions */}
              <div 
                data-lenis-prevent
                className="text-text-secondary text-lg md:text-xl leading-relaxed font-normal max-h-[350px] md:max-h-[420px] overflow-y-auto pr-4 custom-scrollbar"
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            </ScrollReveal>
          </div>

          {/* Right Column: Photo */}
          <div className="md:col-span-5 w-full flex justify-center md:justify-end">
            <ScrollReveal delay={0.2} direction="right">
              <div className="w-[280px] sm:w-[320px] h-[340px] sm:h-[400px] rounded-[2.5rem] border-2 border-white/20 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] group hover:border-brand transition-all duration-300">
                <img
                  src={avatarUrl}
                  alt={`${name} Portrait`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
