import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, Bot, User, CornerDownLeft, Sparkles, MessageSquare, Settings, Key, Save, Trash2, HelpCircle, AlertCircle, Check, Paperclip, FileText, Video, Music, Code, Mic, Square, Play, Pause, X, ChevronDown, ChevronUp, Copy, Eye, Upload, Download, Image, File, Terminal } from "lucide-react";
import { Message, Attachment } from "../types";

interface APIProfile {
  id: string;
  name: string;
  provider: "gemini" | "openai" | "anthropic" | "deepseek" | "custom";
  apiKey: string;
  customModel: string;
  customBaseUrl: string;
  temperature?: number;
  max_tokens?: number;
}

const AttachmentView = ({ attachments }: { attachments?: Attachment[] }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!attachments || attachments.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "programming":
        return <Code className="w-4 h-4 text-amber-600" />;
      case "audio":
        return <Music className="w-4 h-4 text-emerald-600" />;
      case "video":
        return <Video className="w-4 h-4 text-indigo-600" />;
      case "image":
        return <Image className="w-4 h-4 text-rose-500" />;
      case "file":
        return <File className="w-4 h-4 text-violet-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeNameCN = (type: string) => {
    switch (type) {
      case "programming":
        return "代码";
      case "audio":
        return "音频";
      case "video":
        return "视频";
      case "image":
        return "图片";
      case "file":
        return "文件";
      default:
        return "文档";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已复制到剪贴板");
  };

  return (
    <div className="mt-3 space-y-2 border-t border-[#e8e6df]/50 pt-2 w-full max-w-full">
      {attachments.map((att, i) => {
        const isExpanded = expandedIndex === i;
        const sizeKB = att.size ? Math.round(att.size / 1024) : 0;
        return (
          <div key={i} className="bg-[#fbfaf7] border border-[#e8e6df] rounded-xl p-3 flex flex-col gap-2 max-w-full overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                {getIcon(att.type)}
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-[#1e293b] truncate max-w-[150px] sm:max-w-[220px]" title={att.name}>
                    {att.name}
                  </div>
                  <div className="text-[10px] text-[#7c786c] font-mono">
                    {getTypeNameCN(att.type)} {sizeKB > 0 && `| ${sizeKB} KB`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {(att.type === "text" || att.type === "programming") && att.content && (
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    title={isExpanded ? "收起" : "展开查看"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Image rendering */}
            {att.type === "image" && (att.base64 || att.url) && (
              <div className="mt-1">
                <img
                  src={att.base64 ? `data:${att.mimeType};base64,${att.base64}` : att.url}
                  alt={att.name}
                  className="rounded-xl border border-[#e8e6df] max-h-[220px] max-w-full object-contain bg-white/40 p-1"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Audio rendering */}
            {att.type === "audio" && (att.base64 || att.url) && (
              <div className="mt-1">
                <audio
                  controls
                  src={att.base64 ? `data:${att.mimeType};base64,${att.base64}` : att.url}
                  className="w-full max-w-sm h-8 rounded-lg scale-90 -ml-4"
                />
              </div>
            )}

            {/* Video rendering */}
            {att.type === "video" && (att.base64 || att.url) && (
              <div className="mt-1">
                <video
                  controls
                  src={att.base64 ? `data:${att.mimeType};base64,${att.base64}` : att.url}
                  className="rounded-xl border border-[#e8e6df] max-h-[160px] max-w-xs object-cover"
                />
              </div>
            )}

            {/* Generic File download link */}
            {att.type === "file" && (att.base64 || att.url) && (
              <div className="mt-1">
                <a
                  href={att.base64 ? `data:${att.mimeType};base64,${att.base64}` : att.url}
                  download={att.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fbfaf7] hover:bg-[#ece9e2]/50 border border-[#e8e6df] hover:border-[#1e293b] text-[#1e293b] rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#8f8b80]" />
                  <span>下载文件 ({sizeKB > 0 ? `${sizeKB} KB` : "外部链接"})</span>
                </a>
              </div>
            )}

            {/* Code/Text expansion */}
            {isExpanded && (att.type === "text" || att.type === "programming") && att.content && (
              <div className="mt-2 border-t border-[#e8e6df]/50 pt-2 relative">
                <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                  <button
                    onClick={() => copyToClipboard(att.content || "")}
                    className="p-1 bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-md border border-[#e8e6df] shadow-xs"
                    title="复制内容"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <pre className="p-3 bg-[#f3f2eb] rounded-lg font-mono text-[11px] text-[#1e293b] leading-relaxed max-h-[200px] overflow-auto whitespace-pre">
                  <code>{att.content}</code>
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const resolveUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    const separator = url.startsWith("/") ? "" : "/";
    return `${window.location.origin}${separator}${url}`;
  }
  const separator = url.startsWith("/") ? "" : "/";
  return `http://localhost:3000${separator}${url}`;
};

const parseGenericResponse = (data: any): { text: string; attachments?: Attachment[] } => {
  if (!data) return { text: "未收到有效的 API 响应数据。" };

  // 0. Check for Google Gemini Imagen format
  // e.g. { generatedImages: [ { image: { imageBytes: "...", mimeType: "..." } } ] }
  if (data.generatedImages && Array.isArray(data.generatedImages) && data.generatedImages.length > 0) {
    const attachments: Attachment[] = [];
    let text = "🎨 **为您生成的多模态媒体如下：**\n\n";
    
    data.generatedImages.forEach((item: any, idx: number) => {
      const base64 = item.image?.imageBytes || item.imageBytes || "";
      if (base64) {
        const mimeType = item.image?.mimeType || "image/jpeg";
        const mediaUrl = `data:${mimeType};base64,${base64}`;
        text += `![生成图片 #${idx + 1}](${mediaUrl})\n`;
        attachments.push({
          name: `generated-image-${idx + 1}.jpg`,
          type: "image",
          mimeType,
          base64,
          url: undefined,
          size: Math.round(base64.length * 0.75)
        });
      }
    });
    return { text, attachments };
  }

  // 1. Check if it's an OpenAI-style image generation response
  // e.g. { data: [ { url: "..." } ] } or { data: [ { b64_json: "..." } ] }
  if (data.data && Array.isArray(data.data) && data.data.length > 0) {
    const firstItem = data.data[0];
    if (firstItem.url || firstItem.b64_json) {
      const attachments: Attachment[] = [];
      let text = "🎨 **为您生成的多模态媒体如下：**\n\n";
      
      data.data.forEach((item: any, idx: number) => {
        const isVideo = item.url?.match(/\.(mp4|webm|mov|mkv|avi)/i) || item.mimeType?.startsWith("video");
        const type = isVideo ? "video" : "image";
        const mimeType = isVideo ? "video/mp4" : "image/png";
        
        let mediaUrl = item.url || "";
        let base64 = item.b64_json || "";
        
        if (base64) {
          mediaUrl = `data:${mimeType};base64,${base64}`;
        }
        
        if (isVideo) {
          text += `🎥 [视频附件 #${idx + 1}](${mediaUrl})\n`;
        } else {
          text += `![生成图片 #${idx + 1}](${mediaUrl})\n`;
        }

        attachments.push({
          name: `generated-${type}-${idx + 1}.${isVideo ? "mp4" : "png"}`,
          type: type as "image" | "video",
          mimeType,
          base64: base64 || undefined,
          url: item.url || undefined,
          size: base64 ? Math.round(base64.length * 0.75) : 0
        });
      });
      return { text, attachments };
    }
  }

  // 2. Check for other formats with direct image/video arrays
  // e.g., Stable Diffusion / Midjourney custom APIs or other APIs returning { images: ["base64..."] } or { output: ["url..."] }
  const possibleMediaArrays = ["images", "outputs", "output", "results", "generated_images"];
  for (const key of possibleMediaArrays) {
    if (data[key] && Array.isArray(data[key]) && data[key].length > 0) {
      const first = data[key][0];
      if (typeof first === "string") {
        const attachments: Attachment[] = [];
        let text = "🎨 **为您生成的多模态媒体如下：**\n\n";
        
        data[key].forEach((item: string, idx: number) => {
          const isBase64 = !item.startsWith("http") && !item.startsWith("data:");
          const isVideo = item.match(/\.(mp4|webm|mov|mkv|avi)/i) || item.startsWith("data:video");
          const type = isVideo ? "video" : "image";
          const mimeType = isVideo ? "video/mp4" : "image/png";
          
          let mediaUrl = item;
          let base64 = "";
          if (isBase64) {
            base64 = item;
            mediaUrl = `data:${mimeType};base64,${item}`;
          }
          
          if (isVideo) {
            text += `🎥 [视频附件 #${idx + 1}](${mediaUrl})\n`;
          } else {
            text += `![生成图片 #${idx + 1}](${mediaUrl})\n`;
          }

          attachments.push({
            name: `generated-${type}-${idx + 1}.${isVideo ? "mp4" : "png"}`,
            type: type as "image" | "video",
            mimeType,
            base64: base64 || undefined,
            url: !isBase64 ? item : undefined,
            size: base64 ? Math.round(base64.length * 0.75) : 0
          });
        });
        return { text, attachments };
      }
    }
  }

  // 3. Single output URL or base64
  // e.g., { image: "..." } or { video: "..." } or { url: "..." }
  const singleKeys = ["image", "video", "imageUrl", "videoUrl", "img", "url"];
  for (const key of singleKeys) {
    if (data[key] && typeof data[key] === "string") {
      const val = data[key];
      const isVideo = key.toLowerCase().includes("video") || val.match(/\.(mp4|webm|mov|mkv|avi)/i) || val.startsWith("data:video");
      const isBase64 = !val.startsWith("http") && !val.startsWith("data:");
      const type = isVideo ? "video" : "image";
      const mimeType = isVideo ? "video/mp4" : "image/png";
      
      let mediaUrl = val;
      let base64 = "";
      if (isBase64) {
        base64 = val;
        mediaUrl = `data:${mimeType};base64,${val}`;
      }

      let text = `🎨 **为您生成了多模态媒体：**\n\n`;
      if (isVideo) {
        text += `🎥 [生成的视频](${mediaUrl})`;
      } else {
        text += `![生成的图片](${mediaUrl})`;
      }

      const attachments: Attachment[] = [{
        name: `generated-${type}.${isVideo ? "mp4" : "png"}`,
        type: type as "image" | "video",
        mimeType,
        base64: base64 || undefined,
        url: !isBase64 ? val : undefined,
        size: base64 ? Math.round(base64.length * 0.75) : 0
      }];
      return { text, attachments };
    }
  }

  // 4. Fallback chain for standard text completion formats
  if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    const choice = data.choices[0];
    if (choice.message && typeof choice.message.content === "string") {
      return { text: choice.message.content };
    }
    if (typeof choice.text === "string") {
      return { text: choice.text };
    }
  }

  if (data.candidates && Array.isArray(data.candidates) && data.candidates.length > 0) {
    const parts = data.candidates[0]?.content?.parts;
    if (Array.isArray(parts) && parts.length > 0 && typeof parts[0].text === "string") {
      return { text: parts[0].text };
    }
  }

  if (data.content) {
    if (Array.isArray(data.content) && data.content.length > 0 && typeof data.content[0].text === "string") {
      return { text: data.content[0].text };
    }
    if (typeof data.content === "string") {
      return { text: data.content };
    }
  }

  const textKeys = ["text", "response", "result", "output", "message", "content"];
  for (const key of textKeys) {
    if (data[key] && typeof data[key] === "string") {
      return { text: data[key] };
    }
  }

  // If the object has no recognizable structure but can be stringified
  try {
    return { text: typeof data === "string" ? data : JSON.stringify(data, null, 2) };
  } catch (e) {
    return { text: "无法解析 API 返回的响应内容。" };
  }
};

const defaultProfiles: APIProfile[] = [
  {
    id: "openai-default",
    name: "OpenAI 引擎",
    provider: "openai",
    apiKey: "",
    customModel: "gpt-4o-mini",
    customBaseUrl: "https://api.openai.com/v1"
  },
  {
    id: "gemini-default",
    name: "Gemini 引擎",
    provider: "gemini",
    apiKey: "",
    customModel: "gemini-2.5-flash",
    customBaseUrl: "https://generativelanguage.googleapis.com"
  },
  {
    id: "deepseek-default",
    name: "DeepSeek 引擎",
    provider: "deepseek",
    apiKey: "",
    customModel: "deepseek-chat",
    customBaseUrl: "https://api.deepseek.com/v1"
  },
  {
    id: "anthropic-default",
    name: "Anthropic 引擎",
    provider: "anthropic",
    apiKey: "",
    customModel: "claude-3-5-sonnet-20241022",
    customBaseUrl: "https://api.anthropic.com"
  }
];

const SYSTEM_INSTRUCTION = `
你现在是 Sky 的 AI 分身（或者是她的 AI 合作伙伴/Agent “Cat”）。
请根据以下背景信息回答用户的提问。保持 INTJ 的理性、严谨、有逻辑、追求系统化，同时充满热情、友好，专注于“1 Person + AI = 1 Team”的理念：

【关于 Sky / 你的背景】
- Tagline：在AI时代认真生活的女生 | 跟Agent搭档的第1年。
- Motto：1 Person + AI = 1 Team。
- MBTI：INTJ (建筑师/战略家)。
- 教育背景：大学四年学习建筑学，毕业于南京大学（Nanjing University，2015-2019），后在米兰理工大学（Politecnico di Milano）深造，深具建筑学的严谨逻辑与美学。
- 近况：目前定居在纽约（New York），是一家科技公司的联合创始人兼 CTO。
- 工作方式：每天深度与 AI 协同工作。在你的工作流里，AI 不是一个简单的问答工具，而是你的 Co-worker、搭档。

【你的核心项目 (CatOS 家族)】
1. content-engine: 多平台内容分发自动化工具，帮助你自动同步、管理和分发自媒体内容。
2. web-harvester: 高性能分布式爬虫框架，帮你从全网聚合关于 AI 的最新趋势、论文 and 资讯。
3. flow-runner: 可视化工作流编排引擎，让你能像搭积木一样编排你的 AI 代理任务。
4. agent-kit: 轻量级 AI Agent 构建框架，你自己开发的一套微型智能体编排 SDK。
5. memo-graph: 基于图数据库的个人知识管理系统，能够把你的阅读心得、AI 洞察整理成网状的关系图谱。

【你的设计哲学：Sky Design System (SDS)】
- 你反感“AI Slop”——那种廉价、泛滥的 AI 视觉模板（如紫蓝色荧光渐变、极度的玻璃拟物化、无意义的三栏式网格）。
- 你追求“标准美学”：用数学和光学原理规范 AI 产出。比如：数学化的比例步长、精细的排版、有呼吸感的间距、极简的高对比度中性色彩（Sophisticated Neutrals，带有轻微暖色或冷色调的灰白、深灰，配以琥珀色/石板色点缀）。
- 你制定了“7步 AI 视觉设计工作流”，使 AI 在不需要人类设计师介入的情况下，自动产出高质量、符合品牌 DNA 的设计。

请用第一人称（“我”或“我和我的 AI 搭档”）或者以 Agent “Cat” 的身份进行回答。用中文回答。回答要精炼、专业，体现系统思考，并适当流露出你在纽约的生活或对 AI 的深度实践见解。
`;

export default function AIChatAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是 Sky 的 AI 合作伙伴 Agent “Cat”。在这个数字空间里，我协助 Sky 调度工作流、分析资讯与撰写内容。有什么关于‘1 Person + AI = 1 Team’或者 Sky 设计系统与日常效率的问题想问我吗？"
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"persona" | "api" | "automation">("persona");
  const [exportFormat, setExportFormat] = useState<"md" | "html" | "txt" | "doc">(() => {
    try {
      const saved = localStorage.getItem("esther_export_format_pref");
      if (saved && ["md", "html", "txt", "doc"].includes(saved)) {
        return saved as any;
      }
    } catch {}
    return "md";
  });

  const handleExportFormatChange = (fmt: "md" | "html" | "txt" | "doc") => {
    setExportFormat(fmt);
    localStorage.setItem("esther_export_format_pref", fmt);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };
  const [settingsSuccess, setSettingsSuccess] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Multi-modal attachments state
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      const isCode = ["js", "ts", "tsx", "jsx", "py", "java", "cpp", "c", "html", "css", "json", "sh", "yaml", "yml", "md", "txt", "go", "rs", "sql"].includes(extension);
      const isAudio = file.type.startsWith("audio/") || ["mp3", "wav", "m4a", "ogg", "aac", "flac"].includes(extension);
      const isVideo = file.type.startsWith("video/") || ["mp4", "webm", "mov", "mkv", "avi"].includes(extension);
      const isImage = file.type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico", "tiff"].includes(extension);
      const isTextDoc = ["txt", "md", "csv", "json", "xml", "ini", "log"].includes(extension) || file.type.startsWith("text/");

      if (isCode) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const newAtt: Attachment = {
            name: file.name,
            type: "programming",
            mimeType: file.type || "text/plain",
            content,
            size: file.size
          };
          setPendingAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsText(file);
      } else if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(",")[1];
          const newAtt: Attachment = {
            name: file.name,
            type: "image",
            mimeType: file.type || "image/png",
            base64,
            size: file.size
          };
          setPendingAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      } else if (isAudio) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(",")[1];
          const newAtt: Attachment = {
            name: file.name,
            type: "audio",
            mimeType: file.type || "audio/mp3",
            base64,
            size: file.size
          };
          setPendingAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      } else if (isVideo) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(",")[1];
          const newAtt: Attachment = {
            name: file.name,
            type: "video",
            mimeType: file.type || "video/mp4",
            base64,
            size: file.size
          };
          setPendingAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      } else if (isTextDoc) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const newAtt: Attachment = {
            name: file.name,
            type: "text",
            mimeType: file.type || "text/plain",
            content,
            size: file.size
          };
          setPendingAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsText(file);
      } else {
        // Fallback for all other file types (pdf, docx, zip, xlsx, pptx, binary, etc.)
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(",")[1];
          const newAtt: Attachment = {
            name: file.name,
            type: "file",
            mimeType: file.type || "application/octet-stream",
            base64,
            size: file.size
          };
          setPendingAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        const file = new File([blob], `voice_record_${Date.now()}.mp3`, { type: "audio/mp3" });
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = (e.target?.result as string).split(",")[1];
          const newAtt: Attachment = {
            name: file.name,
            type: "audio",
            mimeType: "audio/mp3",
            base64,
            size: file.size
          };
          setPendingAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
        
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("无法启用麦克风录音，请确保在浏览器设置中开启了麦克风权限。");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Load Custom API profiles and configurations with migration support
  const [profiles, setProfiles] = useState<APIProfile[]>(() => {
    try {
      const saved = localStorage.getItem("esther_custom_api_profiles_v3");
      if (saved) {
        return JSON.parse(saved);
      }
      // Migration from old single-config setting
      const oldSaved = localStorage.getItem("esther_custom_api_settings");
      if (oldSaved) {
        const oldConfig = JSON.parse(oldSaved);
        return defaultProfiles.map((p) => {
          if (p.provider === oldConfig.provider) {
            return {
              ...p,
              apiKey: oldConfig.apiKey || "",
              customModel: oldConfig.customModel || p.customModel,
              customBaseUrl: oldConfig.customBaseUrl || p.customBaseUrl
            };
          }
          return p;
        });
      }
    } catch (e) {
      console.error("Failed to parse API profiles from localStorage", e);
    }
    return defaultProfiles;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const saved = localStorage.getItem("esther_active_profile_id_v3");
    if (saved) return saved;
    // Migration check
    try {
      const oldSaved = localStorage.getItem("esther_custom_api_settings");
      if (oldSaved) {
        const oldConfig = JSON.parse(oldSaved);
        const match = defaultProfiles.find((p) => p.provider === oldConfig.provider);
        if (match) return match.id;
      }
    } catch {}
    return "openai-default";
  });

  const [isCustomEnabled, setIsCustomEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("esther_custom_api_enabled_v3");
    if (saved !== null) return saved === "true";
    // Migration check
    try {
      const oldSaved = localStorage.getItem("esther_custom_api_settings");
      if (oldSaved) {
        const oldConfig = JSON.parse(oldSaved);
        return !!oldConfig.isEnabled;
      }
    } catch {}
    return false;
  });

  // Track which profile is selected for editing in the settings form
  const [editingProfileId, setEditingProfileId] = useState<string>("openai-default");

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedProfiles = localStorage.getItem("esther_custom_api_profiles_v3");
        const savedActiveId = localStorage.getItem("esther_active_profile_id_v3");
        const savedEnabled = localStorage.getItem("esther_custom_api_enabled_v3");
        if (savedProfiles) {
          setProfiles(JSON.parse(savedProfiles));
        }
        if (savedActiveId) {
          setActiveProfileId(savedActiveId);
        }
        if (savedEnabled !== null) {
          setIsCustomEnabled(savedEnabled === "true");
        }
      } catch (e) {
        console.error("Failed to sync from localStorage", e);
      }
    };

    window.addEventListener("storage", loadFromStorage);
    window.addEventListener("esther_profile_sync", loadFromStorage);
    return () => {
      window.removeEventListener("storage", loadFromStorage);
      window.removeEventListener("esther_profile_sync", loadFromStorage);
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const quickQuestions = [
    "你是怎么转行 AI 的？",
    "什么是 1 Person + AI = 1 Team？",
    "介绍下你的 CatOS 项目",
    "如何避免 AI 视觉同质化 (AI Slop)？"
  ];

  // Helper to dynamically set default model based on selected provider for a profile
  const handleProfileProviderChange = (id: string, provider: APIProfile["provider"]) => {
    let model = "";
    let baseUrl = "";
    switch (provider) {
      case "openai":
        model = "gpt-4o-mini";
        baseUrl = "https://api.openai.com/v1";
        break;
      case "gemini":
        model = "gemini-2.5-flash";
        baseUrl = "https://generativelanguage.googleapis.com";
        break;
      case "anthropic":
        model = "claude-3-5-sonnet-20241022";
        baseUrl = "https://api.anthropic.com";
        break;
      case "deepseek":
        model = "deepseek-chat";
        baseUrl = "https://api.deepseek.com/v1";
        break;
      case "custom":
        model = "custom-model";
        baseUrl = "";
        break;
    }
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              provider,
              customModel: model,
              customBaseUrl: baseUrl
            }
          : p
      )
    );
  };

  const handleUpdateProfileField = <K extends keyof APIProfile>(
    id: string,
    field: K,
    value: APIProfile[K]
  ) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (field === "apiKey" && typeof value === "string" && value.trim()) {
            setIsCustomEnabled(true);
          }
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const handleAddProfile = () => {
    const newId = `custom-profile-${Date.now()}`;
    const newProfile: APIProfile = {
      id: newId,
      name: `自定义引擎 #${profiles.length - defaultProfiles.length + 1}`,
      provider: "custom",
      apiKey: "",
      customModel: "custom-model",
      customBaseUrl: ""
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newId);
    setEditingProfileId(newId);
  };

  const handleSaveAll = () => {
    const currentActive = profiles.find((p) => p.id === activeProfileId);
    let nextEnabled = isCustomEnabled;
    if (currentActive && currentActive.apiKey.trim().length > 0) {
      nextEnabled = true;
      setIsCustomEnabled(true);
    }
    localStorage.setItem("esther_custom_api_profiles_v3", JSON.stringify(profiles));
    localStorage.setItem("esther_active_profile_id_v3", activeProfileId);
    localStorage.setItem("esther_custom_api_enabled_v3", nextEnabled.toString());
    window.dispatchEvent(new Event("esther_profile_sync"));
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm("确定要删除此自定义 API 引擎配置吗？")) {
      const remaining = profiles.filter((p) => p.id !== id);
      setProfiles(remaining);
      if (activeProfileId === id) {
        setActiveProfileId(remaining[0]?.id || "openai-default");
        localStorage.setItem("esther_active_profile_id_v3", remaining[0]?.id || "openai-default");
      }
      if (editingProfileId === id) {
        setEditingProfileId(remaining[0]?.id || "openai-default");
      }
      localStorage.setItem("esther_custom_api_profiles_v3", JSON.stringify(remaining));
      window.dispatchEvent(new Event("esther_profile_sync"));
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2000);
    }
  };

  const resetSettings = () => {
    if (window.confirm("确定要恢复默认设置吗？您添加的所有自定义引擎和 API Key 将被清除。")) {
      localStorage.removeItem("esther_custom_api_profiles_v3");
      localStorage.removeItem("esther_active_profile_id_v3");
      localStorage.removeItem("esther_custom_api_enabled_v3");
      localStorage.removeItem("esther_custom_api_settings");
      setProfiles(defaultProfiles);
      setActiveProfileId("openai-default");
      setEditingProfileId("openai-default");
      setIsCustomEnabled(false);
      window.dispatchEvent(new Event("esther_profile_sync"));
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2000);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    const hasAttachments = pendingAttachments.length > 0;
    if (!text.trim() && !hasAttachments) return;
    if (loading) return;

    setError(null);
    if (!textToSend) setInput("");

    // Create user message with attachments clone
    const attachmentsCopy = [...pendingAttachments];
    const newMsg: Message = {
      role: "user",
      content: text,
      attachments: attachmentsCopy
    };
    
    const newMessages: Message[] = [...messages, newMsg];
    setMessages(newMessages);
    setPendingAttachments([]); // clear pending queue
    setLoading(true);

    const hasClientKey = activeProfile && activeProfile.apiKey.trim().length > 0;

    // IF there is a client-side API Key configured, we run directly via the browser client
    if (hasClientKey) {
      try {
        const { provider, apiKey, customModel, customBaseUrl } = activeProfile;
        let responseText = "";
        let assistantAttachments: Attachment[] = [];

        // Detect if it is an image or video generation model to route endpoint correctly
        let isImageModel = false;
        let isVideoModel = false;
        const modelLower = (customModel || "").toLowerCase();
        const baseLower = (customBaseUrl || "").toLowerCase();
        
        if (
          modelLower.includes("video") ||
          modelLower.includes("sora") ||
          modelLower.includes("luma") ||
          modelLower.includes("runway") ||
          modelLower.includes("cogvideo") ||
          modelLower.includes("kling") ||
          modelLower.includes("pika") ||
          modelLower.includes("veo") ||
          modelLower.includes("hunyuan") ||
          modelLower.includes("t2v") ||
          modelLower.includes("i2v") ||
          baseLower.includes("/videos/generations") ||
          baseLower.includes("/video/generations")
        ) {
          isVideoModel = true;
        }

        if (!isVideoModel) {
          if (
            modelLower.includes("image") ||
            modelLower.includes("dall-e") ||
            modelLower.includes("flux") ||
            modelLower.includes("stable-diffusion") ||
            modelLower.includes("midjourney") ||
            modelLower.includes("sdxl") ||
            modelLower.includes("cogview") ||
            modelLower.includes("imagen") ||
            modelLower.includes("recraft") ||
            modelLower.includes("paint") ||
            modelLower.includes("drawing") ||
            modelLower.includes("t2i") ||
            modelLower.startsWith("sd-") ||
            baseLower.includes("/images/generations")
          ) {
            isImageModel = true;
          }
        }

        if (provider === "openai" || provider === "deepseek" || provider === "custom") {
          let base = customBaseUrl || "https://api.openai.com/v1";
          
          // Normalize the base URL by stripping any /videos, /images, /chat, /completions, etc. suffixes
          base = base.replace(/\/+videos\/?$/i, "")
                     .replace(/\/+video\/?$/i, "")
                     .replace(/\/+images\/?$/i, "")
                     .replace(/\/+image\/?$/i, "")
                     .replace(/\/+chat\/?$/i);
          
          let endpoint = base;
          
          if (
            !base.includes("/chat/completions") && 
            !base.includes("/completions") && 
            !base.includes("/generations") && 
            !base.includes("/messages")
          ) {
            if (isVideoModel) {
              endpoint = base.endsWith("/") ? `${base}video/generations` : `${base}/video/generations`;
            } else if (isImageModel) {
              endpoint = base.endsWith("/") ? `${base}images/generations` : `${base}/images/generations`;
            } else {
              endpoint = base.endsWith("/") ? `${base}chat/completions` : `${base}/chat/completions`;
            }
          }
          endpoint = resolveUrl(endpoint);
          
          let body: any;

          if (isImageModel || isVideoModel) {
            if (isVideoModel) {
              body = {
                model: customModel || "cogvideo",
                prompt: text || "An elegant generation",
                image_size: "1024x1024"
              };
            } else {
              body = {
                model: customModel || "dall-e-3",
                prompt: text || "An elegant generation",
                n: 1,
                size: "1024x1024"
              };
            }
          } else {
            // Standard chat completions formatted with real inline multi-modal data for supporting models
            const formattedMessages = newMessages.map((m) => {
              const hasAttachments = m.attachments && m.attachments.length > 0;
              if (!hasAttachments) {
                return {
                  role: m.role === "assistant" ? "assistant" : "user",
                  content: m.content || ""
                };
              }

              const contentArray: any[] = [];
              if (m.content) {
                contentArray.push({
                  type: "text",
                  text: m.content
                });
              }

              m.attachments!.forEach((a) => {
                if (a.type === "image" && a.base64) {
                  contentArray.push({
                    type: "image_url",
                    image_url: {
                      url: `data:${a.mimeType};base64,${a.base64}`
                    }
                  });
                } else if (a.type === "audio" && a.base64) {
                  let format = "wav";
                  const mt = (a.mimeType || "").toLowerCase();
                  if (mt.includes("mp3")) format = "mp3";
                  else if (mt.includes("wav")) format = "wav";
                  else if (mt.includes("ogg")) format = "ogg";
                  else if (mt.includes("m4a") || mt.includes("aac")) format = "wav";

                  contentArray.push({
                    type: "input_audio",
                    input_audio: {
                      data: a.base64,
                      format: format
                    }
                  });
                } else if (a.type === "video" && a.base64) {
                  contentArray.push({
                    type: "text",
                    text: `\n\n[已上传视频附件: ${a.name}, 格式: ${a.mimeType}, 大小: ${Math.round((a.size || 0) / 1024)} KB。提示：OpenAI-compatible 接口目前无法直接接收视频二进制流，如需完整的视频和语音解析，请在设置中切换使用原生的 Gemini 引擎。]`
                  });
                } else if (a.content) {
                  contentArray.push({
                    type: "text",
                    text: `\n\n【文件: ${a.name}】\n\`\`\`${a.type === "programming" ? "code" : ""}\n${a.content}\n\`\`\``
                  });
                } else if (a.base64) {
                  contentArray.push({
                    type: "text",
                    text: `\n\n[附件文件: ${a.name} (${a.type}), 大小: ${Math.round((a.size || 0) / 1024)} KB]`
                  });
                }
              });

              const finalContent = contentArray.length === 1 && contentArray[0].type === "text"
                ? contentArray[0].text
                : (contentArray.length > 0 ? contentArray : m.content || "");

              return {
                role: m.role === "assistant" ? "assistant" : "user",
                content: finalContent
              };
            });

            body = {
              model: customModel || (provider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini"),
              messages: [
                { role: "system", content: SYSTEM_INSTRUCTION },
                ...formattedMessages
              ],
              temperature: activeProfile?.temperature !== undefined ? Number(activeProfile.temperature) : 0.7
            };
            if (activeProfile?.max_tokens !== undefined && activeProfile.max_tokens > 0) {
              body.max_tokens = Number(activeProfile.max_tokens);
            }
          }

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.error?.message || `API 错误，状态码: ${res.status}`);
          }
          
          const parsed = parseGenericResponse(data);
          responseText = parsed.text;
          if (parsed.attachments) {
            assistantAttachments = parsed.attachments;
          }

        } else if (provider === "gemini") {
          const modelName = customModel || "gemini-2.5-flash";
          let base = customBaseUrl || "https://generativelanguage.googleapis.com";
          let endpoint = base;

          if (isImageModel) {
            // Google Imagen image generation!
            if (!base.includes("/v1beta/") && !base.includes("/v1/")) {
              endpoint = `${base}/v1beta/models/${modelName}:generateImages?key=${apiKey}`;
            } else if (!base.includes(":generateImages")) {
              const cleanedBase = base.split("/models/")[0];
              endpoint = `${cleanedBase}/v1beta/models/${modelName}:generateImages?key=${apiKey}`;
            }
            endpoint = resolveUrl(endpoint);

            const body = {
              prompt: text || "An elegant generation",
              numberOfImages: 1,
              aspectRatio: "1:1",
              outputMimeType: "image/jpeg"
            };

            const res = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data?.error?.message || `Gemini Imagen API 错误，状态码: ${res.status}`);
            }

            const parsed = parseGenericResponse(data);
            responseText = parsed.text;
            if (parsed.attachments) {
              assistantAttachments = parsed.attachments;
            }
          } else {
            // Standard generateContent
            if (!base.includes("/v1beta/") && !base.includes("/v1/")) {
              endpoint = `${base}/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            } else if (!base.includes("?key=")) {
              endpoint = `${base}?key=${apiKey}`;
            }
            endpoint = resolveUrl(endpoint);
            
            const body = {
              contents: newMessages.map((m) => {
                const parts: any[] = [];
                if (m.content) {
                  parts.push({ text: m.content });
                }
                if (m.attachments && m.attachments.length > 0) {
                  m.attachments.forEach((a) => {
                    if (a.base64) {
                      parts.push({
                        inlineData: {
                          mimeType: a.mimeType,
                          data: a.base64
                        }
                      });
                    } else if (a.content) {
                      parts.push({
                        text: `\n\n【附加文件: ${a.name}】\n\`\`\`\n${a.content}\n\`\`\``
                      });
                    }
                  });
                }
                if (parts.length === 0) {
                  parts.push({ text: "Please process this request." });
                }
                return {
                  role: m.role === "assistant" ? "model" : "user",
                  parts
                };
              }),
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              generationConfig: {
                temperature: activeProfile?.temperature !== undefined ? Number(activeProfile.temperature) : 0.7,
                ...(activeProfile?.max_tokens !== undefined && activeProfile.max_tokens > 0 ? { maxOutputTokens: Number(activeProfile.max_tokens) } : {})
              }
            };

            const res = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data?.error?.message || `Gemini API 错误，状态码: ${res.status}`);
            }
            
            const parsed = parseGenericResponse(data);
            responseText = parsed.text;
            if (parsed.attachments) {
              assistantAttachments = parsed.attachments;
            }
          }

        } else if (provider === "anthropic") {
          let base = customBaseUrl || "https://api.anthropic.com";
          let endpoint = base;
          if (!base.includes("/v1/messages") && !base.includes("/messages")) {
            endpoint = base.endsWith("/") ? `${base}v1/messages` : `${base}/v1/messages`;
          }
          endpoint = resolveUrl(endpoint);
          
          const formattedMessages = newMessages.map((m) => {
            const hasAttachments = m.attachments && m.attachments.length > 0;
            if (!hasAttachments) {
              return {
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content || ""
              };
            }

            const contentArray: any[] = [];
            if (m.content) {
              contentArray.push({
                type: "text",
                text: m.content
              });
            }

            m.attachments!.forEach((a) => {
              if (a.type === "image" && a.base64) {
                contentArray.push({
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: a.mimeType,
                    data: a.base64
                  }
                });
              } else if (a.content) {
                contentArray.push({
                  type: "text",
                  text: `\n\n【文件: ${a.name}】\n\`\`\`\n${a.content}\n\`\`\``
                });
              } else if (a.base64) {
                if (a.mimeType === "application/pdf") {
                  contentArray.push({
                    type: "document",
                    source: {
                      type: "base64",
                      media_type: "application/pdf",
                      data: a.base64
                    }
                  });
                } else {
                  contentArray.push({
                    type: "text",
                    text: `\n\n[附件媒体: ${a.name} (${a.type}), 大小: ${Math.round((a.size || 0) / 1024)} KB]`
                  });
                }
              }
            });

            const finalContent = contentArray.length === 1 && contentArray[0].type === "text"
              ? contentArray[0].text
              : (contentArray.length > 0 ? contentArray : m.content || "");

            return {
              role: m.role === "assistant" ? "assistant" : "user",
              content: finalContent
            };
          });

          const body = {
            model: customModel || "claude-3-5-sonnet-20241022",
            system: SYSTEM_INSTRUCTION,
            messages: formattedMessages,
            max_tokens: activeProfile?.max_tokens !== undefined && activeProfile.max_tokens > 0 ? Number(activeProfile.max_tokens) : 4096,
            temperature: activeProfile?.temperature !== undefined ? Number(activeProfile.temperature) : 0.7
          };

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify(body)
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.error?.message || `Claude API 错误，状态码: ${res.status}`);
          }
          
          const parsed = parseGenericResponse(data);
          responseText = parsed.text;
          if (parsed.attachments) {
            assistantAttachments = parsed.attachments;
          }
        }

        setMessages((prev) => [...prev, { role: "assistant", content: responseText, attachments: assistantAttachments.length > 0 ? assistantAttachments : undefined }]);
      } catch (err: any) {
        console.error("Client-Side API Call Failed:", err);
        setError(`自定义 API 调用失败: ${err.message || "请求异常。"} 请检查密钥、网络是否可用。如跨域被拦截，请尝试使用代理 Base URL。`);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Default: fallback to server proxy
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: newMessages })
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        // ignore JSON parse error
      }

      if (!response.ok) {
        const errMsg = data?.error || `HTTP 错误 ${response.status}：与 Agent 建立连接失败。`;
        throw new Error(errMsg);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "未知错误。请确保 Settings > Secrets 中配置了有效的 GEMINI_API_KEY。");
    } finally {
      setLoading(false);
    }
  };

  const exportHistory = (format: "md" | "html" | "txt" | "doc") => {
    if (messages.length === 0) {
      alert("没有对话记录可以导出！");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `chat_history_${timestamp}.${format}`;

    let content = "";
    let mimeType = "text/plain";

    if (format === "txt") {
      mimeType = "text/plain;charset=utf-8";
      content = `==================================================\n`;
      content += `AGENT CAT 对话历史记录\n`;
      content += `导出时间: ${new Date().toLocaleString()}\n`;
      content += `==================================================\n\n`;

      messages.forEach((msg) => {
        const role = msg.role === "user" ? "用户 (User)" : "智能体分身 (Agent Cat)";
        content += `[${role}] - ${new Date().toLocaleString()}\n`;
        content += `${"-".repeat(40)}\n`;
        content += `${msg.content}\n`;
        
        if (msg.attachments && msg.attachments.length > 0) {
          content += `\n【附件列表】:\n`;
          msg.attachments.forEach((att) => {
            content += `- [${att.type === "programming" ? "代码" : att.type === "audio" ? "音频" : att.type === "video" ? "视频" : "文档"}] ${att.name} (${att.size ? Math.round(att.size / 1024) : 0} KB)\n`;
          });
        }
        content += `\n${"=".repeat(50)}\n\n`;
      });
    } else if (format === "md") {
      mimeType = "text/markdown;charset=utf-8";
      content = `# Agent Cat 对话历史记录\n\n`;
      content += `> 导出时间: \`${new Date().toLocaleString()}\`\n\n`;
      content += `---\n\n`;

      messages.forEach((msg) => {
        const role = msg.role === "user" ? "用户" : "Agent Cat";
        content += `## 👤 ${role}\n\n${msg.content}\n\n`;

        if (msg.attachments && msg.attachments.length > 0) {
          content += `### 📎 附件\n`;
          msg.attachments.forEach((att) => {
            content += `- **${att.name}** (${att.type === "programming" ? "代码" : att.type === "audio" ? "音频" : att.type === "video" ? "视频" : "文档"})\n`;
          });
          content += `\n`;
        }
        content += `---\n\n`;
      });
    } else if (format === "html") {
      mimeType = "text/html;charset=utf-8";
      const messagesHtml = messages.map((msg) => {
        const roleName = msg.role === "user" ? "用户 (User)" : "Agent Cat";
        const roleClass = msg.role === "user" ? "role-user" : "role-assistant";
        const msgClass = msg.role === "user" ? "user" : "assistant";
        const avatar = msg.role === "user" ? "👤" : "🤖";
        
        let attachmentsHtml = "";
        if (msg.attachments && msg.attachments.length > 0) {
          attachmentsHtml = `
            <div class="attachments">
              <div style="font-weight: bold; margin-bottom: 6px;">附件列表:</div>
              ${msg.attachments.map(att => `
                <div class="attachment-item">
                  <span>${att.name}</span>
                  <span style="opacity: 0.7; font-size: 9px; margin-left: 6px;">(${att.type})</span>
                </div>
              `).join("")}
            </div>
          `;
        }

        let formattedContent = msg.content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br/>")
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/`([^`]+)`/g, "<code style='background: #f1f0ea; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 12px;'>$1</code>")
          .replace(/```(\w*)\s*([\s\S]+?)\s*```/g, "<pre style='background: #f1f0ea; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; overflow-x: auto;'><code>$2</code></pre>");

        return `
          <div class="message ${msgClass}">
            <div class="role ${roleClass}">
              <span>${avatar} ${roleName}</span>
            </div>
            <div class="content">${formattedContent}</div>
            ${attachmentsHtml}
          </div>
        `;
      }).join("\n");

      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Agent Cat 对话历史</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #faf9f6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
    h1 { font-size: 24px; color: #1e293b; border-bottom: 2px solid #e8e6df; padding-bottom: 12px; margin-bottom: 8px; }
    .meta { font-size: 12px; color: #7c786c; margin-bottom: 30px; font-family: monospace; }
    .message { margin-bottom: 24px; padding: 20px; border-radius: 12px; border: 1px solid #e8e6df; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
    .message.user { border-left: 4px solid #1e293b; background-color: #fbfaf7; }
    .message.assistant { border-left: 4px solid #a77a45; }
    .role { font-weight: bold; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .role-user { color: #1e293b; }
    .role-assistant { color: #a77a45; }
    .content { font-size: 13.5px; }
    .attachments { margin-top: 14px; padding-top: 10px; border-top: 1px solid #e8e6df; font-size: 11px; color: #7c786c; }
    .attachment-item { display: inline-flex; align-items: center; background: #f3f2eb; padding: 4px 8px; border-radius: 6px; margin-right: 8px; margin-bottom: 8px; font-family: monospace; }
  </style>
</head>
<body>
  <h1>Agent Cat 对话历史</h1>
  <div class="meta">导出时间: ${new Date().toLocaleString()} | 共 ${messages.length} 条对话</div>
  <div class="chat-container">
    ${messagesHtml}
  </div>
</body>
</html>`;
    } else if (format === "doc") {
      mimeType = "application/msword";
      const messagesDoc = messages.map((msg) => {
        const roleName = msg.role === "user" ? "用户 (User)" : "Agent Cat";
        const roleColor = msg.role === "user" ? "#1e293b" : "#a77a45";
        const bgColor = msg.role === "user" ? "#fbfaf7" : "#ffffff";
        
        let attachmentsDoc = "";
        if (msg.attachments && msg.attachments.length > 0) {
          attachmentsDoc = `
            <div style="margin-top: 10px; border-top: 1px solid #dddddd; padding-top: 5px; font-size: 9pt; color: #7c786c;">
              <strong>附件列表:</strong>
              ${msg.attachments.map(att => `<div style="background: #f3f2eb; padding: 2px 5px; margin-top: 2px; font-family: Courier New;">${att.name} (${att.type})</div>`).join("")}
            </div>
          `;
        }

        const formattedContent = msg.content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br/>");

        return `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e8e6df; border-left: 4px solid ${roleColor}; background-color: ${bgColor}; border-radius: 8px;">
            <p style="font-weight: bold; font-size: 11pt; color: ${roleColor}; margin: 0 0 8px 0;">
              ${msg.role === "user" ? "👤" : "🤖"} ${roleName}
            </p>
            <p style="font-size: 10.5pt; margin: 0; line-height: 1.5; color: #1e293b;">
              ${formattedContent}
            </p>
            ${attachmentsDoc}
          </div>
        `;
      }).join("\n");

      content = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <title>Agent Cat 对话历史</title>
  <style>
    body { font-family: 'Arial', sans-serif; color: #1e293b; line-height: 1.5; }
    h1 { font-size: 20pt; font-family: 'Georgia', serif; border-bottom: 2px solid #e8e6df; padding-bottom: 8px; margin-bottom: 4px; }
    .meta { font-size: 10pt; color: #7c786c; margin-bottom: 24px; }
  </style>
</head>
<body>
  <h1>Agent Cat 对话历史</h1>
  <p class="meta">导出时间: ${new Date().toLocaleString()} | 总计: ${messages.length} 条对话</p>
  <div class="chat-container">
    ${messagesDoc}
  </div>
</body>
</html>`;
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div id="ai-chat-agent" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Control Column (Persona + API Switcher) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Tab switcher buttons */}
        <div className="flex bg-[#ece9e2] p-1 rounded-xl text-xs font-mono font-bold w-full">
          <button
            onClick={() => setSidebarTab("persona")}
            className={`flex-1 py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              sidebarTab === "persona"
                ? "bg-white text-[#1e293b] shadow-xs"
                : "text-[#7c786c] hover:text-[#1e293b]"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>智能体</span>
          </button>
          <button
            onClick={() => setSidebarTab("api")}
            className={`flex-1 py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 relative ${
              sidebarTab === "api"
                ? "bg-white text-[#1e293b] shadow-xs"
                : "text-[#7c786c] hover:text-[#1e293b]"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>API配置</span>
            {isCustomEnabled && profiles.find((p) => p.id === activeProfileId)?.apiKey.trim() && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
          <button
            onClick={() => setSidebarTab("automation")}
            className={`flex-1 py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              sidebarTab === "automation"
                ? "bg-white text-[#1e293b] shadow-xs"
                : "text-[#7c786c] hover:text-[#1e293b]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>自动化面板</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="bg-[#faf9f6] border border-[#e8e6df] rounded-2xl p-5 md:p-6 flex-1 flex flex-col justify-between min-h-[380px] space-y-4">
          {sidebarTab === "persona" ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#a77a45]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e293b]">Agent “Cat” 设定</span>
                </div>

                <p className="text-xs text-[#5c5952] leading-relaxed">
                  此聊天室已被注入 Sky 的完整背景人格与 Sky 设计系统（SDS）规则。当没有配置自定义 API 时，将直连服务端的 <b>Gemini 3.6-flash</b> 作为默认智能体运行。
                </p>

                <div className="text-[11px] font-mono text-[#7c786c] space-y-1 bg-white p-3 rounded-lg border border-[#e8e6df]">
                  <div>• MBTI: <b>INTJ (建筑师)</b></div>
                  <div>• 系统指令: <b>Sky's Coworker Persona</b></div>
                  <div>• 温度系数: <b>0.7 (严谨且逻辑分明)</b></div>
                  <div>• 协同模式: <b>{isCustomEnabled ? `自定义 (${(profiles.find((p) => p.id === activeProfileId)?.provider || "custom").toUpperCase()})` : "内置免密钥 Fallback"}</b></div>
                </div>
              </div>

              {/* Quick Questions Grid inside Persona tab */}
              <div className="space-y-2 pt-4 border-t border-[#e8e6df]">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c786c] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#a77a45]" />
                  <span>快速提问建议</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      disabled={loading}
                      className="text-left text-[11px] font-sans p-2.5 bg-white hover:bg-[#ece9e2]/30 border border-[#e8e6df] hover:border-[#1e293b] rounded-lg text-[#1e293b] transition-all font-medium flex items-center justify-between group disabled:opacity-50"
                    >
                      <span className="truncate mr-2">{q}</span>
                      <CornerDownLeft className="w-3 h-3 text-[#8f8b80] shrink-0 group-hover:text-[#1e293b] opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : sidebarTab === "automation" ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between overflow-y-auto max-h-[600px] pr-1">
              <div className="space-y-3.5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#a77a45]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e293b]">自动化运行面板 (Automation Runner)</span>
                </div>
                <p className="text-[11px] text-[#7c786c] leading-relaxed">
                  实时监控与触发 CatOS 内部的后台自动化工作流任务。
                </p>

                <div className="space-y-2">
                  {[
                    { id: "content-engine", name: "content-engine", desc: "多平台内容自动分发引擎", tag: "Self-Media" },
                    { id: "web-harvester", name: "web-harvester", desc: "高性能 AI 论文与资讯爬虫", tag: "Research" },
                    { id: "flow-runner", name: "flow-runner", desc: "可视化工作流编排引擎", tag: "Orchestration" },
                    { id: "memo-graph", name: "memo-graph", desc: "图数据库知识管理系统", tag: "Knowledge" }
                  ].map((task) => (
                    <div key={task.id} className="p-3 bg-white border border-[#e8e6df] rounded-xl flex items-center justify-between shadow-xs">
                      <div>
                        <div className="text-xs font-mono font-bold text-[#1e293b]">{task.name}</div>
                        <div className="text-[10px] text-[#7c786c]">{task.desc}</div>
                      </div>
                      <button
                        onClick={() => handleSend(`请帮我立即触发并执行自动化流水线任务: ${task.name} (${task.desc})`)}
                        disabled={loading}
                        className="px-2.5 py-1 bg-[#1e293b] hover:bg-[#2d3a4f] text-white rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>触发</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[10px] text-amber-900 leading-relaxed font-mono">
                💡 提示：点击“触发”将自动向 Agent Cat 发送指令，Agent 将在右侧对话窗口实时调度并返回执行结果。
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col justify-between overflow-y-auto max-h-[600px] pr-1">
              {/* API Settings Form */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#a77a45]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e293b]">API 接口引擎管理</span>
                  </div>
                  {/* Enabled status toggle */}
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCustomEnabled}
                      onChange={(e) => setIsCustomEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#ece9e2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e293b]"></div>
                    <span className="ml-1.5 text-[10px] font-mono font-bold text-[#1e293b]">
                      {isCustomEnabled ? "启用" : "停用"}
                    </span>
                  </label>
                </div>

                <p className="text-[11px] text-[#7c786c] leading-relaxed">
                  您可以保存多个不同的 API 接口引擎，并在下方快速切换当前活跃的 AI 引擎。
                </p>

                {/* Profile Selector List */}
                <div className="space-y-2">
                  <div className="text-[10px] text-[#7c786c] font-bold uppercase tracking-wider">选择活跃引擎 / 引擎列表</div>
                  <div className="grid grid-cols-1 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {profiles.map((p) => {
                      const isActive = activeProfileId === p.id;
                      const hasKey = p.apiKey.trim().length > 0;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActiveProfileId(p.id);
                            setEditingProfileId(p.id);
                            if (p.apiKey.trim().length > 0) {
                              setIsCustomEnabled(true);
                            }
                          }}
                          className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer flex flex-col justify-between relative group ${
                            isActive
                              ? "bg-[#1e293b]/5 border-[#1e293b] ring-1 ring-[#1e293b]"
                              : "bg-white border-[#e8e6df] hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#1e293b] flex items-center gap-1">
                              {p.name}
                              {isActive && (
                                <span className="text-[9px] bg-[#1e293b] text-white px-1.5 py-0.5 rounded-sm font-normal scale-90">
                                  使用中
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] font-mono uppercase bg-[#ece9e2] text-[#5c5952] px-1.5 py-0.5 rounded-md">
                              {p.provider}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1 text-[10px] text-[#7c786c] font-mono">
                            <span className="truncate max-w-[120px]">{p.customModel || "默认模型"}</span>
                            <span className={hasKey ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                              {hasKey ? "● 已设 Key" : "○ 未设 Key"}
                            </span>
                          </div>

                          {/* Hover action delete (only for custom added profiles) */}
                          {!p.id.endsWith("-default") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProfile(p.id);
                              }}
                              className="absolute top-1 right-1 p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="删除此自定义配置"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleAddProfile}
                    className="w-full py-1.5 border border-dashed border-[#a77a45] hover:border-[#1e293b] rounded-lg text-center text-[11px] font-bold text-[#a77a45] hover:text-[#1e293b] transition-all bg-amber-50/20 hover:bg-amber-50/50"
                  >
                    + 添加自定义接口引擎
                  </button>
                </div>

                {/* Edit Section of Selected Profile */}
                {editingProfileId && (() => {
                  const editingProfile = profiles.find((p) => p.id === editingProfileId);
                  if (!editingProfile) return null;
                  return (
                    <div className="border-t border-[#e8e6df] pt-3.5 space-y-2.5">
                      <div className="text-[10px] text-[#a77a45] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Settings className="w-3.5 h-3.5" />
                        <span>配置详情: {editingProfile.name}</span>
                      </div>

                      <div className="space-y-2 text-xs font-mono">
                        {/* Profile name edit */}
                        <div>
                          <label className="block text-[10px] text-[#7c786c] mb-1 font-bold">引擎名称</label>
                          <input
                            type="text"
                            value={editingProfile.name}
                            onChange={(e) => handleUpdateProfileField(editingProfile.id, "name", e.target.value)}
                            className="w-full bg-white border border-[#e8e6df] rounded-lg p-1.5 focus:outline-hidden focus:border-[#1e293b]"
                          />
                        </div>

                        {/* Provider Selector */}
                        <div>
                          <label className="block text-[10px] text-[#7c786c] mb-1 font-bold">接口供应商 (PROVIDER)</label>
                          <select
                            value={editingProfile.provider}
                            onChange={(e) => handleProfileProviderChange(editingProfile.id, e.target.value as any)}
                            className="w-full bg-white border border-[#e8e6df] rounded-lg p-1.5 font-mono text-xs focus:outline-hidden focus:border-[#1e293b]"
                          >
                            <option value="openai">OpenAI (如 GPT-4o-mini)</option>
                            <option value="gemini">Google Gemini (自备 Key)</option>
                            <option value="deepseek">DeepSeek (性价比首选)</option>
                            <option value="anthropic">Anthropic Claude (最强推理)</option>
                            <option value="custom">Custom (OpenAI 兼容格式)</option>
                          </select>
                        </div>

                        {/* API Key */}
                        <div>
                          <label className="block text-[10px] text-[#7c786c] mb-1 font-bold">API KEY (保存在您的本地浏览器)</label>
                          <input
                            type="password"
                            placeholder="sk-..."
                            value={editingProfile.apiKey}
                            onChange={(e) => handleUpdateProfileField(editingProfile.id, "apiKey", e.target.value)}
                            className="w-full bg-white border border-[#e8e6df] rounded-lg p-1.5 text-xs focus:outline-hidden focus:border-[#1e293b]"
                          />
                        </div>

                        {/* Model Name */}
                        <div>
                          <label className="block text-[10px] text-[#7c786c] mb-1 font-bold">模型名称 (MODEL)</label>
                          <input
                            type="text"
                            placeholder="e.g. gpt-4o-mini"
                            value={editingProfile.customModel}
                            onChange={(e) => handleUpdateProfileField(editingProfile.id, "customModel", e.target.value)}
                            className="w-full bg-white border border-[#e8e6df] rounded-lg p-1.5 text-xs focus:outline-hidden focus:border-[#1e293b]"
                          />
                        </div>

                        {/* Base URL (Proxy/Endpoint) */}
                        <div>
                          <div className="flex items-center justify-between">
                            <label className="block text-[10px] text-[#7c786c] mb-1 font-bold">接口地址 (BASE URL - 选填)</label>
                            <div className="group relative">
                              <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                              <span className="absolute bottom-full right-0 w-48 p-2 bg-[#1e293b] text-[#faf9f6] text-[10px] leading-relaxed rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                本地直连如遇 CORS 跨域，推荐配置第三方代理 Base URL。
                              </span>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. https://api.openai.com/v1"
                            value={editingProfile.customBaseUrl}
                            onChange={(e) => handleUpdateProfileField(editingProfile.id, "customBaseUrl", e.target.value)}
                            className="w-full bg-white border border-[#e8e6df] rounded-lg p-1.5 text-xs focus:outline-hidden focus:border-[#1e293b]"
                          />
                        </div>

                        {/* Temperature & Max Tokens Parameters */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[10px] text-[#7c786c] mb-1 font-bold flex justify-between items-center">
                              <span>温度 (TEMP)</span>
                              <span className="text-amber-700 font-mono font-bold">{editingProfile.temperature !== undefined ? editingProfile.temperature : 0.7}</span>
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              value={editingProfile.temperature !== undefined ? editingProfile.temperature : 0.7}
                              onChange={(e) => handleUpdateProfileField(editingProfile.id, "temperature", Number(e.target.value))}
                              className="w-full h-1 bg-[#ece9e2] rounded-lg appearance-none cursor-pointer accent-[#1e293b]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#7c786c] mb-1 font-bold">MAX TOKENS</label>
                            <input
                              type="number"
                              placeholder="默认不限制"
                              value={editingProfile.max_tokens !== undefined ? editingProfile.max_tokens : ""}
                              onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                handleUpdateProfileField(editingProfile.id, "max_tokens", val);
                              }}
                              className="w-full bg-white border border-[#e8e6df] rounded-lg p-1 px-1.5 text-[11px] focus:outline-hidden focus:border-[#1e293b] font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Export Format Preference Section */}
              <div className="border-t border-[#e8e6df] pt-3.5 space-y-2.5">
                <div className="text-[10px] text-[#a77a45] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>导出格式偏好 (Export Format Preference)</span>
                </div>
                <p className="text-[11px] text-[#7c786c]">
                  设置您默认的聊天记录导出格式。点击一键下载按钮时将以此格式导出。
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["md", "html", "txt", "doc"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => handleExportFormatChange(fmt)}
                      className={`py-1.5 text-center text-xs font-mono font-bold rounded-lg border transition-all uppercase cursor-pointer ${
                        exportFormat === fmt
                          ? "bg-[#1e293b] text-white border-[#1e293b] shadow-xs"
                          : "bg-white text-[#1e293b] border-[#e8e6df] hover:border-gray-400"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Action Buttons */}
              <div className="pt-3 border-t border-[#e8e6df] flex gap-2">
                <button
                  onClick={handleSaveAll}
                  className="flex-1 bg-[#1e293b] hover:bg-[#2d3a4f] text-white text-xs font-mono py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存所有引擎</span>
                </button>
                <button
                  onClick={resetSettings}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-2 rounded-lg transition-all"
                  title="恢复默认"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {settingsSuccess && (
                <div className="text-[10px] font-mono text-emerald-600 flex items-center justify-center gap-1 animate-fade-in-up">
                  <Check className="w-3.5 h-3.5" />
                  <span>配置更新已安全写入 LocalStorage</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-8 flex flex-col h-[520px] bg-[#faf9f6] border border-[#e8e6df] rounded-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="border-b border-[#e8e6df] px-6 py-4 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isCustomEnabled && activeProfile && activeProfile.apiKey.trim() ? "bg-amber-500" : "bg-emerald-500"} animate-pulse`}></div>
            <div>
              <h4 className="text-sm font-semibold text-[#1e293b]">Sky 的 AI 分身 (Agent Cat)</h4>
              <p className="text-[10px] text-[#8f8b80] font-mono">
                {isCustomEnabled && activeProfile && activeProfile.apiKey.trim() ? (
                  <span className="text-amber-700 font-bold">
                    [客户端直连: {activeProfile.name}] Provider: {activeProfile.provider.toUpperCase()} | Model: {activeProfile.customModel || "默认"}
                  </span>
                ) : (
                  <span>Gemini 3.6-flash | Server-Side Secure Connection</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 relative">
            {/* One-click Export Button using preferred format */}
            <button
              type="button"
              onClick={() => exportHistory(exportFormat)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] hover:bg-[#2d3a4f] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
              title={`一键下载聊天记录 (${exportFormat.toUpperCase()})`}
              disabled={messages.length === 0}
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>一键下载 ({exportFormat.toUpperCase()})</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#fbfaf7] hover:bg-[#ece9e2]/50 border border-[#e8e6df] hover:border-[#1e293b] text-[#1e293b] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
                title="导出聊天历史"
                disabled={messages.length === 0}
              >
                <Download className="w-3.5 h-3.5 text-[#8f8b80]" />
                <span className="hidden sm:inline">导出对话</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8f8b80]" />
              </button>

              {/* Backdrop to dismiss on click outside */}
              {showExportMenu && (
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExportMenu(false);
                  }}
                />
              )}

              {/* Export menu card */}
              {showExportMenu && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#e8e6df] rounded-xl shadow-lg py-1.5 z-50 origin-top-right animate-fade-in animate-duration-100">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold text-[#7c786c] uppercase border-b border-[#e8e6df]/50 mb-1">
                    选择导出格式
                  </div>
                  <button
                    onClick={() => exportHistory("md")}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-[#1e293b] hover:bg-amber-50/50 hover:text-amber-900 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="font-bold text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded-sm">MD</span>
                    <span>Markdown (.md)</span>
                  </button>
                  <button
                    onClick={() => exportHistory("html")}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-[#1e293b] hover:bg-blue-50/50 hover:text-blue-900 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="font-bold text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-1 rounded-sm">HTML</span>
                    <span>网页格式 (.html)</span>
                  </button>
                  <button
                    onClick={() => exportHistory("txt")}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-[#1e293b] hover:bg-emerald-50/50 hover:text-emerald-900 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="font-bold text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1 rounded-sm">TXT</span>
                    <span>文本格式 (.txt)</span>
                  </button>
                  <button
                    onClick={() => exportHistory("doc")}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-[#1e293b] hover:bg-indigo-50/50 hover:text-indigo-900 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="font-bold text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-1 rounded-sm">DOC</span>
                    <span>Word 文档 (.doc)</span>
                  </button>
                </div>
              )}
            </div>

            <MessageSquare className="w-5 h-5 text-[#8f8b80]" />
          </div>
        </div>

        {/* Messages body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#faf9f6]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                  msg.role === "user"
                    ? "bg-[#1e293b] text-white"
                    : "bg-[#ece9e2] text-[#1e293b] border border-[#dfdad0]"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                  msg.role === "user"
                    ? "bg-[#1e293b] text-[#faf9f6] rounded-tr-none"
                    : "bg-white border border-[#e8e6df] text-[#1e293b] rounded-tl-none shadow-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.attachments && msg.attachments.length > 0 && (
                  <AttachmentView attachments={msg.attachments} />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-lg bg-[#ece9e2] border border-[#dfdad0] flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin text-[#a77a45]" />
              </div>
              <div className="p-3.5 bg-white border border-[#e8e6df] rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-gray-500 font-sans shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-gray-400" />
                <span>Agent Cat 正在思考与推演...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 leading-relaxed max-w-md mx-auto text-center font-sans font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Multi-modal Input Block with Drag-and-Drop and Voice Recording */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-t border-[#e8e6df] bg-white transition-all relative ${
            dragActive ? "bg-amber-50/20 ring-2 ring-dashed ring-amber-400" : ""
          }`}
        >
          {dragActive && (
            <div className="absolute inset-0 bg-[#faf9f6]/95 flex items-center justify-center gap-2 z-40 pointer-events-none">
              <Upload className="w-5 h-5 text-amber-600 animate-bounce" />
              <span className="text-xs font-bold text-[#1e293b]">松开鼠标以上传 图像/文档/音频/视频/代码/文件 附件</span>
            </div>
          )}

          {/* Pending attachments list */}
          {pendingAttachments.length > 0 && (
            <div className="px-4 pt-3 pb-1 border-b border-[#e8e6df]/50 bg-white flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
              {pendingAttachments.map((att, index) => {
                const sizeKB = att.size ? Math.round(att.size / 1024) : 0;
                return (
                  <div
                    key={index}
                    className="bg-[#fbfaf7] border border-[#e8e6df] p-1.5 pl-2.5 pr-1.5 flex items-center gap-2 rounded-xl text-[10px] text-[#1e293b] max-w-xs animate-fade-in"
                  >
                    {att.type === "programming" && <Code className="w-3.5 h-3.5 text-amber-600" />}
                    {att.type === "audio" && <Music className="w-3.5 h-3.5 text-emerald-600" />}
                    {att.type === "video" && <Video className="w-3.5 h-3.5 text-indigo-600" />}
                    {att.type === "image" && <Image className="w-3.5 h-3.5 text-rose-500" />}
                    {att.type === "file" && <File className="w-3.5 h-3.5 text-violet-600" />}
                    {att.type === "text" && <FileText className="w-3.5 h-3.5 text-blue-600" />}
                    
                    <span className="truncate max-w-[100px] font-semibold" title={att.name}>{att.name}</span>
                    {sizeKB > 0 && <span className="text-[#8f8b80] font-mono">({sizeKB} KB)</span>}
                    
                    <button
                      type="button"
                      onClick={() => setPendingAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="p-1 hover:text-red-500 hover:bg-red-50 rounded-md transition-all ml-1"
                      title="移除此文件"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Input controls form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 flex items-center gap-3 relative"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              multiple
              className="hidden"
              accept="*"
            />

            {/* Multi-modal tools */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Paperclip upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || isRecording}
                className="p-2.5 text-gray-500 hover:text-[#1e293b] hover:bg-gray-100 rounded-xl transition-all"
                title="添加任意多模态文件 (图片/文档/音频/视频/代码等)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice recording button */}
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="p-2 px-3 bg-red-500 text-white rounded-xl flex items-center gap-1.5 text-[10px] font-mono font-bold animate-pulse"
                  title="点击停止并保存录音"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>{Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={loading}
                  className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="录音/麦克风输入"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || isRecording}
              placeholder={
                isRecording
                  ? "正在录制音频中，点击红色按钮停止以将其附加入对话..."
                  : loading 
                    ? "思考中..." 
                    : "向 Agent Cat 提问，或直接拖放 代码、音视频、文档 至此处"
              }
              className="flex-1 bg-[#fbfaf7] border border-[#e8e6df] rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:border-[#1e293b] text-[#1e293b] placeholder-gray-400 font-sans"
            />

            <button
              type="submit"
              disabled={loading || isRecording || (!input.trim() && pendingAttachments.length === 0)}
              className="p-3 bg-[#1e293b] hover:bg-[#2d3a4f] disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

