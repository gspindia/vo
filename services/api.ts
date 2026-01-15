import { Lab, User, UserRole, LabStatus } from '../types';
import { MOCK_ADMIN, MOCK_LABS } from '../constants';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for the session
let currentLabs = [...MOCK_LABS];

export const api = {
  login: async (mobile: string, password: string, role?: UserRole): Promise<User> => {
    await delay(800);

    // Prioritize Role-based login for the dual-login UI
    if (role === UserRole.ADMIN) {
        // Enforce specific password for Admin as requested
        if (password === '1111') {
             return MOCK_ADMIN;
        }
        // If password is wrong, throw error to trigger UI failure state
        throw new Error("Invalid Admin Credentials");
    }

    // Legacy/Direct credential check for non-role based calls (fallback)
    if (mobile === 'admin' && password === '1111') {
      return MOCK_ADMIN;
    }
    
    // Default to volunteer for any other success (Volunteer Login)
    // In a real app, you would check DB here.
    return {
      id: 'vol-1',
      name: 'John Volunteer',
      email: 'john@example.com',
      mobile: mobile,
      role: UserRole.VOLUNTEER,
      state: 'Maharashtra', // Default assigned state
      volNo: 'VOL-101'
    };
  },

  signup: async (userData: any): Promise<User> => {
    await delay(1000);
    return {
      id: `vol-${Math.random()}`,
      ...userData,
      role: UserRole.VOLUNTEER
    };
  },

  getLabs: async (): Promise<Lab[]> => {
    await delay(500);
    return [...currentLabs];
  },

  addLab: async (lab: Omit<Lab, 'id'>): Promise<Lab> => {
    await delay(500);
    const newLab: Lab = {
      ...lab,
      id: `lab-${Date.now()}`,
      reports: []
    };
    currentLabs.push(newLab);
    return newLab;
  },

  updateLab: async (lab: Lab): Promise<Lab> => {
    await delay(500);
    const index = currentLabs.findIndex(l => l.id === lab.id);
    if (index !== -1) {
      currentLabs[index] = lab;
      return lab;
    }
    throw new Error("Lab not found");
  },

  deleteLab: async (labId: string): Promise<void> => {
    await delay(500);
    currentLabs = currentLabs.filter(l => l.id !== labId);
  },

  updateLabStatus: async (labId: string, status: string): Promise<void> => {
    await delay(500);
    const lab = currentLabs.find(l => l.id === labId);
    if (lab) {
      lab.status = status as LabStatus;
    }
    console.log(`Updated lab ${labId} to ${status}`);
  }
};