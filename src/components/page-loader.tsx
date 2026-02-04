import { Loader } from "lucide-react";

export const PageLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
    )
}