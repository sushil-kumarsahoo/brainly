import axios from "axios";
import { Button } from "../components/Button";
import Input from "../components/InputBox";
import { useRef } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
    
  async function handleSignin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
      username,
      password,
    });
    const jwt = response.data.token;
    localStorage.setItem("token", jwt);
    navigate("/dashboard")
  }
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center ">
      <div className="bg-white border-none min-w-48 p-7 rounded-xl">
        <div className="flex flex-col gap-4">
          <Input ref={usernameRef} placeholder="Username" />
          <Input ref={passwordRef} placeholder="Password" />
        </div>
        <div className="flex justify-center pt-4 ">
          <Button
            onClick={handleSignin}
            variant="primary"
            text="Signin"
            size="md"
            fullWidth={true}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
