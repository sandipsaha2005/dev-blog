import { PrismaClient } from "../lib/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10)
  
  const user = await prisma.user.create({
    data: {
      username: "sandip",
      email: "sandip@example.com",
      fullName: "Sandip Saha",
      password: hashedPassword,
      role: "USER",
    }
  })

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Next.js", slug: "nextjs" } }),
    prisma.tag.create({ data: { name: "TypeScript", slug: "typescript" } }),
    prisma.tag.create({ data: { name: "React", slug: "react" } }),
  ])

  await prisma.post.createMany({
    data: [
      {
        userId: user.id,
        heading: "Getting Started with Next.js 15",
        content: "Next.js 15 brings exciting new features...",
        slug: "getting-started-nextjs-15",
        published: true,
        mediaUrl: null,
      },
      {
        userId: user.id,
        heading: "TypeScript Best Practices",
        content: "TypeScript makes your code safer...",
        slug: "typescript-best-practices",
        published: true,
        mediaUrl: null,
      },
      {
        userId: user.id,
        heading: "Draft Post — Not Published",
        content: "This should not appear...",
        slug: "draft-post",
        published: false,
        mediaUrl: null,
      },
    ]
  })

  console.log("Seeded successfully")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())