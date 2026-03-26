'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import Link from 'next/link'
import { loginSchema } from '../schemas'
import { useLogin } from '../api/use-login'


export const SignInCard = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  }) // don't worry about this this is just handling the forms using form component from shadcn

  const { mutate } = useLogin();

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    mutate({ json: data })
  }

  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
      <CardHeader className='flex items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>
          Welcome Back!
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator/>
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className='px-7'>
        <Separator/>
      </div>
      <CardContent className='p-7 flex flex-col gap-y-4'>
        <Button
          variant='secondary'
          size='lg'
          className='w-full'
          disabled={false}
        >
          <FcGoogle className='mr-2 size-5'/>
          Login with Google
        </Button>
        <div className='p-7 flex items-center justify-center'>
          <p>
            Don&apos;t have an account?
            <Link href={'/sign-up'}>
              <span className='text-blue-500'>&nbsp;Sign Up</span>
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
