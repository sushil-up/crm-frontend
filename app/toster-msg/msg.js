import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";

export function errorMsg(message) {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
}

export function successMsg(message) {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
}
