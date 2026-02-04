import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { client } from '@/lib/rpc';

type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$patch']>;
type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$patch'], 200>;

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[':taskId']['$patch']({ json, param }); // make a post request with json body
            
            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Task updated successfully');

            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task', data.$id] });
        },
        onError: (error) => {
            toast.error('Failed to update task');
        }
    })
    return mutation;
}
