import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Play, RefreshCw, Cpu, Database, Network, CheckCircle, Square, Activity, Settings, Plus, Trash2, Check, HelpCircle, Save, ChevronRight, Sliders, Layers, Key, PieChart as PieChartIcon, Pin, Flag, FileText, Download, Upload, Sparkles, Edit3, X, Palette, Tag } from "lucide-react";
import { ProjectRepo, CategoryColor } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";

export const CATEGORY_COLOR_CONFIG: Record<CategoryColor, {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
  cardBorderHover: string;
  ringColor: string;
}> = {
  blue: {
    label: "工作",
    badgeBg: "bg-blue-50/90 hover:bg-blue-100",
    badgeText: "text-blue-700 font-semibold",
    badgeBorder: "border-blue-200",
    dotBg: "bg-blue-500",
    cardBorderHover: "hover:border-blue-400",
    ringColor: "ring-blue-400"
  },
  purple: {
    label: "学习",
    badgeBg: "bg-purple-50/90 hover:bg-purple-100",
    badgeText: "text-purple-700 font-semibold",
    badgeBorder: "border-purple-200",
    dotBg: "bg-purple-500",
    cardBorderHover: "hover:border-purple-400",
    ringColor: "ring-purple-400"
  },
  rose: {
    label: "生活",
    badgeBg: "bg-rose-50/90 hover:bg-rose-100",
    badgeText: "text-rose-700 font-semibold",
    badgeBorder: "border-rose-200",
    dotBg: "bg-rose-500",
    cardBorderHover: "hover:border-rose-400",
    ringColor: "ring-rose-400"
  },
  amber: {
    label: "自媒体",
    badgeBg: "bg-amber-50/90 hover:bg-amber-100",
    badgeText: "text-amber-800 font-semibold",
    badgeBorder: "border-amber-200",
    dotBg: "bg-amber-500",
    cardBorderHover: "hover:border-amber-400",
    ringColor: "ring-amber-400"
  },
  teal: {
    label: "科研",
    badgeBg: "bg-teal-50/90 hover:bg-teal-100",
    badgeText: "text-teal-700 font-semibold",
    badgeBorder: "border-teal-200",
    dotBg: "bg-teal-500",
    cardBorderHover: "hover:border-teal-400",
    ringColor: "ring-teal-400"
  },
  emerald: {
    label: "架构",
    badgeBg: "bg-emerald-50/90 hover:bg-emerald-100",
    badgeText: "text-emerald-700 font-semibold",
    badgeBorder: "border-emerald-200",
    dotBg: "bg-emerald-500",
    cardBorderHover: "hover:border-emerald-400",
    ringColor: "ring-emerald-400"
  },
  indigo: {
    label: "知识",
    badgeBg: "bg-indigo-50/90 hover:bg-indigo-100",
    badgeText: "text-indigo-700 font-semibold",
    badgeBorder: "border-indigo-200",
    dotBg: "bg-indigo-500",
    cardBorderHover: "hover:border-indigo-400",
    ringColor: "ring-indigo-400"
  },
  slate: {
    label: "通用",
    badgeBg: "bg-slate-100 hover:bg-slate-200",
    badgeText: "text-slate-700 font-semibold",
    badgeBorder: "border-slate-200",
    dotBg: "bg-slate-500",
    cardBorderHover: "hover:border-slate-400",
    ringColor: "ring-slate-400"
  }
};

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

const defaultProjects: ProjectRepo[] = [
  {
    id: "content-engine",
    name: "content-engine",
    desc: "多平台内容自动分发引擎。定时从 Obsidian 触发脚本，重排排版并自动分发至 Bilibili、YouTube、小红书及 Substack。",
    tag: "自媒体 · Self-Media",
    colorTag: "amber",
    status: "idling",
    logs: [
      "[content-engine] Initializing content pipeline...",
      "[content-engine] Fetching unpublished drafts from Obsidian Vault...",
      "[content-engine] Found draft: '1人公司生存指南.md'",
      "[content-engine] Processing markdown syntax and adapting templates for 小红书...",
      "[content-engine] Processing multimedia hooks...",
      "[content-engine] Adaptation complete. Syncing draft metadata...",
      "[content-engine] Distributing content to 小红书: Response 200 OK",
      "[content-engine] Distributing content to Substack: Response 200 OK",
      "[content-engine] Content Engine finished successfully. Placed 1 post, 2 sync queues."
    ]
  },
  {
    id: "web-harvester",
    name: "web-harvester",
    desc: "高性能分布式 AI 论文与资讯爬虫。全天候监控 Arxiv、Twitter 顶级 AI 学者及 GitHub Trendings，提取核心结构化数据。",
    tag: "科研 · Research",
    colorTag: "teal",
    status: "active",
    logs: [
      "[web-harvester] Launching cluster seeds (3 node endpoints)...",
      "[web-harvester] Crawling latest Arxiv preprints on 'LLM Agent reasoning'...",
      "[web-harvester] Fetched 14 papers. Extracting abstract features using Gemini Flash...",
      "[web-harvester] Filtered 3 critical documents with high impact factor.",
      "[web-harvester] Pushing research summaries directly into memo-graph database...",
      "[web-harvester] Completed crawler turn. Idling for 3600 seconds."
    ]
  },
  {
    id: "flow-runner",
    name: "flow-runner",
    desc: "可视化的低代码 AI 工作流编排引擎。将复杂的 Agent SOP 转换为流程图节点，让不同的 Agent 协同作业。",
    tag: "工作 · Orchestration",
    colorTag: "blue",
    status: "idling",
    logs: [
      "[flow-runner] Loading workflow: 'Daily Briefing SOP'...",
      "[flow-runner] Triggering Step 1: Web Harvester Query [SUCCESS]",
      "[flow-runner] Triggering Step 2: Extract key topics using Gemini [SUCCESS]",
      "[flow-runner] Triggering Step 3: Adaptive Script Generation [SUCCESS]",
      "[flow-runner] Workflow finished in 14.5 seconds. Auto-publishing newsletter."
    ]
  },
  {
    id: "agent-kit",
    name: "agent-kit",
    desc: "轻量级、完全可编程的 AI Agent 构建 SDK。内置状态机与动态上下文窗口管理器，专门用于管理微型协作 Agent。",
    tag: "学习 · Core SDK",
    colorTag: "purple",
    status: "active",
    logs: [
      "[agent-kit] Agent supervisor online.",
      "[agent-kit] Instantiating ResearcherAgent with deep search capability.",
      "[agent-kit] Instantiating EditorAgent with high standard EDS constraints.",
      "[agent-kit] Inter-agent communication channel secured.",
      "[agent-kit] System idle. Listening for runtime orchestration events..."
    ]
  },
  {
    id: "memo-graph",
    name: "memo-graph",
    desc: "基于图数据库的个人网状知识管理系统。将散落的日常点子、文献总结、代码片段自动串联，打破传统文件夹的线性限制。",
    tag: "生活 · Knowledge",
    colorTag: "rose",
    status: "idling",
    logs: [
      "[memo-graph] Loading schema: Entity-Relationship knowledge structure...",
      "[memo-graph] DB statistics: 1,420 nodes, 8,430 semantic connections.",
      "[memo-graph] Querying correlation map for '1 Person + AI'...",
      "[memo-graph] Retreived 14 interconnected nodes with depth=2.",
      "[memo-graph] Memo Graph cache flushed successfully."
    ]
  }
];

export default function ColaOSDashboard() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "kanban" | "table">("grid");
  const [cpuUsage, setCpuUsage] = useState<number>(34);
  const [memUsage, setMemUsage] = useState<number>(56);
  const [activeTasks, setActiveTasks] = useState<number>(2);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[System] CatOS v1.4.2 Booted successfully.",
    "[System] Graph connection verified with memo-graph instance.",
    "[Scheduler] 2 automated flows are currently idling.",
    "[Ready] Systems are nominal. Waiting for trigger..."
  ]);
  const [runningProject, setRunningProject] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<"status" | "tag">("status");
  const [notification, setNotification] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(true);
  const [pollingActive, setPollingActive] = useState<boolean>(true);

  // WebSocket & Polling simulation mechanism for real-time task status telemetry
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (!pollingActive) return;
      // Simulate live telemetry updates
      setCpuUsage(Math.floor(28 + Math.random() * 30));
      setMemUsage(Math.floor(52 + Math.random() * 12));
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [pollingActive]);

  // Model Configuration Center States
  const [profiles, setProfiles] = useState<APIProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("openai-default");
  const [isCustomEnabled, setIsCustomEnabled] = useState<boolean>(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>("openai-default");
  const [settingsSuccess, setSettingsSuccess] = useState<boolean>(false);

  // Completion Feedback & Ritual States
  const [soundFeedbackEnabled, setSoundFeedbackEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("cat_sound_feedback") || localStorage.getItem("cola_sound_feedback");
    return saved !== null ? saved === "true" : true;
  });
  const [visualShakeEnabled, setVisualShakeEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("cat_visual_shake") || localStorage.getItem("cola_visual_shake");
    return saved !== null ? saved === "true" : true;
  });
  const [shakeTriggered, setShakeTriggered] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("cat_sound_feedback", String(soundFeedbackEnabled));
  }, [soundFeedbackEnabled]);

  useEffect(() => {
    localStorage.setItem("cat_visual_shake", String(visualShakeEnabled));
  }, [visualShakeEnabled]);

  const playSuccessChime = () => {
    if (!soundFeedbackEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  };

  const triggerShakeEffect = () => {
    if (!visualShakeEnabled) return;
    setShakeTriggered(true);
    setTimeout(() => {
      setShakeTriggered(false);
    }, 600);
  };


  // Synchronize profiles with LocalStorage and listen to events from AIChatAgent
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedProfiles = localStorage.getItem("esther_custom_api_profiles_v3");
        const savedActiveId = localStorage.getItem("esther_active_profile_id_v3");
        const savedEnabled = localStorage.getItem("esther_custom_api_enabled_v3");
        
        if (savedProfiles) {
          setProfiles(JSON.parse(savedProfiles));
        } else {
          setProfiles(defaultProfiles);
        }
        if (savedActiveId) {
          setActiveProfileId(savedActiveId);
        }
        if (savedEnabled !== null) {
          setIsCustomEnabled(savedEnabled === "true");
        }
      } catch (e) {
        console.error("Failed to sync profiles in Dashboard", e);
      }
    };

    loadFromStorage();
    window.addEventListener("storage", loadFromStorage);
    window.addEventListener("esther_profile_sync", loadFromStorage);
    return () => {
      window.removeEventListener("storage", loadFromStorage);
      window.removeEventListener("esther_profile_sync", loadFromStorage);
    };
  }, []);

  const handleSaveProfiles = (updatedProfiles: APIProfile[], activeId: string, enabled: boolean) => {
    setProfiles(updatedProfiles);
    setActiveProfileId(activeId);
    setIsCustomEnabled(enabled);

    localStorage.setItem("esther_custom_api_profiles_v3", JSON.stringify(updatedProfiles));
    localStorage.setItem("esther_active_profile_id_v3", activeId);
    localStorage.setItem("esther_custom_api_enabled_v3", enabled.toString());
    
    // Dispatch synchronization event so AIChatAgent updates instantly
    window.dispatchEvent(new Event("esther_profile_sync"));

    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  const handleSwitchProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    const hasApiKey = profile && profile.apiKey.trim().length > 0;
    handleSaveProfiles(profiles, id, hasApiKey ? true : isCustomEnabled);
    
    setTerminalLogs(prev => [
      ...prev,
      `[Model Config] Switched active AI terminal to: "${profile?.name || id}" (Model: ${profile?.customModel || "default"}).`
    ]);
  };

  const handleUpdateProfileField = <K extends keyof APIProfile>(id: string, field: K, value: APIProfile[K]) => {
    const updated = profiles.map(p => {
      if (p.id === id) {
        const updatedProfile = { ...p, [field]: value };
        // If API Key is configured and saved, auto-enable custom profiles
        if (field === "apiKey" && typeof value === "string" && value.trim()) {
          setIsCustomEnabled(true);
        }
        return updatedProfile;
      }
      return p;
    });
    setProfiles(updated);
  };

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
    const updated = profiles.map(p => {
      if (p.id === id) {
        return { ...p, provider, customModel: model, customBaseUrl: baseUrl };
      }
      return p;
    });
    setProfiles(updated);
  };

  const handleAddProfile = () => {
    const newId = `custom-profile-${Date.now()}`;
    const newProfile: APIProfile = {
      id: newId,
      name: `自定义终端 #${profiles.length - defaultProfiles.length + 1}`,
      provider: "custom",
      apiKey: "",
      customModel: "custom-model",
      customBaseUrl: "",
      temperature: 0.7,
      max_tokens: 2048
    };
    const updated = [...profiles, newProfile];
    setEditingProfileId(newId);
    handleSaveProfiles(updated, newId, isCustomEnabled);
    
    setTerminalLogs(prev => [
      ...prev,
      `[Model Config] Created new custom AI terminal: "${newProfile.name}".`
    ]);
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm("确定要删除此自定义 AI 终端配置吗？")) {
      const remaining = profiles.filter(p => p.id !== id);
      const nextActiveId = activeProfileId === id ? (remaining[0]?.id || "openai-default") : activeProfileId;
      setEditingProfileId(nextActiveId);
      handleSaveProfiles(remaining, nextActiveId, isCustomEnabled);
      
      setTerminalLogs(prev => [
        ...prev,
        `[Model Config] Deleted custom AI terminal.`
      ]);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm("确定要恢复默认设置吗？您添加的所有自定义 AI 终端和 API Key 将被清除。")) {
      setEditingProfileId("openai-default");
      handleSaveProfiles(defaultProfiles, "openai-default", false);
      
      setTerminalLogs(prev => [
        ...prev,
        `[Model Config] Reset all AI terminal configurations to defaults.`
      ]);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportConfigs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      profiles,
      activeProfileId,
      isCustomEnabled,
      exportDate: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cat_os_api_profiles_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTerminalLogs(prev => [
      ...prev,
      `[Model Config] Exported API terminal configurations to JSON successfully.`
    ]);
  };

  const handleImportConfigs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed && Array.isArray(parsed.profiles)) {
            setProfiles(parsed.profiles);
            if (parsed.activeProfileId) setActiveProfileId(parsed.activeProfileId);
            if (typeof parsed.isCustomEnabled === "boolean") setIsCustomEnabled(parsed.isCustomEnabled);
            if (parsed.profiles[0]?.id) setEditingProfileId(parsed.profiles[0].id);
            handleSaveProfiles(parsed.profiles, parsed.activeProfileId || activeProfileId, parsed.isCustomEnabled ?? isCustomEnabled);
            setTerminalLogs(prev => [
              ...prev,
              `[Model Config] Imported API terminal configurations successfully (${parsed.profiles.length} profiles).`
            ]);
            alert(`成功导入 ${parsed.profiles.length} 个 AI 终端配置！`);
          } else {
            alert("导入失败：JSON 文件结构不符合 CatOS 终端配置规范。");
          }
        } catch (err) {
          alert("解析配置文件出错：" + err);
        }
      };
    }
  };

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const logIntervalRef = useRef<any>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (logIntervalRef.current) {
        clearInterval(logIntervalRef.current);
      }
    };
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Simulate system activity
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const next = prev + delta;
        return Math.min(Math.max(next, 10), runningProject ? 85 : 45);
      });
      setMemUsage((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + delta;
        return Math.min(Math.max(next, 30), runningProject ? 75 : 60);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [runningProject]);

  const taskFileInputRef = useRef<HTMLInputElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<"idling" | "running" | "active" | null>(null);

  // Category Color Filter & Inline Edit State
  const [selectedColorFilter, setSelectedColorFilter] = useState<CategoryColor | "all">("all");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editTag, setEditTag] = useState<string>("");
  const [editColorTag, setEditColorTag] = useState<CategoryColor>("blue");

  const startInlineEdit = (project: ProjectRepo) => {
    setEditingTaskId(project.id);
    setEditTitle(project.name);
    setEditDesc(project.desc || "");
    setEditTag(project.tag || "General");
    setEditColorTag(project.colorTag || "blue");
  };

  const saveInlineEdit = () => {
    if (!editingTaskId) return;
    const newTitle = editTitle.trim();
    if (!newTitle) {
      alert("任务标题不能为空");
      return;
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingTaskId
          ? {
              ...p,
              name: newTitle,
              desc: editDesc.trim(),
              tag: editTag.trim() || p.tag,
              colorTag: editColorTag
            }
          : p
      )
    );

    setTerminalLogs((prev) => [
      ...prev,
      `[Task Matrix] In-place edited task '${newTitle}' (Color: ${editColorTag}, ID: ${editingTaskId})`
    ]);

    setNotification(`✏️ 已保存任务「${newTitle}」及其分类颜色标记！`);
    setTimeout(() => setNotification(null), 3500);

    setEditingTaskId(null);
  };

  const handleChangeColorTag = (id: string, newColor: CategoryColor) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, colorTag: newColor } : p))
    );
    const colorLabel = CATEGORY_COLOR_CONFIG[newColor]?.label || newColor;
    setNotification(`🎨 已将任务分类颜色调整为「${colorLabel}」！`);
    setTimeout(() => setNotification(null), 3000);
  };

  const cancelInlineEdit = () => {
    setEditingTaskId(null);
  };

  // Trigger celebration particle explosion
  const triggerCelebrationParticles = (originX?: number, originY?: number) => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startX = originX && originX > 0 ? originX : window.innerWidth / 2;
    const startY = originY && originY > 0 ? originY : window.innerHeight / 3;

    const colors = ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#3b82f6", "#8b5cf6", "#eab308", "#f43f5e"];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      gravity: number;
      color: string;
      size: number;
      alpha: number;
      rotation: number;
      vRot: number;
      shape: "circle" | "square" | "star";
    }> = [];

    for (let i = 0; i < 65; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 13 + 4;
      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        gravity: 0.38,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 9 + 4,
        alpha: 1,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 14,
        shape: Math.random() > 0.6 ? "star" : Math.random() > 0.3 ? "square" : "circle"
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        activeParticles++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.97;
        p.rotation += p.vRot;
        p.alpha -= 0.018;

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            ctx.lineTo(Math.cos(((18 + j * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + j * 72) * Math.PI) / 180) * p.size);
            ctx.lineTo(Math.cos(((54 + j * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + j * 72) * Math.PI) / 180) * (p.size / 2));
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  const [projects, setProjects] = useState<ProjectRepo[]>(() => {
    try {
      const saved = localStorage.getItem("cat_os_projects_v1") || localStorage.getItem("cola_os_projects_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load saved projects", e);
    }
    return defaultProjects;
  });

  // Persist projects to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem("cat_os_projects_v1", JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to persist projects to localStorage", e);
    }
  }, [projects]);

  // Export tasks as JSON file
  const handleExportTasks = () => {
    try {
      const exportData = {
        version: "1.0",
        system: "CatOS Task Matrix",
        exportedAt: new Date().toISOString(),
        taskCount: projects.length,
        tasks: projects
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `cat_os_tasks_export_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setTerminalLogs((prev) => [
        ...prev,
        `[Export] Successfully exported ${projects.length} tasks to JSON configuration file.`
      ]);
      setNotification(`📥 已成功导出包含 ${projects.length} 项任务状态的 JSON 配置文件`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert("导出失败: " + err?.message);
    }
  };

  // Import tasks from JSON file
  const handleImportTasks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          const rawTasks = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.tasks) ? parsed.tasks : null);
          
          if (rawTasks && rawTasks.length > 0) {
            const validTasks: ProjectRepo[] = rawTasks.map((t: any, idx: number) => ({
              id: t.id || `task-${Date.now()}-${idx}`,
              name: t.name || `Task ${idx + 1}`,
              desc: t.desc || "",
              tag: t.tag || "General",
              status: ["active", "idling", "running"].includes(t.status) ? t.status : "idling",
              logs: Array.isArray(t.logs) ? t.logs : [],
              pinned: Boolean(t.pinned),
              priority: ["normal", "high", "urgent"].includes(t.priority) ? t.priority : "normal"
            }));

            setProjects(validTasks);
            setTerminalLogs((prev) => [
              ...prev,
              `[Import] Successfully imported ${validTasks.length} tasks from '${file.name}'.`
            ]);
            setNotification(`🎉 成功导入并同步了 ${validTasks.length} 项任务数据！`);
            playSuccessChime();
            triggerShakeEffect();
            setTimeout(() => setNotification(null), 5000);
          } else {
            alert("导入失败：所选 JSON 文件不包含符合 CatOS 规范的任务数据。");
          }
        } catch (err) {
          alert("解析文件失败：请确保选择的是由 CatOS 导出的有效 JSON 任务清单文件。");
        } finally {
          if (taskFileInputRef.current) {
            taskFileInputRef.current.value = "";
          }
        }
      };
    }
  };

  const triggerProject = (projId: string) => {
    if (runningProject) return;

    setRunningProject(projId);
    setProjects((prev) =>
      prev.map((p) => (p.id === projId ? { ...p, status: "running" } : p))
    );
    setActiveTasks((prev) => prev + 1);

    const project = projects.find((p) => p.id === projId);
    if (!project) return;

    // Start streaming logs in terminal
    setTerminalLogs((prev) => [
      ...prev,
      `[User Trigger] Manually initiating pipeline: ${projId}...`
    ]);

    let logIdx = 0;
    if (logIntervalRef.current) {
      clearInterval(logIntervalRef.current);
    }

    logIntervalRef.current = setInterval(() => {
      if (logIdx < project.logs.length) {
        const nextLog = project.logs[logIdx];
        if (nextLog !== undefined) {
          setTerminalLogs((prev) => [...prev, nextLog]);
        }
        logIdx++;
      } else {
        if (logIntervalRef.current) {
          clearInterval(logIntervalRef.current);
          logIntervalRef.current = null;
        }
        setRunningProject(null);
        setActiveTasks((prev) => Math.max(0, prev - 1));
        setProjects((prev) =>
          prev.map((p) => (p.id === projId ? { ...p, status: "active" } : p))
        );
        setTerminalLogs((prev) => [
          ...prev,
          `[WebSocket / Push] 任务 [${project.name}] 执行完毕，状态已自动转为「已完成/活跃」(Active)。`
        ]);
        setNotification(`✅ 自动化任务「${project.name}」已顺利完成，看板状态已实时更新为「已完成」`);
        playSuccessChime();
        triggerShakeEffect();
        setTimeout(() => setNotification(null), 5000);
      }
    }, 600);
  };

  const handleDropToColumn = (
    taskId: string, 
    targetStatus: "idling" | "running" | "active", 
    dropX?: number, 
    dropY?: number
  ) => {
    setDraggingTaskId(null);
    setDragOverColumn(null);

    const targetProject = projects.find((p) => p.id === taskId);
    if (!targetProject) return;

    if (targetProject.status === targetStatus) return;

    setProjects((prev) =>
      prev.map((p) => (p.id === taskId ? { ...p, status: targetStatus } : p))
    );

    const statusLabelMap = {
      idling: "待机",
      running: "执行中",
      active: "已完成/活跃"
    };

    setTerminalLogs((prev) => [
      ...prev,
      `[Kanban DragDrop] Task '${targetProject.name}' moved to ${targetStatus.toUpperCase()}`
    ]);

    if (targetStatus === "active") {
      triggerCelebrationParticles(dropX, dropY);
      playSuccessChime();
      triggerShakeEffect();
      setNotification(`🎉 任务「${targetProject.name}」已移动至已完成/活跃状态！`);
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification(`↔️ 任务「${targetProject.name}」已移动至 ${statusLabelMap[targetStatus]} 栏目`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUpdateProjectStatus = (
    projId: string, 
    newStatus: "idling" | "running" | "active",
    clickX?: number,
    clickY?: number
  ) => {
    const targetProject = projects.find((p) => p.id === projId);
    setProjects((prev) =>
      prev.map((p) => (p.id === projId ? { ...p, status: newStatus } : p))
    );

    if (newStatus === "active") {
      triggerCelebrationParticles(clickX, clickY);
      playSuccessChime();
      triggerShakeEffect();
      setNotification(`🎉 任务「${targetProject?.name || projId}」标记为已完成/活跃！`);
      setTimeout(() => setNotification(null), 4000);
    }

    setTerminalLogs((prev) => [
      ...prev,
      `[Kanban] Task ${projId} status changed to ${newStatus.toUpperCase()}`
    ]);
  };

  const handleTogglePin = (projId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projId ? { ...p, pinned: !p.pinned } : p))
    );
    setTerminalLogs((prev) => [
      ...prev,
      `[Dashboard] Toggled pin status for task ${projId}`
    ]);
  };

  const handleCyclePriority = (projId: string) => {
    const priorities: ("normal" | "high" | "urgent")[] = ["normal", "high", "urgent"];
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projId) {
          const current = p.priority || "normal";
          const nextIdx = (priorities.indexOf(current) + 1) % priorities.length;
          return { ...p, priority: priorities[nextIdx] };
        }
        return p;
      })
    );
    setTerminalLogs((prev) => [
      ...prev,
      `[Dashboard] Cycled priority for task ${projId}`
    ]);
  };

  const handleConvertToMemo = (project: ProjectRepo) => {
    setTerminalLogs((prev) => [
      ...prev,
      `[Memo-Graph] Converted task '${project.name}' into memo graph node: "${project.desc.slice(0, 30)}..." [SUCCESS]`
    ]);
    alert(`成功将任务 [${project.name}] 转为知识图谱便签 (Memo Node) 并同步至数据库！`);
  };

  const clearLogs = () => {
    setTerminalLogs([
      "[System] Terminal buffer cleared.",
      "[Ready] Listening for next trigger..."
    ]);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesTab =
      activeTab === "all" ||
      p.tag.toLowerCase().includes(activeTab.toLowerCase()) ||
      p.id === activeTab;
    const matchesColor =
      selectedColorFilter === "all" ||
      (p.colorTag || "blue") === selectedColorFilter;
    return matchesTab && matchesColor;
  });

  return (
    <div id="catos-dashboard" className={`space-y-8 ${shakeTriggered ? "animate-shake" : ""}`}>
      {/* Particle Celebration Canvas */}
      <canvas ref={particleCanvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Real-time WebSocket & Polling Notification Banner */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-900 text-white font-mono text-xs flex items-center justify-between shadow-lg animate-fade-in border border-emerald-700">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-200 hover:text-white font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* WebSocket / Polling Channel Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#1e293b] text-white font-mono text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}></span>
            <span className="font-bold">WebSocket 实时通道:</span>
            <span className="text-emerald-300">{wsConnected ? "已连接 (Connected)" : "已断开"}</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">状态轮询 (Polling):</span>
            <span className={pollingActive ? "text-amber-300 font-bold" : "text-slate-500"}>
              {pollingActive ? "🟢 自动监听中" : "⚪ 已暂停"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPollingActive(!pollingActive)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-all text-[11px]"
          >
            {pollingActive ? "暂停轮询" : "恢复轮询"}
          </button>
          <button
            onClick={() => {
              setWsConnected(false);
              setTimeout(() => setWsConnected(true), 1200);
              setTerminalLogs((prev) => [...prev, "[WebSocket] Manual reconnect handshake initiated... [SUCCESS]"]);
            }}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold transition-all text-[11px]"
          >
            重新握手
          </button>
          <a
            href="#task-explorer-section"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition-all text-[11px] font-bold flex items-center gap-1"
          >
            ↓ 智能体矩阵
          </a>
        </div>
      </div>

      {/* OS status strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#e8e6df] bg-white shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-700">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-[#8f8b80] font-mono">CPU 使用率</div>
            <div className="text-lg font-mono font-semibold text-[#1e293b]">{cpuUsage}%</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#e8e6df] bg-white shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#8f8b80] font-mono">内存占用</div>
            <div className="text-lg font-mono font-semibold text-[#1e293b]">{memUsage}%</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#e8e6df] bg-white shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#8f8b80] font-mono">活动智能体</div>
            <div className="text-lg font-mono font-semibold text-[#1e293b]">{activeTasks} Co-workers</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#e8e6df] bg-white shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-[#f4f2eb] rounded-lg text-[#1e293b]">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#8f8b80] font-mono">CatOS 状态</div>
            <div className="text-lg font-sans font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              <span>NOMINAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Visualization Analytics Module (Recharts Donut Chart) */}
      <div className="bg-[#faf9f6] border border-[#e8e6df] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e6df] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-[#1e293b]">任务执行分析与完成率监控</h3>
              <p className="text-sm text-[#7c786c]">实时统计多智能体矩阵的状态分布与分类占比</p>
            </div>
          </div>

          <div className="flex bg-[#ece9e2] p-1 rounded-lg text-xs font-mono">
            <button
              onClick={() => setChartMetric("status")}
              className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
                chartMetric === "status" ? "bg-white text-[#1e293b] shadow-xs" : "text-[#7c786c] hover:text-[#1e293b]"
              }`}
            >
              按运行状态
            </button>
            <button
              onClick={() => setChartMetric("tag")}
              className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
                chartMetric === "tag" ? "bg-white text-[#1e293b] shadow-xs" : "text-[#7c786c] hover:text-[#1e293b]"
              }`}
            >
              按分类模块
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="h-64 md:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    chartMetric === "status"
                      ? [
                          { name: "运行中 (Running)", value: projects.filter(p => p.status === "running").length || 1, color: "#f59e0b" },
                          { name: "活跃 (Active)", value: projects.filter(p => p.status === "active").length || 2, color: "#10b981" },
                          { name: "待机 (Idling)", value: projects.filter(p => p.status === "idling").length || 2, color: "#64748b" },
                        ]
                      : [
                          { name: "Self-Media", value: projects.filter(p => p.tag === "Self-Media").length, color: "#a77a45" },
                          { name: "Research", value: projects.filter(p => p.tag === "Research").length, color: "#3b82f6" },
                          { name: "Orchestration", value: projects.filter(p => p.tag === "Orchestration").length, color: "#8b5cf6" },
                          { name: "Core SDK", value: projects.filter(p => p.tag === "Core SDK").length, color: "#ec4899" },
                          { name: "Knowledge", value: projects.filter(p => p.tag === "Knowledge").length, color: "#10b981" },
                        ]
                  }
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(chartMetric === "status"
                    ? [
                        { color: "#f59e0b" },
                        { color: "#10b981" },
                        { color: "#64748b" },
                      ]
                    : [
                        { color: "#a77a45" },
                        { color: "#3b82f6" },
                        { color: "#8b5cf6" },
                        { color: "#ec4899" },
                        { color: "#10b981" },
                      ]
                  ).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#fff", fontSize: "12px", fontFamily: "monospace" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 p-5 bg-white border border-[#e8e6df] rounded-xl shadow-xs">
            <h4 className="text-sm font-mono font-bold text-[#1e293b] uppercase tracking-wider">执行效率概览</h4>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-[#7c786c]">总智能体任务数</span>
                <span className="font-bold text-[#1e293b]">{projects.length} 个</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-[#7c786c]">当前在线活跃度</span>
                <span className="font-bold text-emerald-600">88.4%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-[#7c786c]">自动化完成率</span>
                <span className="font-bold text-amber-600">96.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7c786c]">系统健康度</span>
                <span className="font-bold text-emerald-600">OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project explorer */}
      <div id="task-explorer-section" className="bg-[#faf9f6] border border-[#e8e6df] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e8e6df] pb-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-[#1e293b]">CatOS 个人智能体矩阵</h3>
            <p className="text-sm text-[#7c786c]">这些是我日常用来协同工作的核心开源与个人模块项目。</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Export & Import Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportTasks}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f4f2eb] border border-[#dcd8cd] text-xs font-mono font-semibold text-[#1e293b] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="将当前所有任务状态与指标导出为 JSON 配置文件，方便跨设备迁移"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>导出任务清单</span>
              </button>

              <label className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f4f2eb] border border-[#dcd8cd] text-xs font-mono font-semibold text-[#1e293b] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>导入任务清单</span>
                <input
                  type="file"
                  ref={taskFileInputRef}
                  accept=".json"
                  onChange={handleImportTasks}
                  className="hidden"
                />
              </label>
            </div>

            {/* View Mode Toggle: Grid vs Kanban vs Table */}
            <div className="flex bg-[#ece9e2] p-1 rounded-lg text-xs font-mono">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md transition-all font-semibold flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-white text-[#1e293b] shadow-xs"
                    : "text-[#7c786c] hover:text-[#1e293b]"
                }`}
              >
                <span>📊 网格视图</span>
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1.5 rounded-md transition-all font-semibold flex items-center gap-1.5 ${
                  viewMode === "kanban"
                    ? "bg-white text-[#1e293b] shadow-xs"
                    : "text-[#7c786c] hover:text-[#1e293b]"
                }`}
              >
                <span>📋 看板视图</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-md transition-all font-semibold flex items-center gap-1.5 ${
                  viewMode === "table"
                    ? "bg-white text-[#1e293b] shadow-xs"
                    : "text-[#7c786c] hover:text-[#1e293b]"
                }`}
              >
                <span>📑 表格列表</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-[#ece9e2] p-1 rounded-lg text-xs font-mono">
              {["All", "Self-Media", "Research", "Orchestration", "Core SDK", "Knowledge"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab === "All" ? "all" : tab)}
                  className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
                    (tab === "All" && activeTab === "all") || (tab.toLowerCase() === activeTab.toLowerCase())
                      ? "bg-white text-[#1e293b] shadow-xs"
                      : "text-[#7c786c] hover:text-[#1e293b]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Color Tag Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#e8e6df] shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1e293b]">
            <Palette className="w-4 h-4 text-amber-600" />
            <span>分类颜色维度:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setSelectedColorFilter("all")}
              className={`px-3 py-1 rounded-lg border transition-all font-semibold flex items-center gap-1.5 cursor-pointer ${
                selectedColorFilter === "all"
                  ? "bg-[#1e293b] text-white border-[#1e293b] shadow-2xs"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>全部颜色 ({projects.length})</span>
            </button>

            {(Object.keys(CATEGORY_COLOR_CONFIG) as CategoryColor[]).map((cKey) => {
              const cfg = CATEGORY_COLOR_CONFIG[cKey];
              const count = projects.filter((p) => (p.colorTag || "blue") === cKey).length;
              const isSelected = selectedColorFilter === cKey;
              return (
                <button
                  key={cKey}
                  onClick={() => setSelectedColorFilter(cKey)}
                  className={`px-2.5 py-1 rounded-lg border transition-all font-semibold flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? `${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} ring-2 ${cfg.ringColor} shadow-2xs`
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                  title={`分类颜色: ${cfg.label} (${count}个任务)`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotBg}`}></span>
                  <span>{cfg.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Render: Grid vs Kanban */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startInlineEdit(project);
                }}
                className={`p-5 rounded-xl border bg-white transition-all duration-200 relative group ${
                  project.status === "running"
                    ? "border-amber-500 ring-1 ring-amber-100"
                    : "border-[#e8e6df] hover:border-[#1e293b]"
                }`}
                title="💡 双击此卡片进行原位编辑"
              >
                {editingTaskId === project.id ? (
                  <div className="space-y-3 bg-amber-50/80 border border-amber-300 p-3.5 rounded-xl animate-fade-in shadow-inner" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-900 border-b border-amber-200/80 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                        <span>原位快速编辑</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-normal">Esc 取消 · Enter 保存</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold block mb-1">任务名称 / 标题</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveInlineEdit();
                          if (e.key === "Escape") cancelInlineEdit();
                        }}
                        autoFocus
                        className="w-full text-xs font-mono font-bold text-[#1e293b] bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                        placeholder="输入任务名称..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold block mb-1">详细描述</label>
                      <textarea
                        rows={2}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveInlineEdit();
                          if (e.key === "Escape") cancelInlineEdit();
                        }}
                        className="w-full text-xs text-[#1e293b] bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none shadow-xs"
                        placeholder="输入详细描述说明..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold block mb-1">分类文本</label>
                      <input
                        type="text"
                        value={editTag}
                        onChange={(e) => setEditTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveInlineEdit();
                          if (e.key === "Escape") cancelInlineEdit();
                        }}
                        className="w-full text-[11px] font-mono text-[#1e293b] bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                        placeholder="分类文本 (如: Research, Media)"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase font-semibold block mb-1">选择分类颜色标签</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(CATEGORY_COLOR_CONFIG) as CategoryColor[]).map((cKey) => {
                          const cfg = CATEGORY_COLOR_CONFIG[cKey];
                          const isSelected = editColorTag === cKey;
                          return (
                            <button
                              key={cKey}
                              type="button"
                              onClick={() => setEditColorTag(cKey)}
                              className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                                isSelected
                                  ? `${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} ring-2 ring-amber-500 shadow-xs scale-105`
                                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${cfg.dotBg}`}></span>
                              <span>{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200/80">
                      <button
                        onClick={cancelInlineEdit}
                        className="px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-mono font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>取消</span>
                      </button>
                      <button
                        onClick={saveInlineEdit}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>保存</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {(() => {
                          const cConfig = CATEGORY_COLOR_CONFIG[project.colorTag || "blue"];
                          return (
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${cConfig.badgeBg} ${cConfig.badgeText} ${cConfig.badgeBorder} shadow-2xs`}>
                              <span className={`w-2 h-2 rounded-full ${cConfig.dotBg}`}></span>
                              <span>{project.tag}</span>
                            </span>
                          );
                        })()}
                        <h4 className="text-base font-mono font-semibold text-[#1e293b] mt-2 flex items-center gap-2 group-hover:text-amber-700 transition-colors">
                          <span>{project.name}</span>
                          {project.status === "running" && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-sans font-medium animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" /> 执行中
                            </span>
                          )}
                          <Edit3 className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1" title="双击可原位编辑" />
                        </h4>
                      </div>
                      
                      <button
                        onClick={() => triggerProject(project.id)}
                        disabled={runningProject !== null}
                        className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                          project.status === "running"
                            ? "bg-amber-50 text-amber-700"
                            : runningProject !== null
                            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                            : "bg-[#1e293b] text-[#faf9f6] hover:bg-[#2d3a4f]"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>触发运行</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#5c5952] leading-relaxed mt-3">
                      {project.desc}
                    </p>

                    {/* Status Indicator Bar */}
                    <div className="mt-4 pt-3 border-t border-dashed border-[#e8e6df] flex items-center justify-between text-[11px] font-mono text-[#8f8b80]">
                      <span>Status:</span>
                      <span className={`font-semibold flex items-center gap-1 ${
                        project.status === "running"
                          ? "text-amber-600"
                          : project.status === "active"
                          ? "text-emerald-600"
                          : "text-gray-500"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          project.status === "running"
                            ? "bg-amber-500"
                            : project.status === "active"
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`}></span>
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Quick Action Bar */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTogglePin(project.id)}
                          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                            project.pinned ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                          title={project.pinned ? "取消置顶" : "置顶任务"}
                        >
                          <Pin className={`w-3.5 h-3.5 ${project.pinned ? "fill-amber-800" : ""}`} />
                          <span className="text-[10px]">{project.pinned ? "已置顶" : "置顶"}</span>
                        </button>

                        <button
                          onClick={() => handleCyclePriority(project.id)}
                          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                            project.priority === "urgent" ? "bg-rose-100 text-rose-800 border-rose-300 font-bold" :
                            project.priority === "high" ? "bg-amber-100 text-amber-800 border-amber-300" :
                            "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                          title="点击切换优先级 (普通/高优/紧急)"
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span className="text-[10px]">
                            {project.priority === "urgent" ? "紧急" : project.priority === "high" ? "高优" : "普通"}
                          </span>
                        </button>

                        {/* Quick Color Palette Hover Selector */}
                        <div className="relative group/color">
                          <button
                            className="p-1.5 bg-[#f4f2eb] hover:bg-amber-100 text-[#1e293b] border border-[#e8e6df] hover:border-amber-300 rounded-lg transition-all flex items-center gap-1 text-[10px] cursor-pointer"
                            title="快速切换分类颜色"
                          >
                            <Palette className="w-3.5 h-3.5 text-amber-700" />
                            <span className="text-[10px]">颜色</span>
                          </button>
                          <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover/color:flex p-1.5 bg-white border border-gray-200 rounded-xl shadow-xl gap-1 z-30 animate-fade-in">
                            {(Object.keys(CATEGORY_COLOR_CONFIG) as CategoryColor[]).map((cKey) => {
                              const cfg = CATEGORY_COLOR_CONFIG[cKey];
                              return (
                                <button
                                  key={cKey}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeColorTag(project.id, cKey);
                                  }}
                                  className={`w-5 h-5 rounded-full ${cfg.dotBg} hover:scale-125 transition-transform border border-white shadow-xs cursor-pointer`}
                                  title={`切换为 ${cfg.label} 分类颜色`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startInlineEdit(project)}
                          className="p-1.5 bg-[#f4f2eb] hover:bg-amber-100 text-[#1e293b] border border-[#e8e6df] hover:border-amber-300 rounded-lg transition-all flex items-center gap-1 text-[10px] cursor-pointer"
                          title="双击卡片或点击原位编辑"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                          <span>原位编辑</span>
                        </button>

                        <button
                          onClick={() => handleConvertToMemo(project)}
                          className="p-1.5 bg-[#f4f2eb] hover:bg-[#ece9e2] text-[#1e293b] border border-[#e8e6df] rounded-lg transition-all flex items-center gap-1 text-[10px] cursor-pointer"
                          title="转为知识图谱便签"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>便签</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : viewMode === "kanban" ? (
          /* Kanban Board View with Animated Drag & Drop and Celebration Micro-interactions */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["idling", "running", "active"] as const).map((colStatus) => {
              const colTitle = 
                colStatus === "idling" ? "待机 / 闲置 (Idling)" :
                colStatus === "running" ? "执行中 (Running)" : "已完成 / 活跃 (Done / Active)";
              const colColor =
                colStatus === "idling" ? "border-gray-300 bg-gray-50/50" :
                colStatus === "running" ? "border-amber-300 bg-amber-50/40" : "border-emerald-300 bg-emerald-50/40";
              const dotColor =
                colStatus === "idling" ? "bg-gray-400" :
                colStatus === "running" ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-xs shadow-emerald-400";
              const colProjects = filteredProjects.filter((p) => p.status === colStatus);
              const isDragOver = dragOverColumn === colStatus;

              return (
                <motion.div 
                  layout
                  key={colStatus} 
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverColumn !== colStatus) {
                      setDragOverColumn(colStatus);
                    }
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDragOverColumn(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const taskId = e.dataTransfer.getData("text/plain") || draggingTaskId;
                    if (taskId) {
                      handleDropToColumn(taskId, colStatus, e.clientX, e.clientY);
                    }
                  }}
                  className={`rounded-xl border ${colColor} p-4 flex flex-col space-y-4 transition-all duration-200 ${
                    isDragOver ? "ring-2 ring-amber-500 ring-offset-2 bg-amber-100/60 border-amber-400 scale-[1.01] shadow-lg" : ""
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1e293b] flex items-center gap-1.5">
                        <span>{colTitle}</span>
                        {colStatus === "active" && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white text-xs font-mono font-bold text-[#7c786c] border border-gray-200">
                      {colProjects.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 min-h-[320px] transition-all">
                    {colProjects.length === 0 ? (
                      <div className={`h-full min-h-[220px] flex flex-col items-center justify-center p-6 border border-dashed rounded-lg text-xs font-mono text-gray-400 text-center transition-colors ${
                        isDragOver ? "border-amber-400 bg-amber-100/50 text-amber-800 font-semibold" : "border-gray-200"
                      }`}>
                        {isDragOver ? "松开鼠标即可移动至此列 🎯" : "拖拽任务卡片放至此处"}
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {colProjects.map((project) => (
                          <motion.div
                            layout
                            layoutId={project.id}
                            key={project.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ 
                              opacity: draggingTaskId === project.id ? 0.4 : 1, 
                              y: 0, 
                              scale: draggingTaskId === project.id ? 1.02 : 1,
                              rotate: draggingTaskId === project.id ? 1.5 : 0
                            }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            draggable={editingTaskId !== project.id}
                            onDragStart={(e) => {
                              if (editingTaskId === project.id) {
                                e.preventDefault();
                                return;
                              }
                              e.dataTransfer.setData("text/plain", project.id);
                              e.dataTransfer.effectAllowed = "move";
                              setDraggingTaskId(project.id);
                            }}
                            onDragEnd={() => {
                              setDraggingTaskId(null);
                              setDragOverColumn(null);
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              startInlineEdit(project);
                            }}
                            className={`p-4 rounded-xl border bg-white space-y-3 ${
                              editingTaskId === project.id ? "border-amber-400 ring-2 ring-amber-300 shadow-md" : "cursor-grab active:cursor-grabbing hover:shadow-md border-gray-200"
                            } transition-all select-none relative group ${
                              draggingTaskId === project.id ? "ring-2 ring-amber-500 border-amber-400 shadow-xl opacity-50" : ""
                            }`}
                            title="💡 双击卡片进行原位编辑"
                          >
                            {editingTaskId === project.id ? (
                              <div className="space-y-2.5 bg-amber-50/90 border border-amber-300 p-3 rounded-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-900 border-b border-amber-200 pb-1">
                                  <span className="flex items-center gap-1">
                                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                                    <span>原位编辑</span>
                                  </span>
                                  <span className="text-[9px] text-amber-700 font-normal">Esc 取消 · Enter 保存</span>
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono text-gray-500 uppercase font-semibold block mb-0.5">任务名称</label>
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveInlineEdit();
                                      if (e.key === "Escape") cancelInlineEdit();
                                    }}
                                    autoFocus
                                    className="w-full text-xs font-mono font-bold text-[#1e293b] bg-white border border-amber-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    placeholder="输入任务名称..."
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono text-gray-500 uppercase font-semibold block mb-0.5">详细描述</label>
                                  <textarea
                                    rows={2}
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveInlineEdit();
                                      if (e.key === "Escape") cancelInlineEdit();
                                    }}
                                    className="w-full text-xs text-[#1e293b] bg-white border border-amber-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                                    placeholder="输入详细描述..."
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono text-gray-500 uppercase font-semibold block mb-0.5">分类文本</label>
                                  <input
                                    type="text"
                                    value={editTag}
                                    onChange={(e) => setEditTag(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveInlineEdit();
                                      if (e.key === "Escape") cancelInlineEdit();
                                    }}
                                    className="w-full text-[10px] font-mono text-[#1e293b] bg-white border border-amber-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    placeholder="分类 (如: AI, Research)"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono text-gray-500 uppercase font-semibold block mb-0.5">选择分类颜色标记</label>
                                  <div className="flex flex-wrap gap-1">
                                    {(Object.keys(CATEGORY_COLOR_CONFIG) as CategoryColor[]).map((cKey) => {
                                      const cfg = CATEGORY_COLOR_CONFIG[cKey];
                                      const isSelected = editColorTag === cKey;
                                      return (
                                        <button
                                          key={cKey}
                                          type="button"
                                          onClick={() => setEditColorTag(cKey)}
                                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                                            isSelected
                                              ? `${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder} ring-1 ring-amber-500 shadow-2xs scale-105`
                                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                          }`}
                                        >
                                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotBg}`}></span>
                                          <span>{cfg.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-amber-200">
                                  <button
                                    onClick={cancelInlineEdit}
                                    className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-mono font-semibold transition-colors flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>取消</span>
                                  </button>
                                  <button
                                    onClick={saveInlineEdit}
                                    className="px-2.5 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold transition-colors flex items-center gap-0.5 shadow-xs cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>保存</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-2">
                                  {(() => {
                                    const cConfig = CATEGORY_COLOR_CONFIG[project.colorTag || "blue"];
                                    return (
                                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full border ${cConfig.badgeBg} ${cConfig.badgeText} ${cConfig.badgeBorder} shadow-2xs`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cConfig.dotBg}`}></span>
                                        <span>{project.tag}</span>
                                      </span>
                                    );
                                  })()}
                                  <div className="flex items-center gap-1">
                                    {colStatus !== "idling" && (
                                      <button
                                        onClick={(e) => handleUpdateProjectStatus(project.id, "idling", e.clientX, e.clientY)}
                                        className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors cursor-pointer"
                                        title="移至待机"
                                      >
                                        ← 待机
                                      </button>
                                    )}
                                    {colStatus !== "running" && (
                                      <button
                                        onClick={() => triggerProject(project.id)}
                                        disabled={runningProject !== null}
                                        className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-bold transition-colors cursor-pointer"
                                        title="立即触发运行"
                                      >
                                        ▶ 运行
                                      </button>
                                    )}
                                    {colStatus !== "active" && (
                                      <button
                                        onClick={(e) => handleUpdateProjectStatus(project.id, "active", e.clientX, e.clientY)}
                                        className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-semibold transition-colors flex items-center gap-0.5 cursor-pointer"
                                        title="标记为已完成并触发展示庆祝"
                                      >
                                        <Check className="w-3 h-3 text-emerald-700" />
                                        <span>完成</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h5 className="text-sm font-mono font-semibold text-[#1e293b] flex items-center justify-between group-hover:text-amber-700 transition-colors">
                                    <span className="flex items-center gap-1">
                                      <span>{project.name}</span>
                                      <Edit3 className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1" title="双击可编辑" />
                                    </span>
                                    {project.pinned && <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600 inline" />}
                                  </h5>
                                  <p className="text-[11px] text-[#5c5952] leading-relaxed mt-1 line-clamp-2">{project.desc}</p>
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-500">
                                  <span>ID: {project.id}</span>
                                  <span className={`font-semibold ${
                                    project.status === "active" ? "text-emerald-700 font-bold" : "text-amber-700"
                                  }`}>
                                    {project.status === "active" ? "✓ 已完成" : project.status}
                                  </span>
                                </div>

                                {/* Quick Action Bar */}
                                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-mono">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleTogglePin(project.id)}
                                      className={`p-1 rounded border transition-all flex items-center gap-1 cursor-pointer ${
                                        project.pinned ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                      }`}
                                      title={project.pinned ? "取消置顶" : "置顶任务"}
                                    >
                                      <Pin className={`w-3 h-3 ${project.pinned ? "fill-amber-800" : ""}`} />
                                      <span className="text-[9px]">{project.pinned ? "已置顶" : "置顶"}</span>
                                    </button>

                                    <button
                                      onClick={() => handleCyclePriority(project.id)}
                                      className={`p-1 rounded border transition-all flex items-center gap-1 cursor-pointer ${
                                        project.priority === "urgent" ? "bg-rose-100 text-rose-800 border-rose-300 font-bold" :
                                        project.priority === "high" ? "bg-amber-100 text-amber-800 border-amber-300" :
                                        "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                      }`}
                                      title="切换优先级"
                                    >
                                      <Flag className="w-3 h-3" />
                                      <span className="text-[9px]">
                                        {project.priority === "urgent" ? "紧急" : project.priority === "high" ? "高优" : "普通"}
                                      </span>
                                    </button>

                                    {/* Quick Color Palette Hover Selector */}
                                    <div className="relative group/color">
                                      <button
                                        className="p-1 bg-[#f4f2eb] hover:bg-amber-100 text-[#1e293b] border border-[#e8e6df] rounded transition-all flex items-center gap-0.5 text-[9px] cursor-pointer"
                                        title="快速切换分类颜色"
                                      >
                                        <Palette className="w-3 h-3 text-amber-700" />
                                      </button>
                                      <div className="absolute left-0 bottom-full mb-1 hidden group-hover/color:flex p-1 bg-white border border-gray-200 rounded-lg shadow-lg gap-1 z-30 animate-fade-in">
                                        {(Object.keys(CATEGORY_COLOR_CONFIG) as CategoryColor[]).map((cKey) => {
                                          const cfg = CATEGORY_COLOR_CONFIG[cKey];
                                          return (
                                            <button
                                              key={cKey}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleChangeColorTag(project.id, cKey);
                                              }}
                                              className={`w-4 h-4 rounded-full ${cfg.dotBg} hover:scale-125 transition-transform border border-white shadow-2xs cursor-pointer`}
                                              title={`切换为 ${cfg.label} 分类颜色`}
                                            />
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => startInlineEdit(project)}
                                      className="p-1 bg-[#f4f2eb] hover:bg-amber-100 text-[#1e293b] border border-[#e8e6df] rounded transition-all flex items-center gap-0.5 text-[9px] cursor-pointer"
                                      title="原位修改卡片"
                                    >
                                      <Edit3 className="w-3 h-3 text-amber-700" />
                                      <span>编辑</span>
                                    </button>

                                    <button
                                      onClick={() => handleConvertToMemo(project)}
                                      className="p-1 bg-[#f4f2eb] hover:bg-[#ece9e2] text-[#1e293b] border border-[#e8e6df] rounded transition-all flex items-center gap-0.5 text-[9px] cursor-pointer"
                                      title="转为便签"
                                    >
                                      <FileText className="w-3 h-3 text-amber-700" />
                                      <span>便签</span>
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Table List View */
          <div className="bg-white border border-[#e8e6df] rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#f4f2eb] text-[#7c786c] border-b border-[#e8e6df] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">状态</th>
                    <th className="p-3.5">任务名称 & 标签</th>
                    <th className="p-3.5">描述说明</th>
                    <th className="p-3.5">优先级</th>
                    <th className="p-3.5">置顶</th>
                    <th className="p-3.5 text-right">快捷操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e6df]">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        当前分类下暂无任务
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr 
                        key={project.id} 
                        onDoubleClick={() => startInlineEdit(project)}
                        className="hover:bg-[#faf9f6] transition-all cursor-pointer group"
                        title="💡 双击此行快速原位编辑"
                      >
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            project.status === "running" ? "bg-amber-100 text-amber-800 animate-pulse" :
                            project.status === "active" ? "bg-emerald-100 text-emerald-800" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              project.status === "running" ? "bg-amber-500" :
                              project.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                            }`}></span>
                            {project.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-[#1e293b] flex items-center gap-1">
                            <span>{project.name}</span>
                            <Edit3 className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1" title="双击可编辑" />
                          </div>
                          {(() => {
                            const cConfig = CATEGORY_COLOR_CONFIG[project.colorTag || "blue"];
                            return (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${cConfig.badgeBg} ${cConfig.badgeText} ${cConfig.badgeBorder} mt-0.5`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cConfig.dotBg}`}></span>
                                <span>{project.tag}</span>
                              </span>
                            );
                          })()}
                        </td>
                        <td className="p-3.5 text-[#5c5952] max-w-xs truncate" title={project.desc}>
                          {project.desc}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <button
                            onClick={() => handleCyclePriority(project.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              project.priority === "urgent" ? "bg-rose-100 text-rose-800" :
                              project.priority === "high" ? "bg-amber-100 text-amber-800" :
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {project.priority === "urgent" ? "🚨 紧急" : project.priority === "high" ? "⭐ 高优" : "• 普通"}
                          </button>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePin(project.id)}
                            className={`p-1 rounded ${project.pinned ? "text-amber-600 bg-amber-50" : "text-gray-400 hover:text-gray-600"}`}
                          >
                            <Pin className={`w-4 h-4 ${project.pinned ? "fill-amber-600" : ""}`} />
                          </button>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => startInlineEdit(project)}
                            className="px-2.5 py-1 bg-[#f4f2eb] text-[#1e293b] border border-[#e8e6df] rounded hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer font-medium"
                            title="原位修改任务"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => triggerProject(project.id)}
                            disabled={runningProject !== null}
                            className="px-2.5 py-1 bg-[#1e293b] text-white rounded hover:bg-[#2d3a4f] transition-all font-bold cursor-pointer"
                          >
                            ▶ 运行
                          </button>
                          <button
                            onClick={() => handleConvertToMemo(project)}
                            className="px-2.5 py-1 bg-[#f4f2eb] text-[#1e293b] border border-[#e8e6df] rounded hover:bg-[#ece9e2] cursor-pointer"
                          >
                            便签
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Integrated Console Terminal (Flat terminal looking clean) */}
        <div className="rounded-xl border border-[#e8e6df] bg-[#1a1917] p-4 text-[#dedcd5] font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#2d2c29] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-gray-300">CatOS Live Task Terminal Console</span>
            </div>
            <button
              onClick={clearLogs}
              className="px-2.5 py-1 rounded bg-[#2d2c29] text-[#dedcd5] hover:bg-[#3d3c39] transition-all text-[10px]"
            >
              Clear Buffer
            </button>
          </div>
          
          <div className="h-44 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-[#2d2c29]">
            {terminalLogs.map((log, idx) => {
              if (typeof log !== "string" || !log) return null;
              return (
                <div key={idx} className="leading-relaxed">
                  <span className="text-gray-500 select-none mr-2">&gt;</span>
                  <span className={
                    log.startsWith("[System") || log.startsWith("[Ready")
                      ? "text-blue-400"
                      : log.includes("SUCCESS") || log.includes("NOMINAL")
                      ? "text-emerald-400"
                      : log.startsWith("[User Trigger")
                      ? "text-amber-400 font-bold"
                      : "text-gray-300"
                  }>
                    {log}
                  </span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>

      {/* Model Configuration Center Module */}
      <div className="bg-[#faf9f6] border border-[#e8e6df] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e6df] pb-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-[#1e293b] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#a77a45]" />
              <span>智能终端模型配置中心</span>
            </h3>
            <p className="text-sm text-[#7c786c]">
              在此管理多套 AI 端点（Endpoints），自定义每个终端的 API Key、Base URL 以及生成参数，可与 Agent Cat 聊天助手快捷同步。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportConfigs}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleExportConfigs}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#e8e6df] text-[#1e293b] rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="导出所有 AI 终端配置为 JSON 文件"
            >
              <Download className="w-3.5 h-3.5 text-[#a77a45]" />
              <span>导出配置</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#e8e6df] text-[#1e293b] rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="从 JSON 文件导入 AI 终端配置"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>导入配置</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer select-none ml-2">
              <input
                type="checkbox"
                checked={isCustomEnabled}
                onChange={(e) => {
                  handleSaveProfiles(profiles, activeProfileId, e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#ece9e2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e293b]"></div>
              <span className="ml-1.5 text-xs font-mono font-bold text-[#1e293b]">
                {isCustomEnabled ? "启用" : "停用"}
              </span>
            </label>
          </div>
        </div>

        {/* Task Completion Feedback & Ritual Settings Card */}
        <div className="bg-white border border-[#e8e6df] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-base">
              ✨
            </div>
            <div>
              <h4 className="text-sm font-serif font-semibold text-[#1e293b]">任务完成仪式感与反馈配置</h4>
              <p className="text-xs text-[#7c786c]">当后台自动化任务顺利执行结束时，自动触发音效提示与视觉震动反馈。</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={soundFeedbackEnabled}
                onChange={(e) => setSoundFeedbackEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-700 accent-amber-700 cursor-pointer"
              />
              <span className="text-[#1e293b] font-medium">🔊 音效提示</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={visualShakeEnabled}
                onChange={(e) => setVisualShakeEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-700 accent-amber-700 cursor-pointer"
              />
              <span className="text-[#1e293b] font-medium">📳 视觉震动</span>
            </label>

            <button
              onClick={() => {
                playSuccessChime();
                triggerShakeEffect();
              }}
              className="px-3 py-1 bg-[#1e293b] hover:bg-[#2d3a4f] text-white rounded-lg font-bold transition-all cursor-pointer text-[11px]"
              title="测试反馈效果"
            >
              测试反馈
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Endpoints List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[11px] text-[#7c786c] font-bold uppercase tracking-wider">我的终端列表 / 单击可进行参数微调</div>
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {profiles.map((p) => {
                const isActive = activeProfileId === p.id;
                const isSelectedForEdit = editingProfileId === p.id;
                const hasKey = p.apiKey && p.apiKey.trim().length > 0;
                return (
                  <div
                    key={p.id}
                    onClick={() => setEditingProfileId(p.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isActive
                        ? "bg-[#1e293b]/5 border-[#1e293b] ring-1 ring-[#1e293b]"
                        : isSelectedForEdit
                        ? "bg-[#faf9f6] border-[#a77a45] ring-1 ring-[#a77a45]/30"
                        : "bg-white border-[#e8e6df] hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {isActive && (
                            <span className="text-[9px] bg-[#1e293b] text-white px-1.5 py-0.5 rounded font-normal font-mono">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#7c786c] font-mono flex items-center gap-2">
                          <span className="uppercase bg-[#ece9e2] text-[#5c5952] px-1 py-0.2 rounded-sm text-[9px] font-bold">
                            {p.provider}
                          </span>
                          <span className="truncate max-w-[130px]">{p.customModel || "默认模型"}</span>
                        </div>
                      </div>

                      {/* Switch Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwitchProfile(p.id);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${
                          isActive
                            ? "bg-[#1e293b] text-white cursor-default"
                            : "bg-[#ece9e2] text-[#1e293b] hover:bg-[#1e293b] hover:text-white"
                        }`}
                      >
                        {isActive ? "正在使用" : "切换终端"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-[#e8e6df] text-[10px] text-[#8f8b80] font-mono">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          <span className={hasKey ? "text-emerald-600 font-bold" : "text-amber-600"}>
                            {hasKey ? "已填密钥" : "免密钥"}
                          </span>
                        </span>
                        <span>Temp: {p.temperature !== undefined ? p.temperature : 0.7}</span>
                        {p.max_tokens !== undefined && (
                          <span>Max: {p.max_tokens}</span>
                        )}
                      </div>

                      {/* Delete Custom Endpoint */}
                      {!p.id.endsWith("-default") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProfile(p.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all"
                          title="删除此自定义终端"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleAddProfile}
              className="w-full py-2.5 border border-dashed border-[#a77a45] hover:border-[#1e293b] rounded-xl text-center text-xs font-bold text-[#a77a45] hover:text-[#1e293b] transition-all bg-amber-50/10 hover:bg-amber-50/40 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>添加自定义 API 终端 (Endpoint)</span>
            </button>
          </div>

          {/* Right Column: Endpoint Edit Form */}
          <div className="lg:col-span-7 bg-white border border-[#e8e6df] rounded-2xl p-5 md:p-6 space-y-4">
            {editingProfileId && (() => {
              const editingProfile = profiles.find((p) => p.id === editingProfileId);
              if (!editingProfile) return <div className="text-xs text-[#7c786c] p-4 text-center">请在左侧选择一个终端以编辑参数。</div>;
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e8e6df] pb-3">
                    <h4 className="text-sm font-semibold text-[#1e293b] flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-[#a77a45]" />
                      <span>配置参数: {editingProfile.name}</span>
                    </h4>
                    <span className="text-[10px] font-mono text-[#7c786c]">
                      ID: {editingProfile.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] text-[#7c786c] mb-1 font-bold uppercase tracking-wide">终端显示名称</label>
                      <input
                        type="text"
                        value={editingProfile.name}
                        onChange={(e) => handleUpdateProfileField(editingProfile.id, "name", e.target.value)}
                        className="w-full bg-[#fbfaf7] border border-[#e8e6df] rounded-lg p-2 text-xs focus:outline-hidden focus:border-[#1e293b] text-[#1e293b]"
                      />
                    </div>

                    {/* Provider */}
                    <div>
                      <label className="block text-[10px] text-[#7c786c] mb-1 font-bold uppercase tracking-wide">API 协议格式</label>
                      <select
                        value={editingProfile.provider}
                        onChange={(e) => handleProfileProviderChange(editingProfile.id, e.target.value as any)}
                        className="w-full bg-[#fbfaf7] border border-[#e8e6df] rounded-lg p-2 text-xs focus:outline-hidden focus:border-[#1e293b] text-[#1e293b] font-mono"
                      >
                        <option value="openai">OpenAI 格式 (GPT / 兼容端)</option>
                        <option value="gemini">Google Gemini 官方 API</option>
                        <option value="deepseek">DeepSeek 官方 API</option>
                        <option value="anthropic">Anthropic Claude 官方</option>
                        <option value="custom">Custom (自定义端)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* API Key */}
                    <div>
                      <label className="block text-[10px] text-[#7c786c] mb-1 font-bold uppercase tracking-wide">API KEY (密钥)</label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder={editingProfile.provider === "gemini" ? "AIzaSy..." : "sk-..."}
                          value={editingProfile.apiKey}
                          onChange={(e) => handleUpdateProfileField(editingProfile.id, "apiKey", e.target.value)}
                          className="w-full bg-[#fbfaf7] border border-[#e8e6df] rounded-lg p-2 pr-10 text-xs focus:outline-hidden focus:border-[#1e293b] font-mono text-[#1e293b]"
                        />
                        <div className="absolute right-2.5 top-2.5">
                          <Key className="w-4 h-4 text-[#8f8b80]" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Model Name */}
                      <div>
                        <label className="block text-[10px] text-[#7c786c] mb-1 font-bold uppercase tracking-wide">模型名称 (MODEL)</label>
                        <input
                          type="text"
                          placeholder="e.g. gpt-4o-mini"
                          value={editingProfile.customModel}
                          onChange={(e) => handleUpdateProfileField(editingProfile.id, "customModel", e.target.value)}
                          className="w-full bg-[#fbfaf7] border border-[#e8e6df] rounded-lg p-2 text-xs focus:outline-hidden focus:border-[#1e293b] font-mono text-[#1e293b]"
                        />
                      </div>

                      {/* Base URL */}
                      <div>
                        <label className="block text-[10px] text-[#7c786c] mb-1 font-bold uppercase tracking-wide">接口 Base URL (代理地址)</label>
                        <input
                          type="text"
                          placeholder="e.g. https://api.openai.com/v1"
                          value={editingProfile.customBaseUrl}
                          onChange={(e) => handleUpdateProfileField(editingProfile.id, "customBaseUrl", e.target.value)}
                          className="w-full bg-[#fbfaf7] border border-[#e8e6df] rounded-lg p-2 text-xs focus:outline-hidden focus:border-[#1e293b] font-mono text-[#1e293b]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-dashed border-[#e8e6df]">
                      {/* Temperature Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[10px] text-[#7c786c] font-bold uppercase tracking-wide">
                            温度系数 (Temperature)
                          </label>
                          <span className="text-xs font-mono font-bold text-amber-700">
                            {editingProfile.temperature !== undefined ? editingProfile.temperature : 0.7}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={editingProfile.temperature !== undefined ? editingProfile.temperature : 0.7}
                          onChange={(e) => handleUpdateProfileField(editingProfile.id, "temperature", Number(e.target.value))}
                          className="w-full h-1 bg-[#ece9e2] rounded-lg appearance-none cursor-pointer accent-[#1e293b]"
                        />
                        <span className="text-[9px] text-[#8f8b80] mt-1 block">值越低越严谨，值越高越发散创意。</span>
                      </div>

                      {/* Max Tokens */}
                      <div>
                        <label className="block text-[10px] text-[#7c786c] mb-1 font-bold uppercase tracking-wide">最大生成 Tokens 限制 (Max Tokens)</label>
                        <input
                          type="number"
                          placeholder="默认(不设限制)"
                          value={editingProfile.max_tokens !== undefined ? editingProfile.max_tokens : ""}
                          onChange={(e) => {
                            const val = e.target.value ? Number(e.target.value) : undefined;
                            handleUpdateProfileField(editingProfile.id, "max_tokens", val);
                          }}
                          className="w-full bg-[#fbfaf7] border border-[#e8e6df] rounded-lg p-2 text-xs focus:outline-hidden focus:border-[#1e293b] font-mono text-[#1e293b]"
                        />
                        <span className="text-[9px] text-[#8f8b80] mt-1 block">不填将自适应采用该模型引擎的默认设置。</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#e8e6df] mt-4">
                    <button
                      onClick={handleResetSettings}
                      className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg font-bold transition-all border border-red-100 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>重置配置</span>
                    </button>

                    <button
                      onClick={() => handleSaveProfiles(profiles, activeProfileId, isCustomEnabled)}
                      className="bg-[#1e293b] hover:bg-[#2d3a4f] text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>保存全部终端配置</span>
                    </button>
                  </div>

                  {settingsSuccess && (
                    <div className="text-[10px] font-mono text-emerald-600 flex items-center justify-center gap-1 animate-fade-in-up mt-2">
                      <Check className="w-3.5 h-3.5 animate-bounce" />
                      <span>终端配置成功同步至 LocalStorage 与 Agent 核心！</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
