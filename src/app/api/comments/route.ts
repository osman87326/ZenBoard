import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'TaskId parameter is required' }, { status: 400 });
    }

    const comments = await db.getCommentsByTaskId(taskId);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Get Comments API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Log in to write comments' }, { status: 401 });
    }

    const { taskId, content } = await req.json();

    if (!taskId || !content) {
      return NextResponse.json({ error: 'TaskId and content are required' }, { status: 400 });
    }

    const task = await db.getTaskById(taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const newComment = await db.createComment({
      taskId,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      content,
    });

    return NextResponse.json({ message: 'Comment posted successfully', comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('Create Comment API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
