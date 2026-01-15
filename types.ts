export enum UserRole {
  VOLUNTEER = 'volunteer',
  ADMIN = 'admin'
}

export enum LabStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ISSUE = 'Issue Reported'
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  state?: string;
  volNo?: string;
}

export interface Report {
  id: string;
  date: string;
  summary: string;
  url: string;
}

export interface Lab {
  id: string;
  name: string;
  state: string;
  district: string;
  status: LabStatus;
  address: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  lastVisit?: string;
  reports: Report[];
  notes?: string;
}

export type ViewState = 'AUTH' | 'DASHBOARD' | 'LAB_DETAIL';

// Ordered to match the 8-state grid view request
export const INDIAN_STATES = [
  "Maharashtra",
  "Gujarat",
  "Delhi",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Goa",
  "Andhra Pradesh"
];