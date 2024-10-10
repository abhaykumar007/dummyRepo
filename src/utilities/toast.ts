import toast from "react-hot-toast";

export function createToast(type: "success" | "error", message: string) {
  toast[type](message);
}

export function successToast(message: string) {
  createToast("success", message);
}

export function errorToast(message: string) {
  createToast("error", message);
}
