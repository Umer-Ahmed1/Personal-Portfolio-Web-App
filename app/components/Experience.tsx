// components/StatsSection.tsx

interface StatItemProps {
  value: string;
  highlight?: string;
  label: string;
}

const StatItem = ({ value, highlight, label }: StatItemProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      
      {/* NUMBER */}
      <div className="flex items-end gap-1">
        <span className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide">
          {value}
        </span>
        {highlight && (
          <span className="text-4xl md:text-5xl lg:text-6xl font-light text-red-500">
            {highlight}
          </span>
        )}
      </div>

      {/* LABEL */}
      <p className="mt-2 text-sm md:text-base text-gray-400 tracking-wide">
        {label}
      </p>
    </div>
  );
};

export default function StatsSection() {
  const stats = [
    { value: "05", highlight: "+", label: "Years Experience" },
    { value: "40", highlight: "+", label: "Projects Delivered" },
    { value: "99", highlight: "%", label: "Client Satisfaction" },
    { value: "24/7", label: "Proactive Communication" },
  ];

  return (
    <section className="w-full bg-[#2A2A2A] border-t border-b border-[#333]">
      <div className=" mx-auto px-6 md:px-12">

        <div className="grid grid-cols-2 md:grid-cols-4 items-center text-center
                        py-8 md:py-10 lg:py-12 gap-y-10">

          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              highlight={stat.highlight}
              label={stat.label}
            />
          ))}

        </div>
      </div>
    </section>
  );
}