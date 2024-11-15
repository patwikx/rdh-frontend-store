'use server'

import { NewPasswordSchema, RegisterTenantSchema, RegisterUserSchema, ResetSchema, SettingsSchema, UserRegisterSchema } from "@/schemas";

import {  getUserByEmail, getUserById } from "@/data/user";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import prismadb from "@/lib/db";
import { getCurrentUser } from "@/hooks/get-current-user";





  export const settings = async (
    values: z.infer<typeof SettingsSchema>
  ) => {
    const user = await getCurrentUser();
  
    if (!user) {
      return { error: "Unauthorized" }
    }
  
    const dbUser = await getUserById(user.id);
  
    if (!dbUser) {
      return { error: "Unauthorized" }
    }

  
    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);
  
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" }
      }
  

      return { success: "Verification email sent!" };
    }
  
    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password,
      );
  
      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }
  
      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        10,
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }
  
    const updatedUser = await prismadb.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      }
    });
  
  
    return { success: "Settings Updated!" }
  }

  export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid emaiL!" };
    }
  
    const { email } = validatedFields.data;
  
    const existingUser = await getUserByEmail(email);
  
    if (!existingUser) {
      return { error: "Email not found!" };
    }
  
    return { success: "Reset email sent!" };
  }


  export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema> ,
    token?: string | null,
  ) => {
    if (!token) {
      return { error: "Missing token!" };
    }
  
    const validatedFields = NewPasswordSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { password } = validatedFields.data;
  
    const existingToken = await getPasswordResetTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Invalid token!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" }
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await prismadb.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    return { success: "Password updated!" };
  };

  export const registerUser = async (values: z.infer<typeof UserRegisterSchema>) => {
    try {
      const validatedFields = UserRegisterSchema.parse(values)
  
      const { email, password, firstName, lastName, companyName } = validatedFields
  
      const existingUser = await prismadb.user.findUnique({
        where: { email }
      })
  
      if (existingUser) {
        return { error: "Email already in use!" }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      await prismadb.user.create({
        data: {
          lastName,
          firstName,
          email,
          companyName,
          password: hashedPassword,
        }
      })
  
      return { success: "User created successfully!" }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: error.errors[0].message }
      }
      return { error: "An unexpected error occurred" }
    }
  }
