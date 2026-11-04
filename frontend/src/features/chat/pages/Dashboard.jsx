import { useEffect } from "react";
import { useChat } from "../hooks/useChat";
import ChatLayout from "../components/ChatLayout.jsx";

const Dashboard = () => {
  const { initializeSocketConnection, handleGetChats } = useChat();

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
  }, []);

  return <ChatLayout />;
};

export default Dashboard;
