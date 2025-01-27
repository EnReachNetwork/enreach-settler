import { Prisma } from "@prisma/client";
import { prisma } from "../db.js";
import { AccountAmount } from "../types/score.js";

export const storeWorkloadId = async (id: number) => {
  await prisma.metadata.upsert({
    where: { key: "workload_id" },
    update: { value: id.toString() },
    create: { key: "workload_id", value: id.toString() },
  });
};

export const queryWorkloadId = async () => {
  const metadata = await prisma.metadata.findUnique({
    where: { key: "workload_id" },
  });

  return metadata ? parseInt(metadata.value) : 0;
};

export const storeEpochWorkload = async (
  epoch: number,
  data: AccountAmount[],
) => {
  console.log(data);
  await prisma.score.upsert({
    where: { epoch },
    update: { data: data as unknown as Prisma.InputJsonValue },
    create: { epoch: epoch, data: data as unknown as Prisma.InputJsonValue },
  });
};

export const queryEpochWorkload = async (
  epoch: number,
): Promise<AccountAmount[]> => {
  const workloads = await prisma.score.findFirst({
    where: { epoch },
  });

  const data = workloads?.data
    ? (workloads?.data as unknown as AccountAmount[])
    : [];

  return data.map((item: any) => ({
    ...item,
    amount: BigInt(item.amount),
  }));
};

export const queryNearestEpochWorkload = async (epoch: number) => {
  const nearestEpoch = await prisma.score.findFirst({
    where: {
      epoch: { lte: epoch },
    },
    orderBy: {
      epoch: "desc",
    },
  });

  const data = nearestEpoch?.data
    ? (nearestEpoch?.data as unknown as AccountAmount[])
    : [];

  return data.map((item: any) => ({
    ...item,
    amount: BigInt(item.amount),
  }));
};
