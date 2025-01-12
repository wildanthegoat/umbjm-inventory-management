"use server";

import { loginSchema } from "./zod"
import {signIn} from "@/auth";
import { AuthError } from "next-auth";


export const signInCredentials = async (prevState, formdata) => {
    const validatedFields = loginSchema.safeParse(
        Object.fromEntries(formdata.entries())
    );

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }
    const { username, password } = validatedFields.data;
    try {
        await signIn("credentials", {
            username,
            password,
            redirect: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {message:"Invalid username or password"};
                default:
                    return {message:"Something went wrong."};
            }
        }        
    }

}