import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { client } from '@/lib/rpc';

type RequestType = InferRequestType<typeof client.api.tasks['bulk-update']['$post']>;
type ResponseType = InferResponseType<typeof client.api.tasks['bulk-update']['$post'], 200>;

export const useBulkUpdateTasks = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks['bulk-update']['$post']({ json }); // make a post request with json body
            
            if (!response.ok) {
                throw new Error('Failed to update tasks');
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success('Tasks updated successfully');

            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast.error('Failed to update tasks');
        }
    })
    return mutation;
}
