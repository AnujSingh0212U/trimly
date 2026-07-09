import type { User, UserRole, UserStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByClerkId(clerkId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { clerkId } });
  },

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  async upsertByClerkId(
    clerkId: string,
    create: Prisma.UserCreateInput,
    update: Prisma.UserUpdateInput
  ): Promise<User> {
    return prisma.user.upsert({ where: { clerkId }, create, update });
  },

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  },

  async list(params: {
    page: number;
    limit: number;
    status?: UserStatus;
    search?: string;
  }) {
    const { page, limit, status, search } = params;
    const where: Prisma.UserWhereInput = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { urls: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  },

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  },

  async updateRole(id: string, role: UserRole): Promise<User> {
    return prisma.user.update({ where: { id }, data: { role } });
  },

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    return prisma.user.update({ where: { id }, data: { status } });
  },
};
