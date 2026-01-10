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
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
        {showGrowth && growth !== undefined && (
          <span className="flex items-center text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-lg">
            <BsArrowUpRight size={14} /> {growth}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
