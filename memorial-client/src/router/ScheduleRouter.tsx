import { Page404 } from "../components/pages/Page404";
import { ScheduleDetail } from "../components/pages/ScheduleDetail";
import { ScheduleForm } from "../components/pages/ScheduleForm";

export const scheduleRouter = [
    {
        path: "/detail",
        exact: false,
        children: <ScheduleDetail />
    },
    {
        path: "/form",
        exact: false,
        children: <ScheduleForm />
    },
    {
        path: "*",
        exact: false,
        children: <Page404 />
    }
]