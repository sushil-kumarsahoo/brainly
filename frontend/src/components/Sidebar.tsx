
import LogoIcon from "../icons/LogoIcon";
import XIcon from "../icons/XIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <div className="h-screen bg-white shadow-[4px_0_6px_-4px_rgba(0,0,0,0.15)] w-64 left-0 top-0 pl-6 fixed">
         <div className="flex items-center gap-1.5 pt-4">
            <div className=""><LogoIcon/></div>
         <div className="text-2xl font-bold text-purple-600 ">
            Brainly
         </div>
         </div>
      <div className="pt-4">
        <SidebarItem text="Twitter" icon={< XIcon/>}/>
        <SidebarItem text="Youtube" icon={<YoutubeIcon/>}/>
      </div>
    </div>
  );
};

export default Sidebar;
