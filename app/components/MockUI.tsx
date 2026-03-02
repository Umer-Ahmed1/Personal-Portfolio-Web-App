interface MockBlock {
  style?: React.CSSProperties;
}

interface MockUIProps {
  blocks?: MockBlock[];
  layout?: "sidebar" | "full";
  accentIndex?: number;
}

export default function MockUI({ blocks, layout = "sidebar", accentIndex = 0 }: MockUIProps) {
  const defaultBlocks: MockBlock[] = blocks ?? [{}, {}, {}];

  return (
    <div className="w-full aspect-video bg-[#1e1e1e] relative overflow-hidden">
      {/* Title bar */}
      <div className="h-7 bg-[#2a2a2a] border-b border-[#333] flex items-center px-2.5 gap-1.5">
        <div className="w-[7px] h-[7px] rounded-full bg-[#e63030]" />
        <div className="w-[7px] h-[7px] rounded-full bg-[#e8a030]" />
        <div className="w-[7px] h-[7px] rounded-full bg-[#30e860]" />
      </div>

      {/* Content */}
      <div
        className="p-3 h-[calc(100%-28px)]"
        style={{
          display: "grid",
          gridTemplateColumns: layout === "sidebar" ? "1fr 2fr" : "1fr",
          gap: "8px",
        }}
      >
        {layout === "sidebar" && <div className="bg-[#252525] rounded-[2px]" />}
        <div className="flex flex-col gap-1.5">
          {defaultBlocks.map((block, i) => (
            <div
              key={i}
              className="flex-1 rounded-[2px]"
              style={{
                background: i === accentIndex ? "rgba(230,48,48,0.2)" : "#252525",
                ...block.style,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}