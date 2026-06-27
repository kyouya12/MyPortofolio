import ScrollReveal from "../../components/ScrollReveal";
import { createClient } from "@/utils/supabase/server";
import { Mail, Globe } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from "@/components/BrandIcons";

// Icon mapping
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  whatsapp: WhatsappIcon,
  globe: Globe,
};

const defaultLinks = [
  {
    id: 'default-mail',
    platform: 'Gmail',
    username: 'myonerose@gmail.com',
    icon_type: 'mail',
    url: 'mailto:myonerose@gmail.com',
  },
  {
    id: 'default-linkedin',
    platform: 'LinkedIn',
    username: 'anonim21',
    icon_type: 'linkedin',
    url: 'https://linkedin.com/in/anonim21',
  },
  {
    id: 'default-github',
    platform: 'Github',
    username: 'anonim21',
    icon_type: 'github',
    url: 'https://github.com/anonim21',
  },
  {
    id: 'default-instagram',
    platform: 'Instagram',
    username: 'username',
    icon_type: 'instagram',
    url: 'https://instagram.com/username',
  }
];

export default async function ContactPage() {
  const supabase = await createClient();

  // Fetch social links from database
  const { data: dbLinks } = await supabase
    .from('social_links')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  const links = dbLinks && dbLinks.length > 0 ? dbLinks : defaultLinks;

  return (
    <section 
      id="contact" 
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-24 md:py-32"
    >
      <div className="w-full max-w-5xl mx-auto text-center space-y-10">
        
        {/* Big Name Header */}
        <ScrollReveal>
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wider select-none uppercase text-white">
              Azmi Novi Athaya
            </h1>
            <div className="w-full h-[2px] bg-white/20 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Sub-header text */}
        <ScrollReveal delay={0.15}>
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Have a Project?
            </h2>
            <p className="text-text-secondary text-base md:text-lg max-w-lg mx-auto">
              Feel free to reach out using the contact details provided.
            </p>
          </div>
        </ScrollReveal>

        {/* Dynamic 2x2 Contact Grid */}
        <ScrollReveal delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-6">
            {links.map((link) => {
              const Icon = IconMap[link.icon_type] || Globe;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : "_blank"}
                  rel="noreferrer"
                  className="flex items-center gap-4 bg-[#0d0d0d] border border-white/10 p-5 rounded-2xl group hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 glow-card text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-text-secondary group-hover:border-brand group-hover:text-brand transition-all flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider block">
                      {link.platform}
                    </span>
                    <span className="text-base text-white font-medium block truncate">
                      {link.username}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Footer Copy */}
        <ScrollReveal delay={0.4}>
          <div className="pt-12 text-sm text-text-secondary">
            &copy; 2026 Azmi. All rights reserved.
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

