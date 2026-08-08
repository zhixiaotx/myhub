import React from "react";
import { Compass, GraduationCap, MapPin, Briefcase, Award, Zap } from "lucide-react";
import logoImg from "../assets/logo.jpg";

export default function IntroSection() {
  return (
    <div id="intro-section" className="relative overflow-hidden rounded-2xl border border-[#e8e6df] bg-[#faf9f6] p-8 md:p-12 shadow-sm">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#1e293b 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Avatar and Quick Stats */}
        <div className="lg:col-span-4 flex flex-col items-center text-center">
          <div className="relative group">
            {/* Elegant framing instead of boring round avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-md transform transition-all duration-300 group-hover:scale-105">
              <img
                src={logoImg}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.failed) {
                    target.dataset.failed = "true";
                    target.src = "./logo.jpg";
                  }
                }}
                alt="Sky Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* INTJ badge */}
            <span className="absolute -bottom-2 right-4 bg-[#1e293b] text-[#faf9f6] text-xs font-mono px-2.5 py-1 rounded-full shadow-md font-semibold tracking-wider">
              INTJ
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-serif font-semibold text-[#1e293b] tracking-tight">Sky</h2>
          <p className="mt-1 text-sm text-[#7c786c] font-medium tracking-wide">1 Person + AI = 1 Team</p>
          
          <div className="mt-6 w-full pt-6 border-t border-[#e8e6df] flex flex-col gap-3 text-left text-sm text-[#4c4943]">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#8f8b80]" />
              <span>纽约 / New York</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-[#8f8b80]" />
              <span>科技公司联合创始人 &amp; CTO</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#8f8b80]" />
              <span>跟 Agent 搭档的第 1 年</span>
            </div>
          </div>
        </div>

        {/* Biography & Philosophy */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ece9e2] rounded-full text-xs text-[#1e293b] font-medium w-fit mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-serif italic font-semibold">“风拂白卉映澄空，坐看云起诗意生”</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif text-[#1e293b] leading-tight font-semibold">
            用系统思维重构个体效率：<br />
            <span className="text-[#a77a45]">我的 AI 协同生存法则</span>
          </h1>
          
          <p className="mt-6 text-base md:text-lg text-[#5c5952] leading-relaxed font-sans">
            你好，我是 Sky。一个拥有四年建筑学背景（本科毕业于 <b>南京大学</b> 2015-2019，后在 <b>米兰理工大学</b> 深造）的系统构建狂。
            建筑学训练了我如何用严谨的框架规范美学，而当 AI 时代来临，我选择将这种“系统设计”能力应用到人工智能的最佳协同实践中。
          </p>

          <p className="mt-4 text-base text-[#5c5952] leading-relaxed font-sans">
            我不做简单的问答，而致力于让 AI 成为能自动化处理、生产、洞察的 Co-worker。
            通过我自己开发的 <b>CatOS</b> 智能体矩阵以及 <b>Sky 设计系统（Sky Design System）</b>，我正在践行 1人 = 1团队 的未来工作范式。
          </p>

          {/* Educational background Timeline cards (flat layout, no nested border radius) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e8e6df]">
              <div className="p-2 bg-[#f4f2eb] rounded-lg text-[#1e293b]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1e293b]">南京大学 / NJU</h4>
                <p className="text-xs text-[#7c786c] mt-0.5">建筑学学士 · 2015 - 2019</p>
                <p className="text-xs text-[#8f8b80] mt-1">系统化设计思维与美学底蕴</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e8e6df]">
              <div className="p-2 bg-[#f4f2eb] rounded-lg text-[#1e293b]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1e293b]">米兰理工大学 / POLIMI</h4>
                <p className="text-xs text-[#7c786c] mt-0.5">建筑与城市设计深造</p>
                <p className="text-xs text-[#8f8b80] mt-1">人机交互、空间建构与精细化控制</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
