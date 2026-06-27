'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  repo_url: string;
  order_index: number;
}

interface ProjectListClientProps {
  projects: ProjectItem[];
}

export default function ProjectListClient({ projects }: ProjectListClientProps) {
  const [projectIndex, setProjectIndex] = useState(0);

  if (projects.length === 0) return null;

  const prevIndex = () => {
    setProjectIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const nextIndex = () => {
    setProjectIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex items-center justify-center py-6 w-full min-h-[620px] md:min-h-[550px]">
      
      {/* Left Arrow (Only show if there is more than 1 project) */}
      {projects.length > 1 && (
        <button
          onClick={prevIndex}
          className="absolute left-0 md:left-4 z-40 w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white hover:border-brand hover:text-brand transition-all cursor-pointer bg-black/40 font-bold text-xl hover:scale-105"
        >
          &lt;
        </button>
      )}

      {/* Slider Wrapper */}
      <div className="relative w-full max-w-[85rem] h-[620px] md:h-[550px] overflow-hidden flex items-center justify-center">
        {projects.map((project, idx) => {
          let diff = idx - projectIndex;
          
          // Wrap around calculations for smooth cyclic scrolling
          if (projects.length > 2) {
            const half = Math.floor(projects.length / 2);
            if (diff < -half) diff += projects.length;
            if (diff > half) diff -= projects.length;
          }

          const isCenter = diff === 0;
          const isVisible = Math.abs(diff) <= 1 || projects.length <= 2;

          return (
            <motion.div
              key={project.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: `calc(-50% + ${diff * 110}%)`,
                y: "-50%",
                scale: isCenter ? 1 : 0.85,
                opacity: isVisible ? (isCenter ? 1 : 0.35) : 0,
                zIndex: isCenter ? 30 : (isVisible ? 20 : 10),
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className={`group w-[95%] max-w-[78rem] min-h-[540px] sm:min-h-[500px] md:min-h-[450px] h-auto rounded-3xl border p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-12 items-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 overflow-hidden ${
                isCenter
                  ? "border-brand shadow-[0_0_40px_rgba(140,255,0,0.18)] cursor-default"
                  : "border-white/10 cursor-pointer hover:border-white/30"
              }`}
              onClick={() => {
                if (!isCenter) {
                  setProjectIndex(idx);
                }
              }}
            >
              
              {/* Left Column: Image Mockup or Real Image (Landscape layout) */}
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-[480px] h-[200px] md:h-[300px] rounded-2xl border border-white/10 relative overflow-hidden flex-shrink-0 cursor-pointer block group/img shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-10 animate-fade-in"
              >
                {/* Image or gradient box */}
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="w-full h-full object-cover group-hover/img:scale-103 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-brand/10 to-indigo-950/20 flex items-center justify-center p-6 text-center">
                    <div className="text-xl font-bold text-white group-hover/img:text-brand transition-colors">
                      {project.title}
                    </div>
                  </div>
                )}
                
                {/* Subtle hover overlay indicating it is clickable */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px] z-10">
                  <div className="flex items-center gap-1.5 bg-black/80 border border-brand/20 px-3.5 py-2 rounded-full text-brand text-xs font-bold shadow-lg">
                    <ExternalLink className="w-3.5 h-3.5 animate-pulse" />
                    <span>Buka Repositori</span>
                  </div>
                </div>
              </a>

              {/* Right Column: Project Info */}
              <div className="flex flex-col justify-between h-full flex-1 text-left space-y-4 pt-2 min-w-0">
                <div className="space-y-4">
                  {/* Title with Underline */}
                  <div className="inline-block border-b-2 border-brand pb-2">
                    <h3 className="text-3xl md:text-4xl font-black text-white group-hover:text-brand transition-colors whitespace-normal leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  <div 
                    data-lenis-prevent
                    className="text-text-secondary text-base md:text-lg leading-relaxed overflow-y-auto max-h-[140px] md:max-h-[220px] pr-2 custom-scrollbar"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>

                {/* Pulsing indicator helper message */}
                <div className="pt-2 flex items-center gap-2 text-[11px] sm:text-xs text-text-secondary select-none font-mono">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                  <span>💡 Tekan gambar proyek untuk membuka repositori.</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right Arrow (Only show if there is more than 1 project) */}
      {projects.length > 1 && (
        <button
          onClick={nextIndex}
          className="absolute right-0 md:right-4 z-40 w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white hover:border-brand hover:text-brand transition-all cursor-pointer bg-black/40 font-bold text-xl hover:scale-105"
        >
          &gt;
        </button>
      )}

    </div>
  );
}
