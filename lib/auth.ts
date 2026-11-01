import { db } from './supabase';
import { redirect } from 'next/navigation';
export async function requireUser(){const supabase=await db();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect('/login');return {supabase,user};}
