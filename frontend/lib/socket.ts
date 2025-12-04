import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token?: string) {
  if (typeof window === "undefined") return null;

  // Reuse existing socket if already created
  if (socket && socket.connected) return socket;

  const BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");

  socket = io(BASE, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  socket.on("connect_error", (err: any) => {
    console.error("Socket connect error", err);
  });

  socket.on("connect", () => {
    console.log("Socket connected", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected", reason);
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
