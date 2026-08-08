import React, { useState } from "react";
import { Sliders, RefreshCw, Layers, Check, Calculator, Info } from "lucide-react";

export default function DesignSystemPlayground() {
  // Spacing and Typography states
  const [paddingSize, setPaddingSize] = useState<number>(24);
  const [gapSize, setGapSize] = useState<number>(12);
  const [scaleFactor, setScaleFactor] = useState<number>(1.25); // Step ratio
  const [selectedPreset, setSelectedPreset] = useState<string>("minimal");

  // Border radius calculator state
  const [outerRadius, setOuterRadius] = useState<number>(24);
  const [distance, setDistance] = useState<number>(12);

  // Mathematical formula for nested border radius: Inner = Outer - Distance
  const calculatedInnerRadius = Math.max(0, outerRadius - distance);

  const presets = {
    minimal: { padding: 24, gap: 12, scale: 1.25 },
    dense: { padding: 16, gap: 8, scale: 1.125 },
    generous: { padding: 32, gap: 20, scale: 1.333 }
  };

  const applyPreset = (name: keyof typeof presets) => {
    setSelectedPreset(name);
    setPaddingSize(presets[name].padding);
    setGapSize(presets[name].gap);
    setScaleFactor(presets[name].scale);
  };

  return (
    <div id="design-system-playground" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-5 bg-[#faf9f6] border border-[#e8e6df] rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-xl font-serif font-semibold text-[#1e293b]">SDS 审美控制面板</h3>
          <p className="text-xs text-[#7c786c] mt-1">数学化和光学建模的 Sky 设计系统 (Sky Design System)，避免廉价 AI 视觉模版。</p>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#7c786c]">版式预设</label>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {Object.keys(presets).map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p as any)}
                className={`py-2 px-3 rounded-lg border transition-all font-semibold capitalize ${
                  selectedPreset === p
                    ? "bg-[#1e293b] text-[#faf9f6] border-[#1e293b] shadow-xs"
                    : "bg-white border-[#e8e6df] text-[#5c5952] hover:border-[#1e293b]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-4 border-t border-[#e8e6df]">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#7c786c]">OUTER PADDING (外边距)</span>
              <span className="text-[#1e293b] font-semibold">{paddingSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="48"
              value={paddingSize}
              onChange={(e) => {
                setPaddingSize(Number(e.target.value));
                setSelectedPreset("custom");
              }}
              className="w-full h-1 bg-[#ece9e2] rounded-lg appearance-none cursor-pointer accent-[#1e293b]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#7c786c]">INNER GAP (元素间距)</span>
              <span className="text-[#1e293b] font-semibold">{gapSize}px</span>
            </div>
            <input
              type="range"
              min="4"
              max={paddingSize} // Ensure Gap is <= Padding (Mandate)
              value={gapSize}
              onChange={(e) => {
                setGapSize(Number(e.target.value));
                setSelectedPreset("custom");
              }}
              className="w-full h-1 bg-[#ece9e2] rounded-lg appearance-none cursor-pointer accent-[#1e293b]"
            />
            <p className="text-[10px] text-[#8f8b80] italic">规范：外层容器 padding 必须大于或等于子元素间距 gap。</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#7c786c]">FONT SCALE RATIO (字体比例步长)</span>
              <span className="text-[#1e293b] font-semibold">{scaleFactor}x</span>
            </div>
            <div className="flex gap-2">
              {[1.125, 1.20, 1.25, 1.333].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setScaleFactor(val);
                    setSelectedPreset("custom");
                  }}
                  className={`flex-1 py-1 rounded text-[11px] font-mono border transition-all ${
                    scaleFactor === val
                      ? "bg-[#1e293b] text-white border-[#1e293b]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {val === 1.125 ? "1.125 (等比)" : val === 1.25 ? "1.25 (平滑)" : val === 1.333 ? "1.333 (醒目)" : `${val}x`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Border Radius Calculator */}
        <div className="pt-4 border-t border-[#e8e6df] space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#7c786c]">
            <Calculator className="w-4 h-4 text-[#a77a45]" />
            <span>光学圆角嵌套计算器</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="block text-[#8f8b80] mb-1">外框圆角 (px)</label>
              <input
                type="number"
                min="0"
                max="64"
                value={outerRadius}
                onChange={(e) => setOuterRadius(Number(e.target.value))}
                className="w-full border border-[#e8e6df] rounded-lg p-2 text-center bg-white"
              />
            </div>
            <div>
              <label className="block text-[#8f8b80] mb-1">间隙 (Padding)</label>
              <input
                type="number"
                min="0"
                max="48"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full border border-[#e8e6df] rounded-lg p-2 text-center bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-[#f4f2eb] rounded-lg text-xs font-mono space-y-1 border border-[#e8e6df]">
            <div className="flex justify-between font-semibold text-[#1e293b]">
              <span>光学计算内层圆角:</span>
              <span className="text-[#a77a45] text-sm">{calculatedInnerRadius}px</span>
            </div>
            <div className="text-[10px] text-[#7c786c]">
              公式：内层圆角 = 外层圆角 - 间距 ({outerRadius} - {distance} = {calculatedInnerRadius})
            </div>
          </div>
        </div>
      </div>

      {/* Render Preview */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {/* Dynamic preview canvas */}
        <div className="flex-1 border border-[#e8e6df] bg-[#ece9e2] rounded-2xl p-6 flex flex-col justify-center items-center">
          <div className="w-full max-w-md bg-[#faf9f6] border border-[#dfdad0] shadow-md transition-all duration-300"
               style={{
                 padding: `${paddingSize}px`,
                 borderRadius: `${outerRadius}px`
               }}>
            
            {/* Header section in preview */}
            <div className="border-b border-[#e8e6df] pb-3" style={{ marginBottom: `${gapSize}px` }}>
              <span className="text-[9px] font-mono font-bold bg-[#1e293b] text-[#faf9f6] px-2 py-0.5 rounded-full">
                Sky Design System
              </span>
              <h4 className="font-serif font-bold text-[#1e293b] tracking-tight mt-1"
                  style={{ fontSize: `${Math.round(14 * scaleFactor * scaleFactor)}px` }}>
                卡片排版预览
              </h4>
              <p className="text-[#7c786c]" style={{ fontSize: `${Math.round(11 * scaleFactor)}px` }}>
                光学对齐，建立美感呼吸感
              </p>
            </div>

            {/* Content box in preview (Nested Border Radius Rule Demo) */}
            <div className="bg-white border border-[#e8e6df] flex flex-col justify-between"
                 style={{
                   padding: `${Math.max(12, paddingSize - 8)}px`,
                   gap: `${gapSize}px`,
                   borderRadius: `${calculatedInnerRadius}px`
                 }}>
              <p className="text-[#5c5952] leading-relaxed" style={{ fontSize: `${Math.round(13)}px` }}>
                这个内框正坐落在外框中，通过计算公式，使得两个容器之间的间隙在人类视网膜中实现<b>完全等距与平滑</b>的光学对齐。
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#8f8b80]">
                <span>对齐系数</span>
                <span className="text-[#1e293b] font-bold">100% PERFECT</span>
              </div>
            </div>
          </div>
        </div>

        {/* SDS Sophisticated Neutrals Palette */}
        <div className="bg-white border border-[#e8e6df] rounded-2xl p-5 space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7c786c]">Sky 精选暖灰中性调配色体系 (Sophisticated Warm Neutrals)</span>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
            <div className="space-y-1">
              <div className="h-8 rounded bg-[#faf9f6] border border-[#e8e6df]"></div>
              <span className="text-gray-600 font-semibold">Canvas</span>
              <span className="block text-gray-400">#FAF9F6</span>
            </div>
            <div className="space-y-1">
              <div className="h-8 rounded bg-[#f4f2eb] border border-[#e8e6df]"></div>
              <span className="text-gray-600 font-semibold">Faint Gray</span>
              <span className="block text-gray-400">#F4F2EB</span>
            </div>
            <div className="space-y-1">
              <div className="h-8 rounded bg-[#ece9e2] border border-[#dfdad0]"></div>
              <span className="text-gray-600 font-semibold">Border Gray</span>
              <span className="block text-gray-400">#ECE9E2</span>
            </div>
            <div className="space-y-1">
              <div className="h-8 rounded bg-[#a77a45]"></div>
              <span className="text-gray-600 font-semibold">Amber</span>
              <span className="block text-gray-400">#A77A45</span>
            </div>
            <div className="space-y-1">
              <div className="h-8 rounded bg-[#1e293b]"></div>
              <span className="text-gray-600 font-semibold">Ink Slate</span>
              <span className="block text-gray-400">#1E293B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
