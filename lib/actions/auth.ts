"use server"

import { hash } from 'bcryptjs';
import { CredentialsSignin } from 'next-auth';
import { prisma } from "../prisma";
import { signIn } from '../auth';

type RegisterPayload = {
  username: string,
  fullName: string,
  email: string,
  password: string,
};

type LoginPayload = {
  email: string,
  password: string
}

export const register = async (payload: RegisterPayload) => {

  const [userWithUsername, userWithEmail] = await Promise.all([
    prisma.user.findUnique({
      where: { username: payload.username }
    }),

    prisma.user.findUnique({
      where: { email: payload.email }
    })
  ]);


  if (userWithEmail) return { success: false, message: "User with same email exists" };
  if (userWithUsername) return { success: false, message: "User with same username exists" };

  const hashedPassword = await hash(payload.password, 12); 

  try {
    await prisma.user.create({
      data: {
        username: payload.username,
        fullName: payload.fullName,
        email: payload.email,
        password: hashedPassword
      }
    });
    
    return { success: true, message: "User created successfully" };
  } catch (error) {
    return {success: false, message: error}    
  }
};

export const login = async (payload: LoginPayload) => {
  try {
    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    return { success: true, message: "Login successful" };
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { success: false, message: "This user doesn't exist" };
    }

    return { success: false, message: "Invalid email or password" };
  }
};