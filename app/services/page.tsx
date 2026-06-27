"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "../../components/ScrollReveal";
import { ArrowRight, Layout, Code, Server } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const fallbackMagangData: Record<string, any> = {
  "Magang 1": {
    title: "Magang 1",
    details: [
      { key: "Lokasi", value: "Disduk" },
      { key: "Bidang", value: "Pelayanan" },
      { key: "Jadwal", value: "20 Maret - 20 Juni 2026" }
    ],
    skills: ["public speaking", "Social communication", "time management"],
    docs: [
      { id: 1, title: "Sistem Antrean", desc: "Desain UI antrean loket Disduk", color: "from-brand/10 to-indigo-950/20" },
      { id: 2, title: "Portal Pelayanan", desc: "Halaman pendaftaran KTP & KK", color: "from-emerald-950/20 to-brand/10" },
      { id: 3, title: "Database Kearsipan", desc: "Integrasi data arsip kependudukan", color: "from-purple-950/30 to-brand/5" },
      { id: 4, title: "Evaluasi Pelayanan", desc: "Analisis feedback & survei kepuasan masyarakat", color: "from-blue-950/20 to-brand/10" },
      { id: 5, title: "Laporan Kinerja", desc: "Sistem pelaporan performa loket pelayanan harian", color: "from-pink-950/30 to-brand/5" },
    ]
  },
  "Magang 2": {
    title: "Magang 2",
    details: [
      { key: "Lokasi", value: "Kantor Kecamatan" },
      { key: "Bidang", value: "Administrasi" },
      { key: "Jadwal", value: "1 Juli - 30 September 2026" }
    ],
    skills: ["data management", "customer service", "office tools"],
    docs: [
      { id: 1, title: "Dashboard Surat", desc: "Panel tracking disposisi surat masuk", color: "from-blue-950/30 to-brand/10" },
      { id: 2, title: "Database Warga", desc: "Pencatatan data penduduk tingkat RT/RW", color: "from-teal-950/30 to-brand/5" },
      { id: 3, title: "Portal Aspirasi", desc: "Formulir online pelaporan keluhan warga", color: "from-violet-950/30 to-brand/10" },
      { id: 4, title: "Arsip Dokumen", desc: "Digitalisasi berkas fisik kelurahan/kecamatan", color: "from-orange-950/20 to-brand/10" },
      { id: 5, title: "Schedule Rapat", desc: "Penjadwalan agenda kerja & koordinasi staff", color: "from-yellow-950/30 to-brand/5" },
    ]
  },
  "Magang 3": {
    title: "Magang 3",
    details: [
      { key: "Lokasi", value: "Tech Startup X" },
      { key: "Bidang", value: "Web Development" },
      { key: "Jadwal", value: "15 Oktober - 15 Desember 2026" }
    ],
    skills: ["Next.js routing", "state management", "API integration"],
    docs: [
      { id: 1, title: "SaaS Dashboard", desc: "Desain admin panel interaktif SaaS", color: "from-rose-950/30 to-brand/10" },
      { id: 2, title: "Checkout Flow", desc: "Sistem pembayaran terintegrasi Midtrans", color: "from-amber-950/30 to-brand/5" },
      { id: 3, title: "Analytics Panel", desc: "Visualisasi data transaksi real-time", color: "from-fuchsia-950/30 to-brand/10" },
      { id: 4, title: "Product Catalog", desc: "Sistem manajemen inventaris & detail produk e-commerce", color: "from-cyan-950/30 to-brand/15" },
      { id: 5, title: "User Profile Panel", desc: "Manajemen data user, security settings, & preferences", color: "from-lime-950/30 to-brand/20" },
    ]
  }
};

export default function ServicesPage() {
  const [subTab, setSubTab] = useState<"service" | "experience">("service");
  
  // Format initial fallback data
  const formattedFallback = Object.keys(fallbackMagangData).map((key, index) => ({
    id: String(index + 1),
    title: key,
    order_index: index + 1,
    details: fallbackMagangData[key].details,
    skills: fallbackMagangData[key].skills,
    docs: fallbackMagangData[key].docs,
    show_docs: true
  }));

  const [experiences, setExperiences] = useState<any[]>(formattedFallback);
  const [selectedExpId, setSelectedExpId] = useState<string>("1");

  // Fetch experiences from Supabase
  useEffect(() => {
    async function loadExperiences() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: true });

        if (error) {
          // If there is an error (e.g. table not found), keep the fallback data
          return;
        }

        if (data) {
          setExperiences(data);
          if (data.length > 0) {
            setSelectedExpId(data[0].id);
          } else {
            setSelectedExpId("");
          }
        }
      } catch (err) {
        // Silent catch: fallback data remains active
      }
    }
    loadExperiences();
  }, []);

  const activeExp = experiences.find(e => e.id === selectedExpId) || experiences[0];
  const activeDocs = activeExp?.docs || [];
  const totalDocs = activeDocs.length;

  return (
    <section 
      id="services" 
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-24 md:py-32"
    >
      <div className="w-full space-y-10">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 border-b border-white/10 pb-6 w-full text-left relative">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white transition-all duration-350 select-none">
                Service & <span className="text-brand">Experience</span>
              </h2>
              <div className="w-20 h-1 bg-brand rounded-full" />
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {/* Pill Tab Switch */}
          <ScrollReveal delay={0.1}>
            <div className="flex justify-start">
              <div className="flex border border-white/15 bg-black/40 rounded-xl p-1">
                <button
                  onClick={() => setSubTab("service")}
                  className={`px-6 py-2 rounded-lg text-base md:text-lg font-semibold transition-all cursor-pointer ${
                    subTab === "service"
                      ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  Service
                </button>
                <button
                  onClick={() => setSubTab("experience")}
                  className={`px-6 py-2 rounded-lg text-base md:text-lg font-semibold transition-all cursor-pointer ${
                    subTab === "experience"
                      ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  Experience
                </button>
              </div>
            </div>
          </ScrollReveal>

           {subTab === "service" ? (
            /* SERVICES GRID */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* UI/UX Design */}
              <ScrollReveal delay={0.1}>
                <div className="bg-black border border-white/10 p-6 rounded-2xl glow-card flex flex-col items-center text-center space-y-4 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Layout className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">UI/UX Design</h4>
                  <p className="text-text-secondary text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.
                  </p>
                </div>
              </ScrollReveal>
 
              {/* Front End Developer */}
              <ScrollReveal delay={0.2}>
                <div className="bg-black border border-white/10 p-6 rounded-2xl glow-card flex flex-col items-center text-center space-y-4 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Code className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Front End Developer</h4>
                  <p className="text-text-secondary text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.
                  </p>
                </div>
              </ScrollReveal>
 
              {/* Back End Developer */}
              <ScrollReveal delay={0.3}>
                <div className="bg-black border border-white/10 p-6 rounded-2xl glow-card flex flex-col items-center text-center space-y-4 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Server className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Back End Developer</h4>
                  <p className="text-text-secondary text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          ) : experiences.length === 0 ? (
            /* EMPTY STATE */
            <ScrollReveal delay={0.1}>
              <div className="flex border border-white/10 p-12 rounded-3xl bg-black/40 backdrop-blur-md justify-center items-center glow-card min-h-[440px]">
                <p className="text-text-secondary text-lg font-semibold">Belum ada data pengalaman magang.</p>
              </div>
            </ScrollReveal>
          ) : (
            /* EXPERIENCE PANELS */
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-black border border-white/10 p-6 rounded-3xl glow-card min-h-[440px]">
                {/* Left Column: Navigation Buttons */}
                <div className="md:col-span-4 flex flex-col gap-3">
                  {experiences.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        setSelectedExpId(exp.id);
                      }}
                      className={`w-full py-4 px-6 text-left rounded-xl border text-base md:text-lg font-bold transition-all cursor-pointer ${
                        selectedExpId === exp.id
                          ? "bg-white text-black border-white shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                          : "bg-transparent border-white/10 text-white hover:border-brand/40 hover:text-brand"
                      }`}
                    >
                      {exp.title}
                    </button>
                  ))}
                </div>
 
                {/* Right Column: Experience Details */}
                <div className="md:col-span-8 border border-white/10 p-6 rounded-2xl bg-[#050505] flex flex-col justify-between relative min-h-[380px]">
                  
                  {/* Content Scroll Wrapper */}
                  <div className="flex-grow overflow-y-auto max-h-[320px] pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand/35 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      
                      {/* Dynamic Details (Location, Division, etc.) */}
                      <div className="space-y-3">
                        {activeExp?.details && activeExp.details.filter((d: any) => !d.key.startsWith('__')).length > 0 ? (
                          activeExp.details
                            .filter((d: any) => !d.key.startsWith('__'))
                            .map((detail: any, idx: number) => (
                              <p key={idx} className="text-base text-text-secondary font-semibold leading-relaxed">
                                {detail.key} : <span className="text-white font-normal">{detail.value}</span>
                              </p>
                            ))
                        ) : (
                          <p className="text-sm text-text-secondary italic">Tidak ada detail informasi.</p>
                        )}
                      </div>

                      {/* Skills List */}
                      <div className="space-y-3">
                        <p className="text-base text-text-secondary font-bold uppercase tracking-wider">Skill yang dipelajari :</p>
                        {activeExp?.skills && activeExp.skills.length > 0 ? (
                          <ul className="space-y-1.5 pl-1">
                            {activeExp.skills.map((skill: string) => (
                              <li key={skill} className="text-base text-white flex items-start gap-2.5 leading-relaxed">
                                <span className="text-brand mt-1 flex-shrink-0 text-xs">~</span>
                                <span>{skill}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-text-secondary italic">Tidak ada daftar skill.</p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  {activeExp?.show_docs && totalDocs > 0 && (
                    <div className="flex justify-end pt-4 border-t border-white/5 mt-4 select-none">
                      <Link
                        href={`/documentation?id=${activeExp.id}`}
                        className="text-base md:text-lg font-bold text-white hover:text-brand underline decoration-brand underline-offset-4 cursor-pointer transition-colors"
                      >
                        Dokumentasi
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}

