import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

/**
 * MD5 hash helper for password security.
 */
function md5(content: string) {
  return crypto.createHash('md5').update(content).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: '请输入账号和密码' }, { status: 400 });
    }

    await dbConnect();

    // Hash the input password
    const hashedInputPassword = md5(password);

    // Find the user
    let user = await User.findOne({ username });

    // For demonstration/initial setup: If user doesn't exist, create it (Auto-registration)
    if (!user) {
      user = await User.create({ username, password: hashedInputPassword });
      return NextResponse.json({ 
        message: '账号不存在，已为您自动创建并加密登录', 
        user: { username: user.username } 
      });
    }

    // Check hashed password
    if (user.password !== hashedInputPassword) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    return NextResponse.json({ 
      message: '登录成功', 
      user: { username: user.username } 
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
