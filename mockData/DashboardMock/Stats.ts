  export type StatsData = {
    id: string;
    label: string;
    value: string;
    icon: "users" | "file" | "email" | "check";
    color: string;
    bg: string;
  }
  
  export const stats: StatsData[] = [
    {
      id: "1",
      label: "Total Kandidat",
      value: "1,240",
      icon: "users",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "2",
      label: "Tes Aktif",
      value: "12",
      icon: "file",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      id: "3",
      label: "Email Terkirim",
      value: "1,180",
      icon: "email",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: "4",
      label: "Lulus Seleksi",
      value: "856",
      icon: "check",
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];