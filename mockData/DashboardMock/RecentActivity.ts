export type RecentActivityData = {
  id: string;
  user: string;
  action: string;
  time: string;
};

export const recentActivities: RecentActivityData[] = [
  {
    id: "1",
    user: "Dante",
    action: "Baru saja menyelesaikan Tes Frontend",
    time: "2 menit yang lalu",
  },
  {
    id: "2",
    user: "Admin System",
    action: "Mengirim 50 email kredensial",
    time: "1 jam yang lalu",
  },
  {
    id: "3",
    user: "Ahmad",
    action: "Gagal login (Salah Password)",
    time: "2 jam yang lalu",
  },
];
