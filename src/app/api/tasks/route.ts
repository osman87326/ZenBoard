import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-request';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspace = searchParams.get('workspace') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const { tasks, total } = await db.getTasks({
      workspace,
      status,
      priority,
      search,
      sort,
      page,
      limit,
    });

    return NextResponse.json({ tasks, total, page, limit });
  } catch (error) {
    console.error('Get Tasks API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Log in to create tasks' }, { status: 401 });
    }

    const body = await req.json();
    const { title, shortDescription, description, priority, status, dueDate, estHours, assigneeName, coverImage, attachmentsString } = body;

    if (!title || !shortDescription || !description || !dueDate || !estHours) {
      return NextResponse.json({ error: 'Title, short/full description, due date, and estimated hours are required' }, { status: 400 });
    }

    // Map assignee by name from the pre-defined users
    const users: any[] = await db.getUsers();
    let selectedAssignee = {
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };

    if (assigneeName) {
      const matched = users.find((u: any) => u.name.toLowerCase().includes(assigneeName.toLowerCase()));
      if (matched) {
        selectedAssignee = {
          name: matched.name,
          avatar: matched.avatar,
          email: matched.email,
        };
      } else {
        selectedAssignee = {
          name: assigneeName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(assigneeName)}`,
          email: `${assigneeName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        };
      }
    }

    // Process attachments
    const attachments = attachmentsString
      ? attachmentsString.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0)
      : [];

    const taskData = {
      title,
      shortDescription,
      description,
      priority: priority || 'Medium',
      status: status || 'To Do',
      dueDate: new Date(dueDate),
      estHours: Number(estHours),
      assignee: selectedAssignee,
      workspace: body.workspace || 'ZenBoard Platform',
      coverImage: coverImage || '',
      attachments,
      creatorId: user.userId,
    };

    const newTask = await db.createTask(taskData);
    return NextResponse.json({ message: 'Task created successfully', task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Create Task API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
