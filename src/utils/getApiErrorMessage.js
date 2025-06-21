// 傳入收到 error、自定義預設錯誤訊息
export function getApiErrorMessage(error, fallbackMessage = "發生錯誤，請稍後再試") {
  const data = error?.data; // 遠端傳回的錯誤訊息
  if (!data) return fallbackMessage;

  // 多種錯誤的情況
  if (typeof data.message === "object" && data.message !== null) {
    // 將物件的 value (錯誤訊息) 轉成陣列，並用分號隔開
    const messages = Object.values(data.message);
    if (messages.length > 0) return messages.join("；");
  }

  // 一條錯誤訊息的狀況
  if (typeof data.message === "string") return data.message;

  // 其他狀況
  return fallbackMessage;
}
