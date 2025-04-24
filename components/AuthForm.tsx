"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import FormField from "./FormField";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = ({type} : { type : FormType }) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    });
}


const AuthForm = ({ type }: { type: FormType }) => {

    const router = useRouter();

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    
    async function onSubmit (values: z.infer<typeof formSchema>) {
        try {
            if(type === 'sign-up'){
                const {name, email, password} = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                });

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                  }

                toast.success('Account created successfully. Please Sign in')
                router.push('/sign-in')
            }else {
                const {email, password } = values;

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredentials.user.getIdToken();

                if(!idToken){
                    toast.error('Sign in Failed. Please try again.');
                    return;
                }

                const result = await signIn({
                    email, idToken
                });

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                  }

                toast.success('Sign in successfully')
                router.push('/podcast');
            }

        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`)
        }
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className="">
            <div className="flex justify-center mb-[40px]">
            <Image src="./logo.svg" alt="logo" width={100} height={50} />
            </div>
        <div className="card-border lg:w-[min(408px,100vw-24px)] lg:min-w-[300px]">
            <div className="flex flex-col card gap-6 py-10 px-10">
                {/* <div className="flex flex-row gap-2 justify-center">
                <Image src="./logo.svg" alt="logo" height={32} width={38} />
                </div> */}
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4 space-y-8 form">
                {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}
                    <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
                    <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
                    <Button className="btn" type="submit">{isSignIn ? 'SignIn' : 'Create an Account'}</Button>
                </form>
            </Form>
            <p className="text-center text-primary-50">
            {isSignIn ? 'No account yet?' : 'Have an account already?'}
                        <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-primary-500 ml-1" > {!isSignIn ? 'Sign in' : 'Sign up'} </Link>
            </p>
            </div>
        </div>
        </div>
    )
}

export default AuthForm