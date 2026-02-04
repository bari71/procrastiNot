'use server';

import { AUTH_COOKIE } from '@/features/auth/constants';
import { createSessionClient } from '@/lib/appwrite';
import { cookies } from 'next/headers';
import { Account, Client } from 'node-appwrite';

export const getCurrent = async () => {
    try {
        const { account } = await createSessionClient();

        const user = await account.get();

        return user;
    } catch {
        return null;
    }

}