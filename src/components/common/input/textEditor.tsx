import ReactQuill from "react-quill";
import "./style.scss";
const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["direction", { align: [] }],
    ["link", "image"],
  ],
};
const TextEditor = (props: ReactQuill.ReactQuillProps) => {
  return <ReactQuill modules={modules} {...props} />;
};

export default TextEditor;
