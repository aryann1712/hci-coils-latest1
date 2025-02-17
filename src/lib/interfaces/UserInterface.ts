// src/lib/interfaces/UserInterface.ts
export interface UserType {
    userId: string;
    phone: string;
    role: string;
    token: string; // if you have a JWT
    // add more fields as needed (e.g. phone, gstNumber, etc.)
  }