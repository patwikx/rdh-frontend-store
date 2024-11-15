import prismadb from "@/lib/db";


export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await prismadb.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await prismadb.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
  } catch {
    return null;
  }
}