import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

// upto ['json] it gives you the type fo the input, within input there is another key called JSON which it goges inside
type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth.logout['$post'](); // make a post request with json body
            
            if (!response.ok) {
                throw new Error('Failed to logout');
            }


            return await response.json();
        },
        onSuccess: () => {
            router.refresh();
            toast.success('Logged out successfully');
            queryClient.invalidateQueries({ queryKey: ['current'] });
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
        onError: (error) => {
            toast.error('Failed to logout');
        }
    })
    return mutation;
}
