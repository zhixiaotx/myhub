import React, { useState } from "react";
import { BookOpen, Star, Sparkles, Filter, ExternalLink } from "lucide-react";
import { ResourceItem } from "../types";

export default function ResourcesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const resources: ResourceItem[] = [
    {
      title: "Obsidian 个人知识库体系",
      category: "Workflow",
      tags: ["KM", "SOP", "CatOS"],
      rating: 5,
      description: "我的第二大脑，结合网状知识连接（Memo Graph原型），所有的 AI Prompt 与 视频脚本均在此迭代沉淀。",
      recommendedReason: "打破扁平化文件夹思维，用双向链接构建知识生命体。"
    },
    {
      title: "Cursor & v0.dev 极端个体开发套件",
      category: "AI Tool",
      tags: ["Coding", "AI Agent", "Frontend"],
      rating: 5,
      description: "1人+AI=1团队 的神级开发工具。几乎我所有的 CatOS 架构及本页面都是通过这个套件实现快速落地。",
      recommendedReason: "将人类思考成本从枯燥的代码语法中解放出来，集中精力在系统流程架构上。"
    },
    {
      title: "《系统之美》（Thinking in Systems）",
      category: "Book",
      tags: ["Systems", "Logic", "Must Read"],
      rating: 5,
      description: "Donella Meadows 著。系统思考的终极指南，指导我如何设计反馈回路、存量流量模型，并将 AI 视为一个调节回路。",
      recommendedReason: "只有读懂了系统，你才能合理、高效地设计多 Agent 协同的工作流。"
    },
    {
      title: "LangChain & AutoGen 进阶微智能体架构",
      category: "Course",
      tags: ["Developer", "Agent", "Orchestration"],
      rating: 4,
      description: "研究 Agent-kit 开发的重要技术借鉴，分析智能体对话状态管理及多智能体路由（Routing）控制。",
      recommendedReason: "了解多 Agent 框架底层逻辑、对话循环与状态机设计。"
    },
    {
      title: "《设计模式：可复用面向对象软件的基础》",
      category: "Book",
      tags: ["Architecture", "Pattern", "Engineering"],
      rating: 5,
      description: "软件工程圣经。对建筑学的实体构件、AI 设计系统（EDS）规则的抽象有着极大的借鉴意义。",
      recommendedReason: "设计模式不仅仅用于写代码，也是梳理 AI SOP 架构的重要方法论。"
    }
  ];

  const categories = ["all", "AI Tool", "Book", "Course", "Workflow"];

  const filteredResources = selectedCategory === "all"
    ? resources
    : resources.filter((r) => r.category === selectedCategory);

  return (
    <div id="resources-section" className="space-y-6">
      {/* Filters header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e6df] pb-4">
        <div>
          <h3 className="text-xl font-serif font-semibold text-[#1e293b]">Sky 的书架与 AI 工具链</h3>
          <p className="text-xs text-[#7c786c]">这些是我每日构建个体效率壁垒的底层燃料。</p>
        </div>

        <div className="flex flex-wrap gap-1 bg-[#ece9e2] p-1 rounded-lg text-xs font-mono font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md transition-all capitalize ${
                selectedCategory === cat
                  ? "bg-white text-[#1e293b] shadow-xs"
                  : "text-[#7c786c] hover:text-[#1e293b]"
              }`}
            >
              {cat === "all" ? "全部资源" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((item, idx) => (
          <div key={idx} className="bg-white border border-[#e8e6df] rounded-2xl p-5 flex flex-col justify-between hover:border-[#1e293b] transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#f4f2eb] text-[#7c786c]">
                  {item.category}
                </span>
                
                {/* Stars ratings */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="text-base font-serif font-bold text-[#1e293b] tracking-tight group-hover:text-[#a77a45] transition-all">
                {item.title}
              </h4>

              <p className="text-xs text-[#5c5952] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Tags and Recommendation Reason */}
            <div className="mt-4 pt-4 border-t border-dashed border-[#e8e6df] space-y-3 text-xs">
              <div className="bg-[#fbfaf7] p-2.5 rounded border border-[#e8e6df]">
                <span className="text-[10px] font-mono font-bold text-[#a77a45] uppercase block mb-1">推荐理由 (Recommendation)</span>
                <p className="text-xs text-[#7c786c] italic leading-relaxed">
                  &ldquo;{item.recommendedReason}&rdquo;
                </p>
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-1 font-mono text-[9px] text-gray-500 font-medium">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded-sm">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
