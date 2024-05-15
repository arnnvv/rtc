import { useEffect, useState } from "react";

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
  }, []);
  return (
    <div>
      Sender
      <button
        onClick={async () => {
          //craete an offer
          const ps = new RTCPeerConnection();
          const offer = await ps.createOffer();
          await ps.setLocalDescription(offer);
        }}
      >
        Send Video
      </button>
    </div>
  );
};
