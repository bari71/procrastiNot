'use client'

import { Analytics } from "@/components/analytics"
import { PageError } from "@/components/page-error"
import { PageLoader } from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { useGetProject } from "@/features/projects/api/use-get-project"
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics"
import { ProjectAvatar } from "@/features/projects/components/project-avatar"
import { useProjectId } from "@/features/projects/hooks/use-project-id"
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher"
import { PencilIcon } from "lucide-react"
import Link from "next/link"

export const ProjectIdClient = () => {
    const projectId = useProjectId();
    const { data: projectData, isLoading: isProjectLoading } = useGetProject({ projectId });
    const { data: analyticsData } = useGetProjectAnalytics({ projectId });

    if (isProjectLoading) {
        return <PageLoader/>
    }

    if (!projectData) {
        return <PageError message="Project not found"/>
    }
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar image={projectData?.imageUrl} name={projectData?.name} className="size-8" />
                    <p className="text-lg font-semibold">{projectData.name}</p>
                </div>
                <div>
                    <Button variant="secondary" size="sm" asChild>
                            <Link href={`/workspaces/${projectData.workspaceId}/projects/${projectData.$id}/settings`}>
                                <PencilIcon className="size-4" />
                                Edit Project
                            </Link>
                    </Button> 
                </div>
            </div>
            {analyticsData ? (
                <Analytics data={analyticsData}/>
            ) : (
                null
            )}
            <TaskViewSwitcher hideProjectFilter/>
        </div>
    )
}