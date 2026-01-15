import { Lab, LabStatus, User, UserRole } from './types';

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Super Admin',
  email: 'admin@vollab.com',
  mobile: '9999999999',
  role: UserRole.ADMIN,
};

export const MOCK_LABS: Lab[] = [
  {
    id: 'l1',
    name: 'City Pathology Lab',
    state: 'Maharashtra',
    district: 'Mumbai',
    status: LabStatus.COMPLETED,
    address: '123 Marine Drive, Mumbai, MH',
    contactPerson: 'Dr. Sharma',
    contactNumber: '+91 9876543210',
    email: 'citypath@example.com',
    lastVisit: '2023-10-15',
    reports: [
      { id: 'r1', date: '2023-10-15', summary: 'Quarterly Audit', url: '#' }
    ]
  },
  {
    id: 'l2',
    name: 'Green Cross Diagnostics',
    state: 'Maharashtra',
    district: 'Pune',
    status: LabStatus.IN_PROGRESS,
    address: '45 FC Road, Pune, MH',
    contactPerson: 'Mr. Patil',
    contactNumber: '+91 9876543211',
    email: 'greencross@example.com',
    lastVisit: '2023-10-20',
    reports: []
  },
  {
    id: 'l3',
    name: 'TechHealth Labs',
    state: 'Karnataka',
    district: 'Bangalore',
    status: LabStatus.PENDING,
    address: '88 MG Road, Bangalore, KA',
    contactPerson: 'Ms. Reddy',
    contactNumber: '+91 9876543212',
    email: 'techhealth@example.com',
    reports: []
  },
  {
    id: 'l4',
    name: 'Capital Care Lab',
    state: 'Delhi',
    district: 'New Delhi',
    status: LabStatus.ISSUE,
    address: 'Connaught Place, Delhi',
    contactPerson: 'Dr. Singh',
    contactNumber: '+91 9876543213',
    email: 'capital@example.com',
    lastVisit: '2023-09-01',
    notes: 'Equipment malfunction reported.',
    reports: [
       { id: 'r2', date: '2023-09-01', summary: 'Incident Report', url: '#' }
    ]
  },
  {
    id: 'l5',
    name: 'Sunrise Diagnostics',
    state: 'Gujarat',
    district: 'Ahmedabad',
    status: LabStatus.COMPLETED,
    address: 'Navrangpura, Ahmedabad, GJ',
    contactPerson: 'Mr. Patel',
    contactNumber: '+91 9876543214',
    email: 'sunrise@example.com',
    reports: []
  }
];