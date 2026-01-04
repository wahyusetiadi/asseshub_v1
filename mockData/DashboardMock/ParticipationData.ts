export type ParticipationData = {
  day: string;
  value: number; // 0 - 100 (persentase tinggi batang)
};

export const participationMockData: ParticipationData[] = [
  { day: "Day 1", value: 40 },
  { day: "Day 2", value: 70 },
  { day: "Day 3", value: 45 },
  { day: "Day 4", value: 90 },
  { day: "Day 5", value: 65 },
  { day: "Day 6", value: 80 },
  { day: "Day 7", value: 50 },
];
