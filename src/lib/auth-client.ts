import { getCurrentUser, loginUser, logoutUser, registerUser } from './auth';

export const authClient = {
  signIn: loginUser,
  signUp: registerUser,
  signOut: logoutUser,
  getSession: getCurrentUser,
};

export const signIn = loginUser;
export const signUp = registerUser;
export const useSession = getCurrentUser;
