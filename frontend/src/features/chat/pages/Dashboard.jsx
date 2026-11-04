import { useEffect } from "react";
import { useChat } from "../hooks/useChat";
import ChatLayout from "../components/ChatLayout.jsx";

const Dashboard = () => {
  const { handleGetChats } = useChat();

  useEffect(() => {
    handleGetChats();
  }, []);

  return <ChatLayout />;
};

export default Dashboard;
