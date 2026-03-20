import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ username });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { username, nickname, avatar, bio } = await request.json();
    console.log('Updating profile for:', username, { nickname, avatar });
    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { nickname, avatar, bio },
      { new: true }
    );

    if (!updatedUser) {
      console.log('User not found in DB:', username);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Profile updated successfully for:', username);
    return NextResponse.json({ message: '个人信息已更新', user: updatedUser });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
