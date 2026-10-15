import { useRef } from "react";
import { Button } from "../components/Button";
import Input from "../components/InputBox";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleSignup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      username,
      password,
    });
    navigate("/dashboard");
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
            onClick={handleSignup}
            variant="primary"
            text="Signup"
            size="md"
            fullWidth={true}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
