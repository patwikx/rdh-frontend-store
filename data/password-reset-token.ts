import prismadb from "@/lib/db";


export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findFirst({
      where: { email }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};