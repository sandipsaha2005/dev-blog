import { prisma } from '@/lib/prisma';
import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest, {params} : {params: {slug: string}}) {
  const { slug } = await params;

  console.log("hey");
  
  await prisma.post.update({
    where: {
      slug
    },
    data: {
      viewCount: { increment: 1 }
    }
  });

  return NextResponse.json({ success: true });
}