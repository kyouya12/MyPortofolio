import ScrollReveal from "../../components/ScrollReveal";
import { createClient } from "@/utils/supabase/server";
import ProjectListClient, { ProjectItem } from "@/components/ProjectListClient";

const defaultProjects: ProjectItem[] = [
  {
    id: "default-1",
    title: "NeonSphere Portal",
    description: "A high-fidelity landing page mockup boasting modern typography layout, neon grids, and detailed floating components in dark mode.",
    image_url: "", // will fall back to gradient block
    repo_url: "https://github.com/anonim21",
    order_index: 0
  },
  {
    id: "default-2",
    title: "Aether Admin UI",
    description: "An interactive dashboard panel tracking clean chart components, user logs, with responsive modular card drawers and glowing nodes.",
    image_url: "",
    repo_url: "https://github.com/anonim21",
    order_index: 1
  },
  {
    id: "default-3",
    title: "Apex Crypto Terminal",
    description: "A real-time cryptocurrency exchange dashboard with candlestick charts, order book execution panels, and wallet transaction trackers.",
    image_url: "",
    repo_url: "https://github.com/anonim21",
    order_index: 2
  }
];

export default async function ProjectPage() {
  const supabase = await createClient();

  // Fetch projects dynamic list from Supabase on the server
  const { data: dbProjects } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  const projects = dbProjects && dbProjects.length > 0 
    ? (dbProjects as ProjectItem[]) 
    : defaultProjects;

  return (
    <section 
      id="project" 
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-24 md:py-32"
    >
      <div className="w-full space-y-10">
        <ScrollReveal>
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white select-none">
              Featured <span className="text-brand">Projects</span>
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto rounded-full" />
          </div>
        </ScrollReveal>

        {/* Dynamic Project List slideshow */}
        <ProjectListClient projects={projects} />
      </div>
    </section>
  );
}
