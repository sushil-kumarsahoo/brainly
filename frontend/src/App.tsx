import { useState } from "react";
import { Button } from "./components/Button";
import Card from "./components/Card";
import CreateContentModal from "./components/CreateContentModal";
import PlusIcon from "./icons/PlusIcon";
import ShareIcon from "./icons/ShareIcon";

function App() {
  const [modalOpen, setModelOpen] = useState(true);

  return (
    <div className="p-4">
      <CreateContentModal open={modalOpen} onClose={()=>{setModelOpen(false)}}/>
     <div className="flex justify-end gap-4">
       <Button
        onClick={()=>{setModelOpen(true)}}
        startIcon={<PlusIcon size="md" />}
        variant="primary"
        size="sm"
        text="Add content"
      />
      <Button
        startIcon={<ShareIcon size="md"/>}
        variant="secondary"
        size="sm"
        text="Share Brain"
        onClick={() =>{}}
      />
     </div>
      <div className="pl-2 flex gap-2">
         <Card title="twitter" link="https://x.com/Priyanshu__2109/status/2110232425330839710?s=20" type="twitter"/>

       <Card title="youtube" link="https://youtu.be/BhaHEnpNujI" type="youtube"/>
      </div>
    </div>
  );
}

export default App;
