import { useRef, useState } from "react";
import { Button } from "./Button";
import CrossIcon from "./CrossIcon";
import Input from "./InputBox";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface CreateContentModal {
  open: boolean;
  onClose: () => void;
}
type ContentType = "Youtube" | "Twitter";

//controlled component
const CreateContentModal = ({ open, onClose }: CreateContentModal) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>("Youtube");

  async function handleAddContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    await axios.post(`${BACKEND_URL}/api/v1/content`,{
      link,
      title,
      type
    },
  {
    headers:{
      "Authorization":`Bearer ${localStorage.getItem("token")}`
    }
  })

  onClose()
  }

  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-800/90 fixed top-0 left-0 flex justify-center ">
          <div className="flex flex-col justify-center ">
            <div className="bg-white opacity-100 p-4 rounded min-h-80 min-w-80">
              <div className="flex justify-end">
                <div onClick={onClose}>
                  <CrossIcon />
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Input ref={titleRef} placeholder={"Title"} />
                <Input ref={linkRef} placeholder={"Link"} />
              </div>
              <div className="pt-2">
                <h1>Type</h1>
                <div className="flex justify-center gap-2 p-4">
                  <Button
                    text="Youtube"
                    variant={
                      type === "Youtube" ? "primary" : "secondary"
                    }
                    size="md"
                    onClick={() => setType("Youtube")}
                  />
                  <Button
                    text="Twitter"
                    variant={
                      type === "Twitter" ? "primary" : "secondary"
                    }
                    size="md"
                    onClick={() => setType("Twitter")}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddContent}
                  text="Add brain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContentModal;
