import { useState } from "react";
import { User } from "../types/User";

type UserFormProps = {
  onAddUser: (newUser: User) => void;
};

export const UserForm: React.FC<UserFormProps> = ({ onAddUser }) => {
  const [role, setRole] = useState<"student" | "mentor">("student");

  const [formData, setFormData] = useState<Partial<User>>({
    id: Date.now(),
    name: "",
    role: "student",
    email: "",
    age: 0,
    postCode: "",
    phone: "",
    hobbies: [],
    url: "",
    taskCode: 0, // 生徒用
    studyMinutes: 0,
    studyLangs: [],
    score: 0,
    experienceDays: 0,
    useLangs: [],
    availableStartCode: 0, // メンター用
    availableEndCode: 0, // メンター用
  });

  // ロール変更時の処理
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "student" | "mentor";
    setRole(newRole);

    setFormData((prev) => ({
      ...prev,
      role: newRole,
      ...(newRole === "student"
        ? { taskCode: 0, studyMinutes: 0, studyLangs: [], score: 0, availableStartCode: undefined, availableEndCode: undefined }
        : { availableStartCode: 0, availableEndCode: 0, experienceDays: 0, useLangs: [], taskCode: undefined }),
    }));
  };

  // 入力値の変更を処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: 
          // 数値として扱う項目
          ["age", "score", "studyMinutes", "experienceDays", "availableStartCode", "availableEndCode", "taskCode"].includes(name)
            ? Number(value)
          // 配列（カンマ区切りで分割）
          : ["hobbies", "studyLangs", "useLangs"].includes(name)
            ? value.split(",").map((v) => v.trim())
          // それ以外は文字列としてセット
          : value,
      };

      console.log("更新後のフォームデータ:", updatedData);
      return updatedData;
    });
  };

  // ユーザーを追加
  const handleSubmit = () => {
    if (!formData.name || !formData.email || formData.age <= 0) {
      alert("すべての必須項目を入力してください！");
      return;
    }

    onAddUser(formData as User);

    // 入力フォームをリセット
    setFormData({
      id: Date.now(),
      name: "",
      role,
      email: "",
      age: 0,
      postCode: "",
      phone: "",
      hobbies: [],
      url: "",
      taskCode: role === "student" ? 0 : undefined, // 生徒のみ
      studyMinutes: 0,
      studyLangs: [],
      score: 0,
      experienceDays: 0,
      useLangs: [],
      availableStartCode: role === "mentor" ? 0 : undefined, // メンターのみ
      availableEndCode: role === "mentor" ? 0 : undefined, // メンターのみ
    });
  };

  return (
    <div className="mb-4 p-3 border rounded">
      <h2>新規ユーザー登録</h2>

      {/* ロール選択 */}
      <label className="form-label">ロール</label>
      <select name="role" className="form-select" value={role} onChange={handleRoleChange}>
        <option value="student">生徒</option>
        <option value="mentor">メンター</option>
      </select>

      {/* 共通の入力項目 */}
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

      {/* 生徒用の入力フォーム */}
      {role === "student" && (
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

      {/* メンター用の入力フォーム */}
      {role === "mentor" && (
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
