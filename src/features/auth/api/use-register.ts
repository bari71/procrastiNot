import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient} from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/rpc';

type RequestType = InferRequestType<typeof client.api.auth.register['$post']>;
// upto ['json] it gives you the type fo the input, within input there is another key called JSON which it goges inside
type ResponseType = InferResponseType<typeof client.api.auth.register['$post']>

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.register['$post']({ json }); // make a post request with json body
            
            if (!response.ok) {
                throw new Error('Failed to register');
            }

            return await response.json();
        },
        onSuccess: () => {
            router.refresh();
            toast.success('Registered successfully');
            queryClient.invalidateQueries({ queryKey: ['current'] });
        },
        onError: (error) => {
            toast.error('Failed to register');
        }
    })
    return mutation;
}
