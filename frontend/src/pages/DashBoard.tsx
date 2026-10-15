import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Card from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import Sidebar from "../components/Sidebar";
import useContent from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

function DashBoard() {
  const [modalOpen, setModelOpen] = useState(false);
  const { contents, refresh } = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen, refresh]);

  return (
    <div>
      <Sidebar />
      <div className="p-5 pr-10 pl-15 ml-64 min-h-screen bg-gray-200 ">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModelOpen(false);
          }}
        />
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              setModelOpen(true);
            }}
            startIcon={<PlusIcon size="md" />}
            variant="primary"
            size="sm"
            text="Add content"
          />
          <Button
            startIcon={<ShareIcon size="md" />}
            variant="secondary"
            size="sm"
            text="Share Brain"
            onClick={async () => {
              const response = await axios.put(
                `${BACKEND_URL}/api/v1/brain/share`,
                {
                  share: true,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );
              const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
              await navigator.clipboard.writeText(shareUrl);
              alert(shareUrl);
            }}
          />
        </div>
        <div className="flex flex-wrap items-start gap-4 p-4 pl-16">
          {contents.map(({ _id, type, link, title }) => (
            <Card key={_id} type={type} title={title} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
