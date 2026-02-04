import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';
import { useRouter } from 'next/navigation';

type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$patch']>;
type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$patch'], 200>;

export const useUpdateWorkspace = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.workspaces[':workspaceId']['$patch']({ form, param }); // make a post request with json body
            
            if (!response.ok) {
                throw new Error('Failed to create workspace');
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Workspace updated successfully');

            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
        },
        onError: (error) => {
            toast.error('Failed to create workspace');
        }
    })
    return mutation;
}
