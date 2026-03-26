import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type RequestType = InferRequestType<typeof client.api.auth.login['$post']>;
// upto ['json] it gives you the type fo the input, within input there is another key called JSON which it goges inside
type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            console.log('about to send a post request for login')
            const response = await client.api.auth.login['$post']({ json }); // make a post request with json body
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to login');
            }

            return await response.json();
        },
        onSuccess: () => {
            router.refresh();
            toast.success('Logged in successfully');
            queryClient.invalidateQueries({ queryKey: ['current'] });
        },
        onError: () => {
            toast.error('Failed to login');
        }
    })
    return mutation;
}
