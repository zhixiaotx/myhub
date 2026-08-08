import React, { useState } from "react";
import { ListChecks, Copy, Check, ChevronRight, Settings, Layout, Search, FileText } from "lucide-react";

interface SOPItem {
  id: string;
  name: string;
  icon: any;
  purpose: string;
  steps: {
    title: string;
    description: string;
    action: string;
    prompt: string;
  }[];
}

export default function SOPFlowchart() {
  const [activeSOP, setActiveSOP] = useState<string>("design");
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number>(0);

  const sops: SOPItem[] = [
    {
      id: "design",
      name: "7步 AI 视觉设计工作流",
      icon: Layout,
      purpose: "规避低审美、过饱和的廉价 AI 视觉生成，使 AI 产出具备严谨、高级的中性审美排版与页面。",
      steps: [
        {
          title: "步骤 1: 确立品牌基因与基准色盘",
          description: "定义核心理念，剔除大面积的荧光紫蓝渐变，限制在 3 种主色以内，建立暖灰或冷灰中性色调。",
          action: "提取主题并分析适用性格",
          prompt: "你现在是一个顶尖的品牌视觉专家，请为我的 AI 主题网站进行品牌基因分析。摒弃无脑的‘未来主义紫蓝渐变’，建立一套基于暖灰/灰白（Sophisticated Neutrals）的高级中性配色。输出 5 种互补的 Hex 色值，并标明每个颜色的功能划分（背景、框体、边框、点缀色、正文字体）。"
        },
        {
          title: "步骤 2: 计算数学化字体与间距比例",
          description: "根据黄金比例或等比步长，确定大标题、中标题、正文及小标签的字体和间距比例。",
          action: "计算字体与 padding 步长",
          prompt: "请基于 16px 为基准字号，计算出一组完美四度 (Perfect Fourth, 1.333) 的排版比例步长。同时计算出外容器边距 padding 与子元素间距 gap。请记住金律：外容器 padding 必须大于或等于子元素 gap 至少 1.5 倍。"
        },
        {
          title: "步骤 3: 光学圆角半径几何嵌套计算",
          description: "计算内框和外框的嵌套比例，消除圆角边界的冲突和视觉凹陷。",
          action: "根据嵌套半径公式进行几何推演",
          prompt: "我的页面有一个大容器，其圆角设置为 24px，容器的外边距 padding 设置为 12px。在大容器内部，紧贴着一个内框作为内容区。请运用圆角光学嵌套公式 (Inner_Radius = Outer_Radius - Padding) 计算内框的完美内层圆角，以避免产生不均匀的光学畸变。"
        },
        {
          title: "步骤 4: 极简化框架与扁平化层级构建",
          description: "减少嵌套卡片的使用，改用负空间（Whitespace）和精细分割线进行视觉分区。",
          action: "用精细中性线段代替阴影叠层",
          prompt: "我希望构建一个两栏的控制面板，但我不想要传统的‘多层阴影卡片叠放（Nested Cards）’。请指导我如何通过极细的 1px 浅灰色（#e8e6df）分割线、高对比度黑白背景，以及 generous 的负空间来实现富有层次的呼吸感排版。"
        }
      ]
    },
    {
      id: "content",
      name: "多平台内容自适应重排 SOP",
      icon: FileText,
      purpose: "自动将深入的技术博客或 Markdown 笔记重写并完美适配不同社交平台的调性、字数和格式排版。",
      steps: [
        {
          title: "步骤 1: 抽取核心叙事与结构节点",
          description: "通过无监督提炼，去除冗余描述，抽象出最简结构树。",
          action: "生成结构树结构图",
          prompt: "我给你输入一篇长文笔记，请充当首席分析师，不遗漏任何核心干货，将其压缩为 5 个层级清晰的思维节点。去除废话，保留硬核数据和推导逻辑。"
        },
        {
          title: "步骤 2: 自适应平台文案多模态重写",
          description: "根据选择的平台（如小红书、Substack、Twitter），动态转换语调和格式。",
          action: "生成指定平台排版后的文案",
          prompt: "根据前面抽取出的思维节点，请将其重写为一篇适合‘小红书’发布的短文：1. 采用高亮 Emoji 做节点引导 2. 首句采用醒目的钩子（Hook） 3. 使用空行和段落保持呼吸感。然后再将其重写为一段适合‘Twitter’发布的 Thread。不要任何翻译腔。"
        },
        {
          title: "步骤 3: 提取视觉插画 Prompt 描述符",
          description: "分析重排后的文案，自动产出高质量的配图 Midjourney / Gemini 视觉 Prompt。",
          action: "生成高品质配图提示词",
          prompt: "针对这篇关于个体效率的文案，请生成一个适合用于首图的 AI 绘图提示词（Midjourney/Gemini Image）。要求：极简主义、高对比度、由精细线条与单一琥珀点缀色构成的轴测图（isometric illustration），色调锁定在暖灰与深黑，长宽比 16:9。"
        }
      ]
    },
    {
      id: "briefing",
      name: "全网 AI 论文与趋势挖掘 SOP",
      icon: Search,
      purpose: "让爬虫爬取的信息通过 Agent 自动整合，过滤噪声，生成有深度的每日决策情报。",
      steps: [
        {
          title: "步骤 1: 语义去噪与聚类关联",
          description: "将爬虫爬到的几十篇 Arxiv 摘要进行向量聚类，过滤纯学术垃圾。",
          action: "滤除非突破性论文，锁定核心成果",
          prompt: "这是我爬虫今天收集到的 30 篇 AI 相关摘要，请以一位资深人工智能架构师的专业直觉，剔除那些只是在老模型上微调参数的平庸论文，筛选出具有‘系统级突破’或‘工作流变革’的前沿工作（如长文本推理、多代理协同等），说明你筛选的硬核技术理由。"
        },
        {
          title: "步骤 2: 图谱关联节点扩展",
          description: "将筛选出的知识点连接到已有的知识图谱中，寻找关联蛛丝马迹。",
          action: "自动推演知识图谱关联度",
          prompt: "选中的论文为《ReAct: Synergizing Reasoning and Acting in Language Models》。这与我之前笔记中的‘Agent Kit 设计、智能体状态机编排’两个节点有哪些重叠与相互借鉴？请输出两个节点之间的新语义关系并说明解释。"
        },
        {
          title: "步骤 3: 每日决策摘要生成",
          description: "将硬核学术语汇转化为能用来指导当下项目开发或自媒体创作的通俗行动指南。",
          action: "输出今日情报快报",
          prompt: "请将上面的分析汇总为一份‘Sky 每日决策情报’：包含 1. 今日突破性成果 2. 它对我的微型项目（如 content-engine）有何现实优化建议 3. 适合在自媒体上展开分享的 3 个方向痛点。语气要求：冷静、理性、直接指明本质。"
        }
      ]
    }
  ];

  const handleCopy = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const selectedSOP = sops.find((s) => s.id === activeSOP) || sops[0];

  return (
    <div id="sop-flowchart" className="space-y-6">
      {/* Selector Tabs */}
      <div className="flex gap-2 bg-[#f4f2eb] p-1 rounded-xl w-full sm:w-max">
        {sops.map((sop) => {
          const Icon = sop.icon;
          return (
            <button
              key={sop.id}
              onClick={() => {
                setActiveSOP(sop.id);
                setExpandedStep(0);
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeSOP === sop.id
                  ? "bg-white text-[#1e293b] shadow-xs"
                  : "text-[#7c786c] hover:text-[#1e293b]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sop.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step Navigation List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#faf9f6] p-5 rounded-2xl border border-[#e8e6df] space-y-2">
            <h4 className="text-sm font-semibold text-[#1e293b]">SOP 目标：</h4>
            <p className="text-xs text-[#5c5952] leading-relaxed">{selectedSOP.purpose}</p>
          </div>

          <div className="space-y-2">
            {selectedSOP.steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedStep(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  expandedStep === idx
                    ? "bg-white border-[#1e293b] shadow-xs"
                    : "bg-[#faf9f6] border-[#e8e6df] hover:border-[#1e293b]"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#a77a45] font-bold">STEP 0{idx + 1}</span>
                  <h5 className="text-sm font-sans font-semibold text-[#1e293b]">{step.title}</h5>
                  <p className="text-xs text-[#7c786c] line-clamp-1">{step.description}</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-all ${expandedStep === idx ? "rotate-90 text-[#1e293b]" : ""}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Expanded View */}
        <div className="lg:col-span-7 bg-white border border-[#e8e6df] rounded-2xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
          {selectedSOP.steps[expandedStep] && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-[#f4f2eb] px-2.5 py-1 rounded-md text-[#1e293b]">
                    正在检视：第 0{expandedStep + 1} 步
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    可用度: 生产就绪 (Production Ready)
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1e293b]">
                  {selectedSOP.steps[expandedStep].title}
                </h3>

                <p className="text-sm text-[#5c5952] leading-relaxed">
                  {selectedSOP.steps[expandedStep].description}
                </p>

                <div className="pt-3 border-t border-dashed border-[#e8e6df] space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[#7c786c] flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-[#a77a45]" />
                    <span>核心执行目标 (SOP Action)</span>
                  </div>
                  <p className="text-xs text-[#1e293b] font-mono bg-[#fbfaf7] p-2.5 rounded border border-[#e8e6df]">
                    {selectedSOP.steps[expandedStep].action}
                  </p>
                </div>
              </div>

              {/* Copyable Prompts Container */}
              <div className="space-y-2 pt-4 border-t border-[#e8e6df]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#7c786c]">Sky 的 Agent 提示词模板：</span>
                  <button
                    onClick={() => handleCopy(selectedSOP.steps[expandedStep].prompt, `step-${expandedStep}`)}
                    className="text-xs font-mono font-bold text-[#a77a45] hover:text-[#1e293b] flex items-center gap-1.5"
                  >
                    {copiedStep === `step-${expandedStep}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">复制成功</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制提示词</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#1a1917] rounded-xl p-4 border border-[#2d2c29] text-[#dedcd5] font-mono text-xs max-h-48 overflow-y-auto leading-relaxed select-all whitespace-pre-wrap">
                  {selectedSOP.steps[expandedStep].prompt}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
