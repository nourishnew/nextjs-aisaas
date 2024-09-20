import { auth, currentUser } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const checkApiLimit = async () => {
  console.log("Checking APi limit...");
  const { userId } = auth();
  if (!userId) return;
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const increaseApiLimit = async () => {
  console.log("Increasing API limit");
  const { userId } = auth();
  if (!userId) return;
  console.log("user id exist");
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });
  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: {
        userId: userId,
        count: 1,
      },
    });
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();
  if (!userId) return 0;
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });
  if (userApiLimit) {
    console.log(userApiLimit.count);
  }
  return userApiLimit?.count || 0;
};
