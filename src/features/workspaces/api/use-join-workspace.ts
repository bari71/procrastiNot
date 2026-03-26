import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['join']['$post']>;
type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['join']['$post'], 200>;

export const useJoinWorkspace = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.workspaces[':workspaceId']['join']['$post']({ param, json }); // make a post request with json body
            
            if (!response.ok) {
                throw new Error('Failed to join workspace');
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Joined workspace successfully');
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
        },
        onError: () => {
            toast.error('Failed to join workspace');
        }
    })
    return mutation;
}
