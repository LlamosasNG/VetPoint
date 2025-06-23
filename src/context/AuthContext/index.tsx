import {CreateUserInput, User} from '@/types/User'; // Importamos los nuevos tipos
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react';

interface AuthContextProps {
  user: FirebaseAuthTypes.User | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: CreateUserInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async firebaseUser => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await firestore()
          .collection('users')
          .doc(firebaseUser.uid)
          .get();
        setUserData(userDoc.data() as User);
      } else {
        setUserData(null);
      }
      if (loading) {
        setLoading(false);
      }
    });
    return subscriber;
  }, []);

  const login = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const register = async (userData: CreateUserInput) => {
    const {email, password, ...professionalData} = userData;

    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const {uid} = userCredential.user;

    const userDataToSave: Omit<User, 'createdAt'> = {
      id: uid,
      email,
      ...professionalData,
    };

    await firestore()
      .collection('users')
      .doc(uid)
      .set({
        ...userDataToSave,
        createdAt: firestore.FieldValue.serverTimestamp(), // Usamos el timestamp del servidor
      });
  };

  const logout = async () => {
    await auth().signOut();
  };

  return (
    <AuthContext.Provider
      value={{user, userData, loading, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
