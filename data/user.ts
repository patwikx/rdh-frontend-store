import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id }, 
     }
    );
    
    return user;
  } catch {
    return null;
  }
};

export const getEmailByUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, firstName: true, lastName: true },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  return [user.firstName, user.lastName];
};

export const getEmailByUserIdUpload = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  return user.email;
};

export const getEmailByApproverId = async (approverId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: approverId },
    select: { email: true, firstName: true },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  return user.email;
};