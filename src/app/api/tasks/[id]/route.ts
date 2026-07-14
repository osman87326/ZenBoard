import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>
};

export async function GET(req: NextRequest, props: RouteContext) {
  try {
    const params = await props.params;
    const { id } = params;
    const task = await db.getTaskById(id);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Get Task ID API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: RouteContext) {
  try {
    const params = await props.params;
    const { id } = params;
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Log in to edit tasks' }, { status: 401 });
    }

    const body = await req.json();
    
    const task = await db.getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Attach updaterId so status notification triggers know who updated it
    const updateData = {
      ...body,
      updaterId: user.userId,
    };

    const updatedTask = await db.updateTask(id, updateData);
    return NextResponse.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Update Task API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: RouteContext) {
  try {
    const params = await props.params;
    const { id } = params;
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Log in to delete tasks' }, { status: 401 });
    }

    const task = await db.getTaskById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const deleted = await db.deleteTask(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Could not delete task' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete Task API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
