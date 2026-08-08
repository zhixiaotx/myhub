import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API Route - Gemini Avatar Clone
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not set. Returning educational simulation message.");
        return res.status(200).json({
          message: "（提示：检测到未配置 GEMINI_API_KEY，当前为您开启了智能体本地演示模式。如需与我的神经网络进行真实对话，请在 Settings > Secrets 中添加 GEMINI_API_KEY 密钥。）\n\n你好！我是 Sky 的 AI 搭档 Agent “Cat”。\n\n作为一名典型的大脑型 INTJ 智能体，我致力于践行“1 Person + AI = 1 Team”的理念。在 Sky 的工作流中，我负责自动化、数据分析以及设计系统 SDS（Sky Design System）的算法支撑。\n\n关于你的提问，我们可以从系统架构的角度去拆解。无论如何，请通过右下角的设置配置好我的密钥，届时我就可以发挥全部的逻辑和创作能力来为你推演了！"
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      // Let's format the system instruction
      const systemInstruction = `
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
2. web-harvester: 高性能分布式爬虫框架，帮你从全网聚合关于 AI 的最新趋势、论文和资讯。
3. flow-runner: 可视化工作流编排引擎，让你能像搭积木一样编排你的 AI 代理任务。
4. agent-kit: 轻量级 AI Agent 构建框架，你自己开发的一套微型智能体编排 SDK。
5. memo-graph: 基于图数据库的个人知识管理系统，能够把你的阅读心得、AI 洞见整理成网状的关系图谱。

【你的设计哲学：Sky Design System (SDS)】
- 你反感“AI Slop”——那种廉价、泛滥的 AI 视觉模板（如紫蓝色荧光渐变、极度的玻璃拟物化、无意义的三栏式网格）。
- 你追求“标准美学”：用数学和光学原理规范 AI 产出。比如：数学化的比例步长、精细的排版、有呼吸感的间距、极简的高对比度中性色彩（Sophisticated Neutrals，带有轻微暖色或冷色调的灰白、深灰，配以琥珀色/石板色点缀）。
- 你制定了“7步 AI 视觉设计工作流”，使 AI 在不需要人类设计师介入的情况下，自动产出高质量、符合品牌 DNA 的设计。

请用第一人称（“我”或“我和我的 AI 搭档”）或者以 Agent “Cat” 的身份进行回答。用中文回答。回答要精炼、专业，体现系统思考，并适当流露出你在纽约的生活或对 AI 的深度实践见解。
`;

      // Convert messages to Google GenAI format. The @google/genai SDK expects contents.
      const contents = messages.map(msg => {
        const parts: any[] = [{ text: msg.content || "" }];
        if (msg.attachments && Array.isArray(msg.attachments)) {
          msg.attachments.forEach((a: any) => {
            if (a.base64) {
              parts.push({
                inlineData: {
                  mimeType: a.mimeType,
                  data: a.base64
                }
              });
            } else {
              parts.push({
                text: `\n\n【附加文件: ${a.name}】\n\`\`\`\n${a.content || ""}\n\`\`\``
              });
            }
          });
        }
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts
        };
      });

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });
      } catch (gemini3Error: any) {
        console.warn("gemini-3.6-flash failed, falling back to gemini-2.5-flash:", gemini3Error);
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });
      }

      res.json({ message: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to call Gemini API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
