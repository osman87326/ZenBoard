import fs from 'fs';
import path from 'path';

const LOCAL_DB_FILE = path.join(process.cwd(), 'db.json');

type LocalDBData = {
  users: any[];
  tasks: any[];
  comments: any[];
  notifications: any[];
};

const DEFAULT_USERS = [
  {
    _id: 'u1',
    name: 'Sarah Jenkins (PM)',
    email: 'admin@zenboard.com',
    password: '$2a$10$tZ2pB/LlytD7B6hF2l/c/O.rP8M1C0G6Cpxr6w6/R.KqH8bA7k56i', // hashed 'password123'
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    _id: 'u2',
    name: 'Alex Rivera (Dev)',
    email: 'dev@zenboard.com',
    password: '$2a$10$tZ2pB/LlytD7B6hF2l/c/O.rP8M1C0G6Cpxr6w6/R.KqH8bA7k56i',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    _id: 'u3',
    name: 'Emma Watson (Designer)',
    email: 'designer@zenboard.com',
    password: '$2a$10$tZ2pB/LlytD7B6hF2l/c/O.rP8M1C0G6Cpxr6w6/R.KqH8bA7k56i',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
];

const DEFAULT_TASKS = [
  {
    _id: 't1',
    title: 'Stripe Gateway Integration',
    shortDescription: 'Implement Stripe Checkout API and Webhook subscription updates.',
    description: 'Set up Stripe billing client library, write `/api/webhook` routes to handle async subscription changes, and style the subscription settings components in the settings page.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    estHours: 12,
    assignee: {
      name: 'Alex Rivera (Dev)',
      email: 'dev@zenboard.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    workspace: 'ZenBoard Platform',
    coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=800',
    attachments: [],
    creatorId: 'u1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const DEFAULT_COMMENTS: any[] = [];
const DEFAULT_NOTIFICATIONS: any[] = [];

function initializeLocalDB() {
  if (!fs.existsSync(LOCAL_DB_FILE)) {
    const data: LocalDBData = {
      users: DEFAULT_USERS,
      tasks: DEFAULT_TASKS,
      comments: DEFAULT_COMMENTS,
      notifications: DEFAULT_NOTIFICATIONS,
    };
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
}

function readLocalDB(): LocalDBData {
  initializeLocalDB();
  try {
    const content = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return { users: DEFAULT_USERS, tasks: DEFAULT_TASKS, comments: DEFAULT_COMMENTS, notifications: DEFAULT_NOTIFICATIONS };
  }
}

function writeLocalDB(d: LocalDBData) {
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(d, null, 2), 'utf-8');
}

// Firebase was removed; this DB implementation uses local JSON only.
const firebaseEnabled = false;
const firestore: any = null;

// Helper to map Firestore docs to plain objects with _id
function docToObj(doc: any) {
  if (!doc) return null;
  return { _id: doc.id, ...(doc.data ? doc.data() : doc) };
}

export const db = {
  getMode() {
    return firebaseEnabled ? 'firebase' : 'local';
  },

  async getUsers() {
    if (firebaseEnabled && firestore) {
      const snap = await firestore.collection('users').get();
      return snap.docs.map((d: any) => ({ _id: d.id, ...d.data() }));
    }
    return readLocalDB().users;
  },

  async getUserByEmail(email: string) {
    if (firebaseEnabled && firestore) {
      const snap = await firestore.collection('users').where('email', '==', email).limit(1).get();
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { _id: d.id, ...d.data() };
    }
    const data = readLocalDB();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id: string) {
    if (firebaseEnabled && firestore) {
      const doc = await firestore.collection('users').doc(id).get();
      if (!doc.exists) return null;
      return { _id: doc.id, ...doc.data() };
    }
    const data = readLocalDB();
    return data.users.find((u) => u._id === id) || null;
  },

  async createUser(userData: any) {
    if (firebaseEnabled && firestore) {
      const ref = await firestore.collection('users').add(userData);
      const doc = await ref.get();
      return { _id: doc.id, ...doc.data() };
    }
    const data = readLocalDB();
    const newUser = { _id: 'u_' + Math.random().toString(36).slice(2, 9), ...userData };
    data.users.push(newUser);
    writeLocalDB(data);
    return newUser;
  },

  async getTasks(query: any = {}) {
    if (firebaseEnabled && firestore) {
      let coll = firestore.collection('tasks') as any;
      // basic filtering; Firestore limitations mean complex text search isn't implemented here
      if (query.workspace) coll = coll.where('workspace', '==', query.workspace);
      if (query.status) coll = coll.where('status', '==', query.status);
      if (query.priority) coll = coll.where('priority', '==', query.priority);

      const snap = await coll.get();
      const tasks = snap.docs.map((d: any) => ({ _id: d.id, ...d.data() }));
      const total = tasks.length;
      const page = query.page || 1;
      const limit = query.limit || 10;
      const start = (page - 1) * limit;
      return { tasks: tasks.slice(start, start + limit), total };
    }

    const data = readLocalDB();
    let filtered = [...data.tasks];
    if (query.workspace) filtered = filtered.filter((t) => t.workspace === query.workspace);
    if (query.status) filtered = filtered.filter((t) => t.status === query.status);
    if (query.priority) filtered = filtered.filter((t) => t.priority === query.priority);
    if (query.search) {
      const s = query.search.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(s) || t.shortDescription.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }

    // sorting
    if (query.sort === 'dueDateAsc') filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    else if (query.sort === 'dueDateDesc') filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const start = (page - 1) * limit;
    return { tasks: filtered.slice(start, start + limit), total };
  },

  async getTaskById(id: string) {
    if (firebaseEnabled && firestore) {
      const doc = await firestore.collection('tasks').doc(id).get();
      if (!doc.exists) return null;
      return { _id: doc.id, ...doc.data() };
    }
    const data = readLocalDB();
    return data.tasks.find((t) => t._id === id) || null;
  },

  async createTask(taskData: any) {
    if (firebaseEnabled && firestore) {
      const ref = await firestore.collection('tasks').add({ ...taskData, createdAt: new Date().toISOString() });
      const doc = await ref.get();
      return { _id: doc.id, ...doc.data() };
    }
    const data = readLocalDB();
    const newTask = {
      _id: 't_' + Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
      owner_email: taskData.owner_email || taskData.creatorId || '',
      ...taskData,
    };
    data.tasks.push(newTask);
    writeLocalDB(data);

    if (taskData.assignee?.email) {
      const u = data.users.find((x) => x.email === taskData.assignee.email);
      if (u && u._id !== taskData.creatorId) {
        data.notifications.push({
          _id: 'n_' + Math.random().toString(36).slice(2, 9),
          userId: u._id,
          user_email: u.email,
          title: 'Task Assigned',
          message: `You have been assigned to ${taskData.title}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
        writeLocalDB(data);
      }
    }
    return newTask;
  },

  async updateTask(id: string, updateData: any) {
    if (firebaseEnabled && firestore) {
      await firestore.collection('tasks').doc(id).set(updateData, { merge: true });
      const doc = await firestore.collection('tasks').doc(id).get();
      return { _id: doc.id, ...doc.data() };
    }
    const data = readLocalDB();
    const idx = data.tasks.findIndex((t) => t._id === id);
    if (idx === -1) return null;
    const old = data.tasks[idx];
    const updated = { ...old, ...updateData };
    data.tasks[idx] = updated;
    writeLocalDB(data);

    if (updateData.status && old.status !== updateData.status) {
      const recipients = Array.from(new Set([updated.creatorId, updated.assignee?.email, updated.owner_email]));
      for (const r of recipients) {
        let uId = r;
        if (r && typeof r === 'string' && r.includes('@')) {
          const u = data.users.find((uu) => uu.email === r);
          if (u) uId = u._id;
        }
        if (uId && uId !== updateData.updaterId) {
          data.notifications.push({
            _id: 'n_' + Math.random().toString(36).slice(2, 9),
            userId: uId,
            user_email: typeof r === 'string' && r.includes('@') ? r : undefined,
            title: 'Task Status Shift',
            message: `Task "${updated.title}" status updated to "${updateData.status}".`,
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
      writeLocalDB(data);
    }
    return updated;
  },

  async deleteTask(id: string) {
    if (firebaseEnabled && firestore) {
      await firestore.collection('tasks').doc(id).delete();
      // also delete comments in Firestore
      const commentsSnap = await firestore.collection('comments').where('taskId', '==', id).get();
      const batch = firestore.batch();
      commentsSnap.forEach((d: any) => batch.delete(d.ref));
      await batch.commit();
      return true;
    }
    const data = readLocalDB();
    const before = data.tasks.length;
    data.tasks = data.tasks.filter((t) => t._id !== id);
    data.comments = data.comments.filter((c) => c.taskId !== id && c.task_id !== id);
    writeLocalDB(data);
    return data.tasks.length < before;
  },

  async getCommentsByTaskId(taskId: string) {
    if (firebaseEnabled && firestore) {
      const snap = await firestore.collection('comments').where('taskId', '==', taskId).orderBy('createdAt', 'asc').get();
      return snap.docs.map((d: any) => ({ _id: d.id, ...d.data() }));
    }
    const data = readLocalDB();
    return data.comments
      .filter((c) => c.taskId === taskId || c.task_id === taskId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async createComment(commentData: any) {
    if (firebaseEnabled && firestore) {
      const ref = await firestore.collection('comments').add({ ...commentData, createdAt: new Date().toISOString() });
      const doc = await ref.get();
      return { _id: doc.id, ...doc.data() };
    }
    const data = readLocalDB();
    const newComment = {
      _id: 'c_' + Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
      taskId: commentData.taskId || commentData.task_id,
      task_id: commentData.task_id || commentData.taskId,
      author: commentData.author,
      author_name: commentData.author?.name || commentData.author_name,
      author_email: commentData.author?.email || commentData.author_email,
      content: commentData.content,
      ...commentData,
    };
    data.comments.push(newComment);
    writeLocalDB(data);

    const task = data.tasks.find((t) => t._id === (commentData.taskId || commentData.task_id));
    if (task) {
      const notifyUsers = Array.from(new Set([task.creatorId, task.assignee?.email, task.owner_email]));
      for (const emailOrId of notifyUsers) {
        let uId = emailOrId;
        if (emailOrId && typeof emailOrId === 'string' && emailOrId.includes('@')) {
          const u = data.users.find((uu) => uu.email === emailOrId);
          if (u) uId = u._id;
        }
        const authorUser = data.users.find((uu) => uu.name === (commentData.author?.name || commentData.author_name));
        if (uId && uId !== authorUser?._id) {
          data.notifications.push({
            _id: 'n_' + Math.random().toString(36).slice(2, 9),
            userId: uId,
            user_email: typeof emailOrId === 'string' && emailOrId.includes('@') ? emailOrId : undefined,
            title: 'New Comment',
            message: `${commentData.author?.name || commentData.author_name} commented on "${task.title}": "${(commentData.content || '').toString().substring(0, 40)}..."`,
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
      writeLocalDB(data);
    }
    return newComment;
  },

  async getNotificationsByUserId(userId: string) {
    if (firebaseEnabled && firestore) {
      const snap = await firestore.collection('notifications').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
      return snap.docs.map((d: any) => ({ _id: d.id, ...d.data() }));
    }
    const data = readLocalDB();
    return data.notifications
      .filter((n) => n.userId === userId || n.user_email === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createNotification(notificationData: any) {
    if (firebaseEnabled && firestore) {
      const ref = await firestore.collection('notifications').add({ ...notificationData, isRead: false, createdAt: new Date().toISOString() });
      const doc = await ref.get();
      return { _id: doc.id, ...doc.data() };
    }
    const data = readLocalDB();
    const newNotification = {
      _id: 'n_' + Math.random().toString(36).slice(2, 9),
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: notificationData.userId,
      user_email: notificationData.user_email || notificationData.userId,
      ...notificationData,
    };
    data.notifications.push(newNotification);
    writeLocalDB(data);
    return newNotification;
  },

  async markNotificationRead(id: string) {
    if (firebaseEnabled && firestore) {
      await firestore.collection('notifications').doc(id).set({ isRead: true }, { merge: true });
      return true;
    }
    const data = readLocalDB();
    const idx = data.notifications.findIndex((n) => n._id === id);
    if (idx === -1) return false;
    data.notifications[idx].isRead = true;
    writeLocalDB(data);
    return true;
  },

  async markAllNotificationsRead(userId: string) {
    if (firebaseEnabled && firestore) {
      const snap = await firestore.collection('notifications').where('userId', '==', userId).where('isRead', '==', false).get();
      const batch = firestore.batch();
      snap.forEach((d: any) => batch.set(d.ref, { isRead: true }, { merge: true }));
      await batch.commit();
      return true;
    }
    const data = readLocalDB();
    data.notifications.forEach((n) => {
      if (n.userId === userId || n.user_email === userId) {
        n.isRead = true;
      }
    });
    writeLocalDB(data);
    return true;
  }
};

export default db;
