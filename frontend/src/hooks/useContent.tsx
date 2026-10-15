import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

const useContent = () => {
  const [contents, setContents] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/content`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setContents(response.data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      refresh();
    }, 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  },[refresh]);

  return { contents, refresh };
};

export default useContent;
