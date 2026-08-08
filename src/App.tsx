import React, { useState, useEffect } from "react";
import { Terminal, Layout, Cpu, BookOpen, Bot, Compass, Sun, Moon } from "lucide-react";
import logoImg from "./assets/logo.jpg";
import IntroSection from "./components/IntroSection";
import ColaOSDashboard from "./components/ColaOSDashboard";
import DesignSystemPlayground from "./components/DesignSystemPlayground";
import SOPFlowchart from "./components/SOPFlowchart";
import AIChatAgent from "./components/AIChatAgent";
import ResourcesSection from "./components/ResourcesSection";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("app_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const sections = [
    { id: "intro", name: "Sky 个人 IP 主页", icon: Compass },
    { id: "catos", name: "CatOS 控制面板", icon: Terminal },
    { id: "eds", name: "Sky 设计系统 SDS", icon: Layout },
    { id: "sop", name: "AI 协作工作流 (SOP)", icon: Cpu },
    { id: "chat", name: "AI 合作伙伴 (Agent Cat)", icon: Bot },
    { id: "resources", name: "工具链 & 书架", icon: BookOpen }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`${id}-section`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#1e293b] font-sans antialiased selection:bg-[#ece9e2] selection:text-[#1e293b]">
      {/* Top Elegant Floating Header */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#e8e6df] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Sky Logo"
              className="w-9 h-9 rounded-lg object-cover shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-base font-serif font-bold text-[#1e293b] tracking-tight">
                Sky
              </h1>
              <p className="text-[10px] text-[#7c786c] font-mono tracking-wider uppercase font-semibold">
                晴空一鹤排云上，便引诗情到碧霄
              </p>
            </div>
          </div>

          {/* Nav Tabs for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#ece9e2]/60 p-1 rounded-xl text-xs font-mono font-bold">
            {sections.map((sect) => {
              const Icon = sect.icon;
              return (
                <button
                  key={sect.id}
                  onClick={() => scrollToSection(sect.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                    activeSection === sect.id
                      ? "bg-white text-[#1e293b] shadow-xs"
                      : "text-[#7c786c] hover:text-[#1e293b]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sect.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Status Indicator & Theme Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-[#f4f2eb] px-3.5 py-1.5 rounded-full border border-[#e8e6df] text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[#5c5952] font-semibold">CATOS ONLINE</span>
            </div>

            {/* Global Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#f4f2eb] hover:bg-[#e8e6df] border border-[#e8e6df] text-[#1e293b] transition-all cursor-pointer flex items-center justify-center shadow-xs"
              title={theme === "light" ? "切换至深色模式 (Comfort Dark)" : "切换至浅色模式 (Standard Light)"}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-[#1e293b]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16 md:space-y-24">
        {/* Intro section */}
        <section id="intro-section" className="scroll-mt-24">
          <IntroSection />
        </section>

        {/* Dashboard Section */}
        <section id="catos-section" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#e8e6df] pb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] tracking-tight">
              CatOS 控制面板与任务调度仪
            </h2>
            <p className="text-sm text-[#7c786c] mt-1.5">
              我的个人 AI 操作系统（Cat Operating System）的流控中枢。在此可触发并模拟调度我的日常自动化流。
            </p>
          </div>
          <ColaOSDashboard />
        </section>

        {/* Design System Section */}
        <section id="eds-section" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#e8e6df] pb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] tracking-tight">
              Sky 设计系统 (Sky Design System)
            </h2>
            <p className="text-sm text-[#7c786c] mt-1.5">
              将客观的、数学化的严谨结构赋能给 AI 视觉生成，杜绝过饱和与廉价的“AI Slop”视觉模板。
            </p>
          </div>
          <DesignSystemPlayground />
        </section>

        {/* SOP Flowchart Section */}
        <section id="sop-section" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#e8e6df] pb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] tracking-tight">
              AI 协同标准作业程序 (SOP)
            </h2>
            <p className="text-sm text-[#7c786c] mt-1.5">
              每一个高产出的个人，背后都有一套高度系统化、模块化的 AI 协同标准指南。在此检阅并复制我的 Prompt 模板。
            </p>
          </div>
          <SOPFlowchart />
        </section>

        {/* Chat Playground Section */}
        <section id="chat-section" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#e8e6df] pb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] tracking-tight">
              AI 合作伙伴 (Agent Cat)
            </h2>
            <p className="text-sm text-[#7c786c] mt-1.5">
              向注入了 Sky 完整背景与价值观人格的 AI 协同助手发起聊天，探讨 1 Person + AI = 1 Team 的实践。
            </p>
          </div>
          <AIChatAgent />
        </section>

        {/* Resources Shelf Section */}
        <section id="resources-section" className="scroll-mt-24 space-y-6">
          <ResourcesSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e8e6df] mt-16 md:mt-24 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Sky Footer Logo"
              className="w-8 h-8 rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-serif font-bold text-[#1e293b]">
                Sky 的 AI 个人空间
              </p>
              <p className="text-[10px] text-[#8f8b80] font-mono mt-0.5">
                © {new Date().getFullYear()} Sky. Built in New York with AI. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-mono text-[#7c786c] font-bold">
            <a href="#intro-section" onClick={() => scrollToSection("intro")} className="hover:text-[#1e293b] transition-all">
              主页 Intro
            </a>
            <span className="text-gray-300">/</span>
            <a href="#catos-section" onClick={() => scrollToSection("catos")} className="hover:text-[#1e293b] transition-all">
              CatOS Dashboard
            </a>
            <span className="text-gray-300">/</span>
            <a href="#eds-section" onClick={() => scrollToSection("eds")} className="hover:text-[#1e293b] transition-all">
              设计系统 SDS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

