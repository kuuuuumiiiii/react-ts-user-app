// ユーザーのデータ型を定義する

export type User = {
  id: number;
  name: string;
  role: 'student' | 'mentor';
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
} & (
  | {
      role: 'student';
      studyMinutes: number;
      taskCode: number;
      studyLangs: string[];
      score: number;
    }
  | {
      role: 'mentor';
      experienceDays: number;
      useLangs: string[];
      availableStartCode: number;
      availableEndCode: number;
    }
);
