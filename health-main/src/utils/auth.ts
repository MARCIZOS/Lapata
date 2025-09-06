// src/utils/auth.ts  (REPLACE FILE)
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface FirebaseError extends Error {
  code?: string;
}

export interface User {
  id: string;
  phone: string;
  role: 'citizen' | 'doctor' | 'pharmacy';
  name: string;
  [key: string]: any;
}

export interface CitizenData {
  name: string; phone: string; age: string; gender: string; village: string; password: string;
}
export interface DoctorData {
  name: string; phone: string; specialty: string; registrationId: string; experience: string; password: string;
}
export interface PharmacyData {
  storeName: string; ownerName: string; phone: string; licenseNo: string; address: string; password: string;
}

interface FirebaseProfile {
  phone?: string;
  role?: User['role'];
  name?: string;
  [key: string]: any;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private isValidRole(role: unknown): role is User['role'] {
    return typeof role === 'string' && 
           (role === 'citizen' || role === 'doctor' || role === 'pharmacy');
  }

  private validateData(role: User['role'], data: CitizenData | DoctorData | PharmacyData): void {
    console.log('Validating data for role:', role);
    
    const requiredFields = {
      citizen: ['name', 'phone', 'age', 'gender', 'village', 'password'],
      doctor: ['name', 'phone', 'specialty', 'registrationId', 'experience', 'password'],
      pharmacy: ['storeName', 'ownerName', 'phone', 'licenseNo', 'address', 'password']
    };

    const fields = requiredFields[role];
    if (!fields) {
      throw new Error(`Invalid role for validation: ${role}`);
    }

    const missingFields = fields.filter(field => {
      const value = (data as any)[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      console.error('Missing or empty fields:', missingFields);
      throw new Error(`Missing or empty required fields: ${missingFields.join(', ')}`);
    }

    // Validate phone number format
    const phone = (data as any).phone;
    if (!/^\d{10}$/.test(phone)) {
      throw new Error('Phone number must be exactly 10 digits');
    }

    // Validate password strength
    const password = (data as any).password;
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    console.log('Data validation passed');
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  constructor() {
    onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) { 
        this.currentUser = null; 
        return; 
      }
      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        const profile = snap.exists() ? snap.data() as FirebaseProfile : {};
        const defaultRole = 'citizen' as const;
        const userRole = profile?.role ?? defaultRole;
        
        if (!this.isValidRole(userRole)) {
          throw new Error('Invalid role in user profile');
        }
        
        this.currentUser = {
          id: fbUser.uid,
          phone: profile?.phone || '',
          role: userRole,
          name: profile?.name || (fbUser.displayName ?? ''),
          ...profile
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.currentUser = null;
      }
    });
  }

  // Use email = phone@lapata.fake to keep your UI same (or add real email field)
  private phoneToEmail(phone: string) { return `${phone}@lapata.fake`; }

  private async retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError;
    const backoffTimes = [1000, 2000, 4000]; // Exponential backoff

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        if (error.code === 'auth/network-request-failed') {
          if (attempt < maxRetries) {
            const waitTime = backoffTimes[attempt - 1] || backoffTimes[backoffTimes.length - 1];
            console.log(`Network request failed. Attempt ${attempt}/${maxRetries}. Retrying in ${waitTime/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        // Enhance error messages for common Firebase errors
        if (error.code) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              error.message = 'This phone number is already registered.';
              break;
            case 'auth/invalid-email':
              error.message = 'Invalid phone number format.';
              break;
            case 'auth/operation-not-allowed':
              error.message = 'Email/password accounts are not enabled. Please contact support.';
              break;
            case 'auth/weak-password':
              error.message = 'Password should be at least 6 characters.';
              break;
          }
        }
        
        throw error;
      }
    }
    throw lastError;
  }

  async register(role: string, data: CitizenData | DoctorData | PharmacyData): Promise<User> {
    try {
      // In development, don't check internet connectivity for emulators
      if (!import.meta.env.DEV) {
        try {
          await Promise.race([
            fetch('https://www.google.com/favicon.ico'),
            fetch('https://www.cloudflare.com/favicon.ico'),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 5000))
          ]);
        } catch (error) {
          const networkError = {
            name: 'FirebaseError',
            code: 'auth/network-request-failed',
            message: 'Unable to connect to the server. Please check your internet connection and try again.'
          } as AuthError;
          throw networkError;
        }
      }

      console.log('Starting registration process...');
      
      if (!this.isValidRole(role)) {
        console.error('Invalid role specified:', role);
        throw {
          name: 'FirebaseError',
          code: 'auth/invalid-role',
          message: `Invalid role selected: ${role}`
        } as AuthError;
      }

      try {
        this.validateData(role as User['role'], data);
      } catch (error) {
        console.error('Data validation failed:', error);
        throw {
          name: 'FirebaseError',
          code: 'auth/invalid-data',
          message: error instanceof Error ? error.message : 'Invalid data provided'
        } as AuthError;
      }
      
      const phone = (data as any).phone;
      const password = (data as any).password;
      
      console.log('Starting registration with validated data...');

      const email = this.phoneToEmail(phone);
      console.log('Attempting to create user with email:', email);
      
      let cred;
      try {
        cred = await this.retryOperation(() => createUserWithEmailAndPassword(auth, email, password));
        console.log('User created successfully:', cred.user.uid);
      } catch (error: any) {
        console.error('Error creating user:', error);
        if (error.code === 'auth/internal-error' && import.meta.env.DEV) {
          throw new Error('Firebase Auth emulator might not be running. Please ensure emulators are started.');
        }
        throw error;
      }

      // shape name consistently with your old file
      const name =
        role === 'pharmacy' ? (data as PharmacyData).storeName : (data as any).name;

      const { phone: _, ...otherData } = data as any;
      const profile: User = {
        id: cred.user.uid,
        phone,
        role: role as User['role'],
        name,
        ...otherData
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);

      this.currentUser = profile;
      return profile;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(phone: string, password: string): Promise<User | null> {
    try {
      if (!phone || !password) {
        throw new Error('Phone and password are required');
      }

      const email = this.phoneToEmail(phone);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      
      if (!snap.exists()) {
        console.error('User profile not found');
        return null;
      }
      
      const profile = snap.data() as User;
      this.currentUser = profile;
      return profile;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}

export const authService = AuthService.getInstance();
