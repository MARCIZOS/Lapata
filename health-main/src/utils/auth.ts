export interface User {
  id: string;
  phone: string;
  role: 'citizen' | 'doctor' | 'pharmacy';
  name: string;
  [key: string]: any;
}

export interface CitizenData {
  name: string;
  phone: string;
  age: string;
  gender: string;
  village: string;
  password: string;
}

export interface DoctorData {
  name: string;
  phone: string;
  specialty: string;
  registrationId: string;
  experience: string;
  password: string;
}

export interface PharmacyData {
  storeName: string;
  ownerName: string;
  phone: string;
  licenseNo: string;
  address: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  register(role: string, data: CitizenData | DoctorData | PharmacyData): User {
    const userId = Date.now().toString();
    const user: User = {
      id: userId,
      phone: data.phone,
      role: role as 'citizen' | 'doctor' | 'pharmacy',
      name: role === 'pharmacy' ? (data as PharmacyData).storeName : data.name,
      ...data
    };

    
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));

    return user;
  }

  login(phone: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}

export const authService = AuthService.getInstance();