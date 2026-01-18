export interface CreateTestRequest {
    title: string;
    description: string;
    startAt: string;
    endAt: string;
    durationMinutes: number;
    positions: string;
}