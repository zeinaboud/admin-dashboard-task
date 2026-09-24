import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  Role,
  UserStatus,
  OrderStatus,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // -----------------------------------
  // Clear old data
  // -----------------------------------

  await prisma.activity.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Old data cleared");

  // -----------------------------------
  // Passwords
  // -----------------------------------

  const adminPassword = await bcrypt.hash("admin", 10);
  const userPassword = await bcrypt.hash("user", 10);

  // -----------------------------------
  // Admin
  // -----------------------------------

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@gmail.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      department: "Government Services",
      phone: "+971501000001",
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  // -----------------------------------
  // Demo User
  // -----------------------------------

  const user = await prisma.user.create({
    data: {
      name: "Ahmed Ali",
      email: "user@gmail.com",
      passwordHash: userPassword,
      role: Role.USER,
      status: UserStatus.ACTIVE,
      department: "Human Resources",
      phone: "+971501000002",
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // -----------------------------------
  // Government Service Orders
  // -----------------------------------
  //
  // The current schema only has:
  // amount + status
  //
  // So the type of government service
  // is represented through activities.
  // -----------------------------------

  await prisma.order.createMany({
    data: [
      {
        userId: user.id,
        amount: 320,
        status: OrderStatus.COMPLETED,
      },
      {
        userId: user.id,
        amount: 450,
        status: OrderStatus.PENDING,
      },
      {
        userId: user.id,
        amount: 180,
        status: OrderStatus.CANCELLED,
      },
    ],
  });

  console.log("✅ Government service orders created");

  // -----------------------------------
  // User Activities
  // -----------------------------------

  await prisma.activity.createMany({
    data: [
      {
        userId: user.id,
        action: "USER_CREATED",
        description: "Ahmed Ali account was created for government services.",
      },
      {
        userId: user.id,
        action: "ORDER_CREATED",
        description:
          "Residence permit renewal request was submitted. Government service fee: AED 320.",
      },
      {
        userId: user.id,
        action: "ORDER_COMPLETED",
        description:
          "Employment contract registration request was completed. Government service fee: AED 450.",
      },
      {
        userId: user.id,
        action: "PROFILE_UPDATED",
        description: "Ahmed Ali updated their profile information.",
      },
      {
        userId: user.id,
        action: "LOGIN",
        description: "Ahmed Ali logged into the government services portal.",
      },
      {
        userId: user.id,
        action: "ORDER_CANCELLED",
        description:
          "Work permit renewal request was cancelled. Government service fee: AED 180.",
      },
    ],
  });

  // -----------------------------------
  // Admin Activities
  // -----------------------------------

  await prisma.activity.createMany({
    data: [
      {
        userId: admin.id,
        action: "USER_CREATED",
        description:
          "Admin account was created for government services management.",
      },
      {
        userId: admin.id,
        action: "LOGIN",
        description: "Admin logged into the administration portal.",
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
