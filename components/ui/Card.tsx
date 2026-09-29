// components/ui/Card.tsx
import { BsArrowUpRight } from "react-icons/bs";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  color: string;
  growth?: number;
  showGrowth?: boolean; // Ganti dari hiddenGrowth
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  bg,
  color,
  growth = 0,
  showGrowth = false, // Default tidak tampil
}) => {
  return (
    <div className="md:w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-6">
      <div className="flex justify-center md:justify-between items-center md:items-start">
        <div className={`rounded-xl p-3 ${bg} ${color}`}>{icon}</div>
        {showGrowth && growth !== undefined && (
          <span className="flex items-center text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-lg">
            <BsArrowUpRight size={14} /> {growth}%
          </span>
        )}
      </div>

      <div className="text-center md:text-left mt-4">
        <h3 className="text-gray-500 text-xs md:text-sm font-medium text-nowrap">{label}</h3>
        <p className=" text-xl md:text-2xl font-bold mt-1 text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
