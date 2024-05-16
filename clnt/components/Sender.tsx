import { useEffect, useState } from "react";

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
  }, []);

  return (
    <div>
      Sender
      <button
        onClick={async () => {
          if (!socket) return;
          //craete an offer-localDes
          const ps = new RTCPeerConnection();
          const offer = await ps.createOffer();
          await ps.setLocalDescription(offer);
          //send offer via signaling srvr to receiver
          socket?.send(JSON.stringify({ type: "create-offer", sdp: offer }));

          //geting answer fron receiver
          socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "create-answer")
              ps.setRemoteDescription(data.sdp);
          };
          //connection established now we don't need Server;
        }}
      >
        Send Video
      </button>
    </div>
  );
};
