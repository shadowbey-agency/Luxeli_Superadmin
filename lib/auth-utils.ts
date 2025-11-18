/**
 * Authentication utilities for SuperAdmin and Member
 */

export interface SuperAdminData {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  role: 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface MemberData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  profileImage?: string;
  permissions: string[];
  role: 'member';
  createdAt: string;
  updatedAt: string;
}

export interface PartnerData {
  _id: string;
  hotelName: string;
  hotelAddressEmail: string;
  username: string;
  phoneNumber: string;
  hotelCity: string;
  plan: string;
  status: string;
  role: 'partner';
  createdAt: string;
  updatedAt: string;
}

export type UserData = SuperAdminData | MemberData | PartnerData;

export interface LoginResponse {
  message: string;
  token: string;
  user: UserData;
  userType: 'superadmin' | 'member' | 'partner';
}

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

/**
 * Get stored user data (superadmin or member)
 */
export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
  return data ? JSON.parse(data) : null;
}

/**
 * Get stored superadmin data (for backward compatibility)
 */
export function getSuperAdminData(): SuperAdminData | null {
  const userData = getUserData();
  return userData && userData.role === 'superadmin' ? userData as SuperAdminData : null;
}

/**
 * Store authentication data
 */
export function storeAuthData(token: string, userData: UserData, remember: boolean = false): void {
  if (typeof window === 'undefined') return;
  
  if (remember) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    // Keep backward compatibility
    localStorage.setItem('superadmin_token', token);
    localStorage.setItem('superadmin_data', JSON.stringify(userData));
  } else {
    sessionStorage.setItem('auth_token', token);
    sessionStorage.setItem('user_data', JSON.stringify(userData));
    // Keep backward compatibility
    sessionStorage.setItem('superadmin_token', token);
    sessionStorage.setItem('superadmin_data', JSON.stringify(userData));
  }
}

/**
 * Clear authentication data
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('superadmin_token');
  localStorage.removeItem('superadmin_data');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('user_data');
  sessionStorage.removeItem('superadmin_token');
  sessionStorage.removeItem('superadmin_data');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): { Authorization: string } | {} {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Login function for superadmin, member, and partner
 * Auto-detects user type based on identifier (email or username)
 */
export async function loginUser(identifier: string, password: string, userType?: 'superadmin' | 'member' | 'partner'): Promise<LoginResponse> {
  const body: any = { password };
  
  // Auto-detect: if it looks like an email, use email; otherwise use username
  // The backend will try both email and username for all user types
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
  
  if (isEmail) {
    body.email = identifier.trim();
  } else {
    body.username = identifier.trim();
  }

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

/**
 * Login function (for backward compatibility)
 */
export async function loginSuperAdmin(email: string, password: string): Promise<LoginResponse> {
  return loginUser(email, password);
}

/**
 * Logout function
 */
export function logoutUser(): void {
  clearAuthData();
  if (typeof window !== 'undefined') {
    // Clear httpOnly cookie on server
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      window.location.href = '/login';
    });
  }
}

/**
 * Logout function (for backward compatibility)
 */
export function logoutSuperAdmin(): void {
  logoutUser();
}
