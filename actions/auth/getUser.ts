"use server"
import axios, { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { parsedEnv } from "@/app/env";
import { User } from "@/types";
import {logout} from "@/actions/auth/logout";
export async function getUser() {
   const cookieStore = await cookies();
   const userCookie = cookieStore.get("user")?.value;
   const UserObject:User = JSON.parse(userCookie? userCookie : "{}") as User;
   if (!userCookie) {logout()}; // If no user cookie, logout

   return UserObject;

}