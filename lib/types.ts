export type UserRole = "student" | "teacher";

export interface TeacherReview {
  id: string;
  user: string;
  comment: string;
  rating: number;
}

export interface Teacher {
  id: string;
  name: string;
  image: string;
  subject: string;
  subjects: string[];
  rating: number;
  price: number;
  location: string;
  experienceYears: number;
  bio: string;
  reviews: TeacherReview[];
  distanceKm?: number | null;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  teacherId?: string;
}

export interface Booking {
  id: string;
  studentId: string;
  teacherId: string;
  note: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  teacherId?: string;
}
