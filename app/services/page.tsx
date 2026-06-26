"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "../../components/ScrollReveal";
import { ArrowRight, Layout, Code, Server } from "lucide-react";

const magangData = {
  "Magang 1": {
    title: "Magang 1",
    lokasi: "Disduk",
    bidang: "Pelayanan",
    jadwal: "20 Maret - 20 Juni 2026",
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
    lokasi: "Kantor Kecamatan",
    bidang: "Administrasi",
    jadwal: "1 Juli - 30 September 2026",
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
    lokasi: "Tech Startup X",
    bidang: "Web Development",
    jadwal: "15 Oktober - 15 Desember 2026",
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
  const [selectedMagang, setSelectedMagang] = useState<"Magang 1" | "Magang 2" | "Magang 3">("Magang 1");
  const [viewMode, setViewMode] = useState<"details" | "documentation">("details");
  const [docIndex, setDocIndex] = useState(2);

  return (
    <section 
      id="services" 
      className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-24 md:py-32"
    >
      <div className="w-full space-y-10">
        <ScrollReveal>
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Service & <span className="text-brand">Experience</span>
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto rounded-full" />
          </div>
        </ScrollReveal>

        {viewMode === "documentation" ? (
          <ScrollReveal>
            <div className="bg-black border border-white/10 p-6 md:p-8 rounded-3xl glow-card flex flex-col space-y-6">
              {/* Header with Title and Back Button */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">Dokumentasi {selectedMagang}</h3>
                <button
                  onClick={() => setViewMode("details")}
                  className="px-5 py-2.5 border border-white/15 hover:border-brand rounded-xl text-base font-bold text-white hover:text-black hover:bg-brand transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back</span>
                </button>
              </div>

              {/* Slider Container */}
              <div className="relative flex flex-col items-center justify-center py-4 w-full">
                {/* Cards Wrapper */}
                <div className="relative w-full max-w-[85rem] h-80 md:h-[22rem] overflow-hidden flex items-center justify-center">
                  {magangData[selectedMagang].docs.map((doc, idx) => {
                    let diff = idx - docIndex;
                    if (diff < -2) diff += 5;
                    if (diff > 2) diff -= 5;

                    const isCenter = diff === 0;
                    const isLeft = diff === -1;
                    const isRight = diff === 1;
                    const isVisible = Math.abs(diff) <= 1;

                    return (
                      <motion.div
                        key={doc.id}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                        }}
                        animate={{
                          x: `calc(-50% + ${diff * 112}%)`,
                          y: "-50%",
                          scale: isCenter ? 1.05 : 0.85,
                          opacity: isVisible ? (isCenter ? 1 : 0.5) : 0,
                          zIndex: isCenter ? 30 : (isVisible ? 20 : 10),
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                        className={`group w-[90%] sm:w-[360px] md:w-[480px] h-56 md:h-64 rounded-2xl border p-6 md:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden bg-gradient-to-tr ${doc.color} ${
                          isCenter
                            ? "border-brand shadow-[0_0_25px_rgba(140,255,0,0.15)] cursor-default"
                            : "border-white/10 cursor-pointer hover:border-white/30"
                        }`}
                        onClick={() => {
                          if (!isCenter) {
                            setDocIndex(idx);
                          }
                        }}
                      >
                        
                        {/* Browser Window Controls Mockup */}
                        <div className="flex items-center gap-1.5 opacity-40 z-10">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>

                        <div className="space-y-2 z-10 text-left pt-2">
                          <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-brand transition-colors">
                            {doc.title}
                          </h4>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {doc.desc}
                          </p>
                        </div>
                        <div className="text-xs text-brand uppercase tracking-widest font-mono z-10 text-left pt-1">
                          Mockup #{doc.id}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-6 mt-8">
                  <button
                    onClick={() => setDocIndex((prev) => (prev === 0 ? 4 : prev - 1))}
                    className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:border-brand hover:text-brand transition-all cursor-pointer bg-black/20 font-bold"
                  >
                    &lt;
                  </button>
                  <span className="text-sm font-mono text-text-secondary">
                    {docIndex + 1} / 5
                  </span>
                  <button
                    onClick={() => setDocIndex((prev) => (prev === 4 ? 0 : prev + 1))}
                    className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:border-brand hover:text-brand transition-all cursor-pointer bg-black/20 font-bold"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : (
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
            ) : (
              /* EXPERIENCE PANELS */
              <ScrollReveal delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-black border border-white/10 p-6 rounded-3xl glow-card min-h-[440px]">
                  {/* Left Column: Navigation Buttons */}
                  <div className="md:col-span-4 flex flex-col gap-3">
                    {Object.keys(magangData).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedMagang(key as keyof typeof magangData);
                          setDocIndex(2); // reset index
                        }}
                        className={`w-full py-4 px-6 text-left rounded-xl border text-base md:text-lg font-bold transition-all cursor-pointer ${
                          selectedMagang === key
                            ? "bg-white text-black border-white shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                            : "bg-transparent border-white/10 text-white hover:border-brand/40 hover:text-brand"
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
 
                  {/* Right Column: Experience Details */}
                  <div className="md:col-span-8 border border-white/10 p-6 rounded-2xl bg-[#050505] flex flex-col justify-between relative">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-base text-text-secondary font-semibold">
                          Lokasi : <span className="text-white">{magangData[selectedMagang].lokasi}</span>
                        </p>
                        <p className="text-base text-text-secondary font-semibold">
                          Bidang : <span className="text-white">{magangData[selectedMagang].bidang}</span>
                        </p>
                        <p className="text-base text-text-secondary font-semibold">
                          Jadwal : <span className="text-white">{magangData[selectedMagang].jadwal}</span>
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <p className="text-base text-text-secondary font-bold uppercase tracking-wider">Skill yang dipelajari :</p>
                        <ul className="space-y-1 pl-1">
                          {magangData[selectedMagang].skills.map((skill) => (
                            <li key={skill} className="text-base text-white flex items-center gap-2">
                              <span className="text-brand">~</span> {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 md:pt-0">
                      <button
                        onClick={() => setViewMode("documentation")}
                        className="text-base md:text-lg font-bold text-white hover:text-brand underline decoration-brand underline-offset-4 cursor-pointer transition-colors"
                      >
                        Dokumentasi
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
