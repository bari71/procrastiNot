import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdSettingsClient } from "./client";

const WorkspaceSettingsPage = async () => {
    const user = await getCurrent();
    if (!user) {
        redirect('/sign-in');
    }

    return <WorkspaceIdSettingsClient />
}

export default WorkspaceSettingsPage;