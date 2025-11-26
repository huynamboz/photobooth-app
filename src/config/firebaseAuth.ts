import { getAuth } from '@react-native-firebase/auth';

const auth = getAuth();
export const currentUser = auth.currentUser;

export default auth;
