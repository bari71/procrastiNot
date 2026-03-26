'use client';

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import type { Task } from "@/features/tasks/types";
import type { Project } from "@/features/projects/types";
import { Separator } from "@/components/ui/separator";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskDescription } from "@/features/tasks/components/task-description";

export const TaskIdClient = () => {
    const taskId = useTaskId();
    const { data, isLoading } = useGetTask({ taskId });

    if (isLoading) {
        return <PageLoader/>
    }

    if (!data) {
        return <PageError message="Task not found" />
    }
    return (
        <div className="flex flex-col">
            <TaskBreadcrumbs
                project={data.project as unknown as Project}
                task={data as unknown as Task}
            />
            <Separator className="my-6"/>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <TaskOverview task={data as unknown as Task}/>
                <TaskDescription task={data as unknown as Task}/>
            </div>  
        </div>
    )
}

export default TaskIdClient