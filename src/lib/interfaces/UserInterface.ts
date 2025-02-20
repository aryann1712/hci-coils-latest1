// src/lib/interfaces/UserInterface.ts
export interface UserType {
    userId: string;
    name: string;
    phone: string;
    role: string;
    token: string; // if you have a JWT
    // add more fields as needed (e.g. phone, gstNumber, etc.)
  }


  export interface UserAllInfoType {
    userId: string;
    role?: string;
    name: string;
    phone: string;
    address: string;
    gstNumber: string;
    companyName: string;
    email: string

  } 