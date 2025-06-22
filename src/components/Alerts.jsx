import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const LP_Swal = withReactContent(Swal);

// 確認對話框
export const ConfirmAlert = ({
  title,
  text,
  icon = "warning",
  confirmText = "確認",
  cancelText = "取消",
}) => {
  return LP_Swal.fire({
    title: <h3 className="alert-title">{title}</h3>,
    text: text,
    icon: icon,
    showCancelButton: true,
    cancelButtonText: cancelText,
    confirmButtonText: confirmText,
    customClass: {
      popup: "alert-popup",
      cancelButton: "alert-cancel-button",
      confirmButton: "alert-confirm-button",
      icon: "alert-icon",
    },
    background: "rgba(255, 255, 255, 0.8)",
    buttonsStyling: false,
  });
};

/** @type {(title: string, text: string, icon: string, action: () => void | Promise<void>) => Promise<void>} */

// ConfirmDialogue({title: "", text: "", icon: "", action: () => {}})
// sweetAlert icon 選項："success"、"error"、"warning"、"info"、"question"
export const ConfirmDialogue = async ({ title, text, icon = "warning", action }) => {
  const result = await ConfirmAlert({ title, text, icon });
  if (result.isConfirmed) {
    try {
      await action?.();
    } catch (swal_action_error) {
      console.error({ swal_action_error });
    }
  }
};

// 成功提示框
// SuccessAlert({title: "", text: ""})
export const SuccessAlert = ({ title = "成功！", text, confirmText = "確定" }) => {
  return LP_Swal.fire({
    title: <h3 className="alert-title">{title}</h3>,
    text: text,
    icon: "success",
    confirmButtonText: confirmText,
    customClass: {
      popup: "alert-popup",
      confirmButton: "alert-success-button",
      icon: "alert-icon",
    },
    background: "rgba(255, 255, 255, 1)",
    buttonsStyling: false,
  });
};

// 資訊提示框
// InfoAlert({title: "", html: ""})
export const InfoAlert = ({ title = "提示", html, text, confirmText = "我知道了" }) => {
  return LP_Swal.fire({
    title: <h3 className="alert-title">{title}</h3>,
    timer: 3000,
    text,
    html,
    icon: "info",
    confirmButtonText: confirmText,
    customClass: {
      popup: "alert-popup",
      confirmButton: "alert-info-button",
      icon: "alert-icon",
    },
    background: "rgba(255, 255, 255, 1)",
    buttonsStyling: false,
  });
};

// 錯誤提示框
// ErrorAlert({title: "", text: ""})
export const ErrorAlert = ({ title = "錯誤！", text, confirmText = "確定" }) => {
  return LP_Swal.fire({
    title: <h3 className="alert-title">{title}</h3>,
    text: text,
    icon: "error",
    confirmButtonText: confirmText,
    customClass: {
      popup: "alert-popup",
      confirmButton: "alert-error-button",
      icon: "alert-icon",
    },
    background: "rgba(255, 255, 255, 1)",
    buttonsStyling: false,
  });
};
