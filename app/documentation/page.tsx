"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
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

function DocumentationContent() {
  const searchParams = useSearchParams();
  const expIdFromQuery = searchParams.get("id");

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
  const [selectedExpId, setSelectedExpId] = useState<string>("");
  const [docIndex, setDocIndex] = useState(0);

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
          return;
        }

        if (data && data.length > 0) {
          setExperiences(data);
        }
      } catch (err) {
        // Silent catch: fallback data remains active
      }
    }
    loadExperiences();
  }, []);

  // Update selected experience when experiences loaded or query param changes
  useEffect(() => {
    if (experiences.length > 0) {
      if (expIdFromQuery && experiences.some(e => e.id === expIdFromQuery)) {
        setSelectedExpId(expIdFromQuery);
      } else {
        setSelectedExpId(experiences[0].id);
      }
      setDocIndex(0);
    }
  }, [experiences, expIdFromQuery]);

  const activeExp = experiences.find(e => e.id === selectedExpId) || experiences[0];
  const activeDocs = activeExp?.docs || [];
  const totalDocs = activeDocs.length;

  return (
    <section 
      id="documentation" 
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-20 relative"
    >
      {/* Back Button */}
      <Link
        href="/services"
        className="absolute top-6 left-0 flex items-center gap-2 text-text-secondary hover:text-brand transition-colors text-base font-semibold group z-30 select-none"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span>Back to Services</span>
      </Link>

      <div className="w-full space-y-8 flex flex-col items-center">
        {/* Title */}
        <ScrollReveal>
          <div className="text-center space-y-2 select-none">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Dokumentasi <span className="text-brand">{activeExp?.title}</span>
            </h2>
            <div className="w-16 h-1 bg-brand rounded-full mx-auto" />
          </div>
        </ScrollReveal>

        {totalDocs > 0 ? (
          <div className="w-full">
            <ScrollReveal>
              <div className="flex flex-col items-center w-full max-w-[95rem] mx-auto">
                
                {/* Slider Container */}
                <div className="relative flex flex-col items-center justify-center w-full">
                  {/* Cards Wrapper - Significantly enlarged container */}
                  <div className="relative w-full max-w-[90rem] h-[18rem] sm:h-[24rem] md:h-[28rem] lg:h-[32rem] overflow-hidden flex items-center justify-center">
                    {activeDocs.map((doc: any, idx: number) => {
                      let diff = idx - docIndex;
                      if (totalDocs > 1) {
                        if (diff < -Math.floor(totalDocs / 2)) diff += totalDocs;
                        if (diff > Math.floor((totalDocs - 1) / 2)) diff -= totalDocs;
                      }

                      const isCenter = diff === 0;
                      const isVisible = Math.abs(diff) <= 1 || (totalDocs === 2 && Math.abs(diff) === 1);
                      const isUrl = typeof doc === "string";

                      return (
                        <motion.div
                          key={isUrl ? doc : doc.id}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                          }}
                          animate={{
                            x: `calc(-50% + ${diff * 105}%)`,
                            y: "-50%",
                            scale: isCenter ? 1.05 : 0.82,
                            opacity: isVisible ? (isCenter ? 1 : 0.4) : 0,
                            zIndex: isCenter ? 30 : (isVisible ? 20 : 10),
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 280,
                            damping: 28
                          }}
                          // Enlarged Landscape Card Classes
                          className={`group w-[94%] sm:w-[540px] md:w-[780px] lg:w-[940px] h-56 sm:h-72 md:h-[22rem] lg:h-[25rem] rounded-3xl border flex flex-col justify-between transition-all duration-300 overflow-hidden relative ${
                            isCenter
                              ? "border-brand shadow-[0_0_35px_rgba(140,255,0,0.15)] cursor-default"
                              : "border-white/10 cursor-pointer hover:border-white/20"
                          } ${!isUrl ? `bg-gradient-to-tr ${doc.color} p-8 md:p-12` : "bg-black/60"}`}
                          onClick={() => {
                            if (!isCenter) {
                              setDocIndex(idx);
                            }
                          }}
                        >
                          {isUrl ? (
                            <>
                              {/* Actual Image fill */}
                              <Image
                                src={doc}
                                alt={`Dokumentasi ${idx + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 780px, 940px"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 z-0"
                              />
                              
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40 z-10 pointer-events-none" />

                              {/* Browser Controls */}
                              <div className="flex items-center gap-2 opacity-70 z-20 p-6 sm:p-8">
                                <span className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                              </div>

                              <div className="text-sm text-brand uppercase tracking-widest font-mono font-bold z-20 p-6 sm:p-8 text-left select-none">
                                Dokumentasi #{idx + 1}
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Browser Window Controls Mockup */}
                              <div className="flex items-center gap-2 opacity-40 z-10">
                                <span className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                              </div>

                              <div className="space-y-4 z-10 text-left pt-4">
                                <h4 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-brand transition-colors">
                                  {doc.title}
                                </h4>
                                <p className="text-base md:text-lg text-text-secondary leading-relaxed line-clamp-4 max-w-3xl">
                                  {doc.desc}
                                </p>
                              </div>
                              <div className="text-xs sm:text-sm text-brand uppercase tracking-widest font-mono z-10 text-left pt-2">
                                Mockup #{doc.id}
                              </div>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Slider Controls */}
                  {totalDocs > 1 && (
                    <div className="flex items-center gap-6 mt-8">
                      <button
                        onClick={() => setDocIndex((prev) => (prev === 0 ? totalDocs - 1 : prev - 1))}
                        className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white hover:border-brand hover:text-brand transition-all cursor-pointer bg-black/20 font-bold text-lg select-none"
                      >
                        &lt;
                      </button>
                      <span className="text-base font-mono text-text-secondary select-none">
                        {docIndex + 1} / {totalDocs}
                      </span>
                      <button
                        onClick={() => setDocIndex((prev) => (prev === totalDocs - 1 ? 0 : prev + 1))}
                        className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white hover:border-brand hover:text-brand transition-all cursor-pointer bg-black/20 font-bold text-lg select-none"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        ) : (
          <div className="w-full">
            <ScrollReveal>
              <div className="flex border border-white/10 p-12 rounded-3xl bg-black/40 backdrop-blur-md justify-center items-center glow-card min-h-[440px] w-full max-w-[80rem] mx-auto">
                <p className="text-text-secondary text-lg font-semibold">Belum ada dokumentasi untuk pengalaman ini.</p>
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Subtle switcher for experiences at the bottom */}
        {experiences.length > 1 && (
          <div className="w-full flex justify-center">
            <ScrollReveal delay={0.15}>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl px-4 py-2 border border-white/5 bg-black/20 rounded-2xl backdrop-blur-sm select-none">
                {experiences.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      setSelectedExpId(exp.id);
                      setDocIndex(0);
                    }}
                    className={`px-5 py-2.5 text-sm sm:text-base font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedExpId === exp.id
                        ? "bg-white text-black border-white shadow-md"
                        : "bg-transparent border-white/10 text-white hover:border-brand/40 hover:text-brand"
                    }`}
                  >
                    {exp.title}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}

export default function DocumentationPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
          <div className="text-white text-lg animate-pulse font-semibold">Loading Documentation...</div>
        </div>
      }
    >
      <DocumentationContent />
    </Suspense>
  );
}
