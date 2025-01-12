import { object, string } from "zod";

export const loginSchema = object({ 
    username: string()
    .min(3, "Username must be at least 3 characters long"),
    password: string() 
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long")
}); 