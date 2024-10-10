import { Modal as AntdModal } from "antd";
import { ModalProps } from "antd/es/modal";

const Modal = (props: ModalProps) => {
  return <AntdModal {...props} />;
};

export default Modal;