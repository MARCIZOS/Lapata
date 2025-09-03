export interface HealthRecord {
  id: string;
  title: string;
  date: string;
  type: 'prescription' | 'lab_report' | 'medical_history' | 'other';
  description: string;
  file?: string;
  synced: boolean;
}

export interface UserData {
  healthRecords: HealthRecord[];
  lastSync: string | null;
}

class HealthStorage {
  private static instance: HealthStorage;
  private dbName = 'ruralHealthcareDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  static getInstance(): HealthStorage {
    if (!HealthStorage.instance) {
      HealthStorage.instance = new HealthStorage();
    }
    return HealthStorage.instance;
  }

  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('healthRecords')) {
          const store = db.createObjectStore('healthRecords', { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async saveHealthRecord(record: HealthRecord): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    
    const transaction = this.db!.transaction(['healthRecords'], 'readwrite');
    const store = transaction.objectStore('healthRecords');
    await store.put(record);
  }

  async getHealthRecords(): Promise<HealthRecord[]> {
    if (!this.db) {
      await this.initDB();
    }
    
    const transaction = this.db!.transaction(['healthRecords'], 'readonly');
    const store = transaction.objectStore('healthRecords');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteHealthRecord(id: string): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    
    const transaction = this.db!.transaction(['healthRecords'], 'readwrite');
    const store = transaction.objectStore('healthRecords');
    await store.delete(id);
  }

  // Fallback to localStorage for simple data
  saveToLocal(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getFromLocal(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}

export const healthStorage = HealthStorage.getInstance();