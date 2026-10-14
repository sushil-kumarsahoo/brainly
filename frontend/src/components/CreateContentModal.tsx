import { Button } from "./Button";
import CrossIcon from "./CrossIcon";

interface CreateContentModal {
  open: boolean;
  onClose: () => void;
}

//controlled component
const CreateContentModal = ({ open, onClose }: CreateContentModal) => {
  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-600 fixed top-0 left-0 opacity-70 flex justify-center">
          <div className="flex flex-col justify-center ">
            <span className="bg-white opacity-100 p-4 rounded">
              <div className="flex justify-end">
                <div onClick={onClose}>
                  <CrossIcon />
                </div>
              </div>
              <div>
                <Input onChange={() => {}} placeholder={"Title"} />
                <Input onChange={() => {}} placeholder={"Link"} />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {}}
                  text="Add brain"
                />
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export default CreateContentModal;

const Input = ({ onChange, placeholder }: InputProps) => {
  return (
    <div>
      <input
        placeholder={placeholder}
        type="text"
        className="px-4 py-2 border rounded m-2"
        onChange={onChange}
      />
    </div>
  );
};
