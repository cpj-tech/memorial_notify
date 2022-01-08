export type SchedulePost = {
    Line_id: number | undefined;
    title: string;
    notification_date: string;
    notification_timing: Array<string>;
    notification_time: string;
    memo: string;
}