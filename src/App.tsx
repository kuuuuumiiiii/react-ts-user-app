import { useState } from "react";

import { USER_LIST } from "./data/users";
import { UserTable } from "./components/UserTable";
import { User } from "./types/User";
import { UserForm } from "./components/UserForm";


const App = () => {
  const [displayUsers, setDisplayUsers] = useState<User[]>(USER_LIST);
  const [filter, setFilter] = useState<"all" | "students" | "mentors">("all");
  const [sortKey, setSortKey] = useState<"studyMinutes" | "score" | "experienceDays" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ユーザー追加処理
  const handleAddUser = (newUser: User) => {
    setDisplayUsers([...displayUsers, newUser]);
  };


  // 🔹 フィルタに応じたユーザー取得
  const filteredUsers = displayUsers.filter((user) => {
    if (filter === "students") return user.role === "student";
    if (filter === "mentors") return user.role === "mentor";
    return true;
  });

  // 🔹 ソート処理
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortKey) return 0; // ソートキーがない場合はそのまま
    
    // 生徒 (student) とメンター (mentor) で異なるプロパティを適切に処理
    const getSortableValue = (user: User): number => {
      if (sortKey === "studyMinutes" && user.role === "student") {
        return user.studyMinutes;
      }
      if (sortKey === "score" && user.role === "student") {
        return user.score;
      }
      if (sortKey === "experienceDays" && user.role === "mentor") {
        return user.experienceDays;
      }
      return 0; // 該当しない場合はデフォルト値
    };
  
    const aValue = getSortableValue(a);
    const bValue = getSortableValue(b);
  
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="container mt-4">
      <h1>ユーザー管理アプリ</h1>


      {/* 🔹 新規ユーザー登録フォーム */}
      <UserForm onAddUser={handleAddUser} />

      {/* 🔹 フィルタのボタン */}
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => setFilter("all")}>全員</button>
        <button className="btn btn-success me-2" onClick={() => setFilter("students")}>生徒のみ</button>
        <button className="btn btn-warning" onClick={() => setFilter("mentors")}>メンターのみ</button>
      </div>

      {/* 🔹 ソートのボタン */}
      {filter === "students" && (
        <div className="mb-3">
          <button className="btn btn-info me-2" onClick={() => { setSortKey("studyMinutes"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
            勉強時間 {sortKey === "studyMinutes" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
          </button>
          <button className="btn btn-info" onClick={() => { setSortKey("score"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
            ハピネススコア {sortKey === "score" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
          </button>
        </div>
      )}

      {filter === "mentors" && (
        <div className="mb-3">
          <button className="btn btn-info" onClick={() => { setSortKey("experienceDays"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
            実務経験月数 {sortKey === "experienceDays" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
          </button>
        </div>
      )}
      <UserTable users={sortedUsers} allUsers={displayUsers} />
    </div>
  );
};

export default App;