import { useState } from "react";
import { User } from "../types/User";

// UserFormData型を定義
type UserFormData = {
  id?: number;
  name: string;
  role: "student" | "mentor";
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
} & (
  | {
      role: "student";
      studyMinutes: number;
      taskCode: number;
      studyLangs: string[];
      score: number;
    }
  | {
      role: "mentor";
      experienceDays: number;
      useLangs: string[];
      availableStartCode: number;
      availableEndCode: number;
    }
);

const INITIAL_FORM_DATA: UserFormData = {
  name: "",
  role: "student",
  email: "",
  age: 0,
  postCode: "",
  phone: "",
  hobbies: [],
  url: "",
  studyMinutes: 0,
  taskCode: 0,
  studyLangs: [],
  score: 0,
  experienceDays: 0,
  useLangs: [],
  availableStartCode: 0,
  availableEndCode: 0,
};

type UserFormProps = {
  onAddUser: (newUser: User) => void;
};

export const UserForm: React.FC<UserFormProps> = ({ onAddUser }) => {
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: ["age", "score", "studyMinutes", "experienceDays", "availableStartCode", "availableEndCode", "taskCode"].includes(name)
          ? Number(value)
          : ["hobbies", "studyLangs", "useLangs"].includes(name)
          ? value.split(",").map((v) => v.trim())
          : value,
      };

      console.log("更新後のフォームデータ:", updatedData);
      return updatedData as UserFormData;
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || formData.age <= 0) {
      alert("すべての必須項目を入力してください！");
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      email: formData.email,
      age: formData.age,
      postCode: formData.postCode,
      phone: formData.phone,
      hobbies: formData.hobbies,
      url: formData.url,
      ...(formData.role === "student"
        ? {
            studyMinutes: formData.studyMinutes,
            taskCode: formData.taskCode,
            studyLangs: formData.studyLangs,
            score: formData.score,
          }
        : {
            experienceDays: formData.experienceDays,
            useLangs: formData.useLangs,
            availableStartCode: formData.availableStartCode,
            availableEndCode: formData.availableEndCode,
          }),
    };

    onAddUser(newUser);
    setFormData({ ...INITIAL_FORM_DATA, role: formData.role });
  };

  return (
    <div className="mb-4 p-3 border rounded">
      <h2>新規ユーザー登録</h2>

      <label className="form-label">ロール</label>
      <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
        <option value="student">生徒</option>
        <option value="mentor">メンター</option>
      </select>

      <label className="form-label">名前</label>
      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />

      <label className="form-label">メールアドレス</label>
      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />

      <label className="form-label">年齢</label>
      <input type="number" className="form-control" name="age" value={formData.age || ""} onChange={handleChange} />

      <label className="form-label">郵便番号</label>
      <input type="text" className="form-control" name="postCode" value={formData.postCode} onChange={handleChange} />

      <label className="form-label">電話番号</label>
      <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />

      <label className="form-label">趣味 (カンマ区切り)</label>
      <input type="text" className="form-control" name="hobbies" value={formData.hobbies.join(", ")} onChange={handleChange} />

      <label className="form-label">URL</label>
      <input type="text" className="form-control" name="url" value={formData.url} onChange={handleChange} />

      {formData.role === "student" && (
        <>
          <label className="form-label">勉強時間 (分)</label>
          <input type="number" className="form-control" name="studyMinutes" value={formData.studyMinutes || ""} onChange={handleChange} />

          <label className="form-label">勉強中の言語 (カンマ区切り)</label>
          <input type="text" className="form-control" name="studyLangs" value={formData.studyLangs.join(", ")} onChange={handleChange} />

          <label className="form-label">ハピネススコア</label>
          <input type="number" className="form-control" name="score" value={formData.score || ""} onChange={handleChange} />

          <label className="form-label">課題番号</label>
          <input type="number" className="form-control" name="taskCode" value={formData.taskCode || ""} onChange={handleChange} />
        </>
      )}

      {formData.role === "mentor" && (
        <>
          <label className="form-label">実務経験 (日数)</label>
          <input type="number" className="form-control" name="experienceDays" value={formData.experienceDays || ""} onChange={handleChange} />

          <label className="form-label">使用言語 (カンマ区切り)</label>
          <input type="text" className="form-control" name="useLangs" value={formData.useLangs.join(", ")} onChange={handleChange} />

          <label className="form-label">対応可能な課題範囲 (開始)</label>
          <input type="number" className="form-control" name="availableStartCode" value={formData.availableStartCode || ""} onChange={handleChange} />

          <label className="form-label">対応可能な課題範囲 (終了)</label>
          <input type="number" className="form-control" name="availableEndCode" value={formData.availableEndCode || ""} onChange={handleChange} />
        </>
      )}

      <button className="btn btn-primary mt-3" onClick={handleSubmit}>登録</button>
    </div>
  );
};
