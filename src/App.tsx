import { useState } from "react";
import { USER_LIST } from "./data/users";
import { UserTable } from "./components/UserTable";
import { User } from "./types/User";
import { UserForm } from "./components/UserForm";

// 🔹 ユーザーのロール型
type UserRole = User["role"];
type FilterRole = UserRole | "all";

// 🔹 ソートキーの型エイリアス
type SortKey = "studyMinutes" | "score" | "experienceDays";

const App = () => {
  const [displayUsers, setDisplayUsers] = useState<User[]>(USER_LIST);
  const [filterRole, setFilterRole] = useState<FilterRole>("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ユーザー追加処理
  const handleAddUser = (newUser: User) => {
    setDisplayUsers([...displayUsers, newUser]);
  };

  // 🔹 フィルタ処理
  const filteredUsers = displayUsers.filter((user) => filterRole === "all" || user.role === filterRole);

  // 🔹 ソート処理の補助関数
  const getSortValue = (user: User, key: SortKey | null): number => {
    if (!key) return 0;
  
    if (user.role === "student" && (key === "studyMinutes" || key === "score")) {
      return user[key]; // student のプロパティにアクセス
    }
  
    if (user.role === "mentor" && key === "experienceDays") {
      return user[key]; // mentor のプロパティにアクセス
    }
  
    return 0; // 該当しない場合のデフォルト値
  };
  
  // 🔹 ソート処理
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortKey) return 0; // ソートキーがない場合はそのまま

    const aValue = getSortValue(a, sortKey);
    const bValue = getSortValue(b, sortKey);

    return (aValue - bValue) * (sortOrder === "asc" ? 1 : -1);
  });

  return (
    <div className="container mt-4">
      <h1>ユーザー管理アプリ</h1>

      {/* 🔹 新規ユーザー登録フォーム */}
      <UserForm onAddUser={handleAddUser} />

      {/* 🔹 フィルタのボタン */}
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => setFilterRole("all")}>全員</button>
        <button className="btn btn-success me-2" onClick={() => setFilterRole("student")}>生徒のみ</button>
        <button className="btn btn-warning" onClick={() => setFilterRole("mentor")}>メンターのみ</button>
      </div>

      {/* 🔹 ソートのボタン */}
      {filterRole === "student" && (
        <div className="mb-3">
          <button className="btn btn-info me-2" onClick={() => { setSortKey("studyMinutes"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
            勉強時間 {sortKey === "studyMinutes" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
          </button>
          <button className="btn btn-info" onClick={() => { setSortKey("score"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
            ハピネススコア {sortKey === "score" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
          </button>
        </div>
      )}

      {filterRole === "mentor" && (
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
