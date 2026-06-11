"use server"

import { hash } from 'bcryptjs';
import { prisma } from "../prisma";

type RegisterPayload = {
  username: string,
  fullName: string,
  email: string,
  password: string,
};

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

  await prisma.user.create({
    data: {
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword
    }
  });

  return { success: true, message: "User created successfully" };
};
