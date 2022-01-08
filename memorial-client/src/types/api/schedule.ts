export type Schedule = {
    id: number;
    userid: number;
    title: string;
    notification_date: string;
    notification_timing: Array<string>;
    notification_time: string;
    memo: string;
    month: number;
    day: number;
    is_leap_year: boolean;
    created_at: string;
    updated_at: string;
};
  