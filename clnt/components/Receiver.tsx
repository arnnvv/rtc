import { useEffect } from "react";

export const Receiver = () => {
  useEffect(() => {
    const socket: WebSocket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    //getting offer from sender via server
    socket.onmessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "create-offer") {
        //creating answer
        const ps = new RTCPeerConnection();
        ps.setRemoteDescription(message.sdp);
        const answer = await ps.createAnswer();
        await ps.setLocalDescription(answer);
        //sending answer back to sender via signaling server
        socket?.send(JSON.stringify({ type: "create-answer", sdp: answer }));
      }
    };
  }, []);

  return <div>receiver</div>;
};
