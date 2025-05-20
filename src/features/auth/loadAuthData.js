export default function loadAuthData() {
  try {
    const storedData = localStorage.getItem("auth");
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("auth localStorage parse error", error);
    return null;
  }
}

// {
//     "status": true,
//     "message": "登入成功",
//     "data": {
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZkYjE2ZWU4LWI5NGMtNDQyNy1hYTUxLWEwM2EyOTBiNzhmOCIsInJvbGUiOiJhOWU5ZmM4YS01NjdiLTQ1ZmMtOGQxMC0yNmE1NWQwZTQ4YzkiLCJpYXQiOjE3NDY4MTA5ODMsImV4cCI6MTc0OTQwMjk4M30.4N00GmzTNJO0ZIau1FIfJ9zjboZ9bJvDkoYdOjEL3EE",
//         "user": {
//             "name": "教練測試管理員"
//         }
//     }
// }
