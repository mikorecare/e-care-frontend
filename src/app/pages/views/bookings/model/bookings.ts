// bookings.ts

export class Booking {
    // Mongo _id, optional
    _id?: string;
  
    // References
    userId?: string;          // references 'User'
    department?: string;      // references 'Department'
  
    // Core fields
    description?: string;
    date?: Date;              // The actual appointment date
    time?: 'morning' | 'afternoon';
    status?: 'upcoming' | 'completed' | 'cancelled';
  
    // Patient Info
    firstname?: string;
    lastname?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: Date;
    address?: string;
    mobileNumber?: string;
  
    // Timestamps
    createdAt?: Date;
    updatedAt?: Date;
  }
  