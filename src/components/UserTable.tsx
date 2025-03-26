import { useMemo } from "react";
import { User } from "../types/User";

type Props = {
  users: User[];
  allUsers: User[]; // すべてのユーザーを参照する
};

export const UserTable: React.FC<Props> = ({ users, allUsers }) => {
  const userRowsData = useMemo(() => {
    return users.map((user) => {
      // `allUsers` を使って全ユーザーから対応可能な人を探す
      const availableMentors =
        user.role === "student"
          ? allUsers
              .filter(
                (mentor) =>
                  mentor.role === "mentor" &&
                  mentor.availableStartCode <= user.taskCode &&
                  mentor.availableEndCode >= user.taskCode
              )
              .map((mentor) => mentor.name)
          : [];

      const availableStudents =
        user.role === "mentor"
          ? allUsers
              .filter(
                (student) =>
                  student.role === "student" &&
                  user.availableStartCode <= student.taskCode &&
                  user.availableEndCode >= student.taskCode
              )
              .map((student) => student.name)
          : [];

      return {
        user,
        availableMentors,
        availableStudents
      };
    });
  }, [users, allUsers]);

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>名前</th>
          <th>ロール</th>
          <th>メールアドレス</th>
          <th>年齢</th>
          <th>郵便番号</th>
          <th>電話番号</th>
          <th>趣味</th>
          <th>URL</th>
          <th>勉強時間 / 経験月数</th>
          <th>ハピネススコア</th>
          <th>着手課題 / 担当課題</th>
          <th>学習言語/使用言語</th>
          <th>対応可能な人</th>
        </tr>
      </thead>
      <tbody>
        {userRowsData.map(({ user, availableMentors, availableStudents }) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.role === "student" ? "生徒" : "メンター"}</td>
            <td>{user.email}</td>
            <td>{user.age}</td>
            <td>{user.postCode}</td>
            <td>{user.phone}</td>
            <td>{user.hobbies.join(", ")}</td>
            <td><a href={user.url} target="_blank" rel="noopener noreferrer">Link</a></td>
            <td>
              {user.role === "student" ? `${user.studyMinutes} 分` : `${Math.floor(user.experienceDays / 30)} ヶ月`}
            </td>
            <td>{user.role === "student" ? `${user.score} 点` : "—"}</td>
            <td>
              {user.role === "student"
                ? `課題 ${user.taskCode}`
                : `課題 ${user.availableStartCode} 〜 ${user.availableEndCode}`}
            </td>
            <td>{user.role === "student" ? user.studyLangs.join(", ") : user.useLangs.join(", ")}</td>
            <td>
              {user.role === "student"
                ? availableMentors.length > 0
                  ? availableMentors.join(", ")
                  : "該当なし"
                : availableStudents.length > 0
                ? availableStudents.join(", ")
                : "該当なし"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
