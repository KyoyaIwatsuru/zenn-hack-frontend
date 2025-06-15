import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

export const createUserAccount = async (
  email: string,
  password: string,
  userName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  
  await updateProfile(userCredential.user, {
    displayName: userName,
  });
  
  return userCredential.user;
};

export const signInUserAccount = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const getUserIdToken = async (user: User): Promise<string> => {
  return await user.getIdToken();
};