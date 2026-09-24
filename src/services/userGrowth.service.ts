import { prisma } from "@/lib/prisma";

export type UserGrowthRange = "7d" | "30d" | "this-year";

type UserGrowthPoint = {
  date: string;
  value: number;
};

function getStartDate(range: UserGrowthRange) {
  const now = new Date();

  if (range === "7d") {
    const start = new Date(now);

    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    return start;
  }

  if (range === "30d") {
    const start = new Date(now);

    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    return start;
  }

  return new Date(now.getFullYear(), 0, 1);
}

function fillMissingDates(data: UserGrowthPoint[], startDate: Date) {
  const map = new Map(data.map((item) => [item.date, item.value]));

  const result: UserGrowthPoint[] = [];

  const cursor = new Date(startDate);

  cursor.setHours(0, 0, 0, 0);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  while (cursor <= today) {
    const date = cursor.toISOString().slice(0, 10);

    result.push({
      date,
      value: map.get(date) ?? 0,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

export async function getUserGrowth(
  range: UserGrowthRange,
): Promise<UserGrowthPoint[]> {
  const startDate = getStartDate(range);
  const endDate = new Date();

  const users = await prisma.$queryRaw<
    Array<{
      date: string;
      count: bigint;
    }>
  >`
    SELECT
      TO_CHAR(
        DATE_TRUNC('day', "createdAt"),
        'YYYY-MM-DD'
      ) AS date,
      COUNT(*)::bigint AS count
    FROM "User"
    WHERE "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
    GROUP BY DATE_TRUNC('day', "createdAt")
    ORDER BY DATE_TRUNC('day', "createdAt") ASC
  `;

  const rawData = users.map((item) => ({
    date: item.date,
    value: Number(item.count),
  }));

  return fillMissingDates(rawData, startDate);
}
