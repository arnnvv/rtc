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
        onClick={async (): Promise<void> => {
          if (!socket) return;
          const ps = new RTCPeerConnection();
          //craete an offer-localDes (will be needed multiple times not just once)
          ps.onnegotiationneeded = async () => {
            const offer = await ps.createOffer();
            await ps.setLocalDescription(offer);
            //send offer via signaling srvr to receiver
            socket?.send(JSON.stringify({ type: "create-offer", sdp: offer }));
          };

          ps.onicecandidate = (event) => {
            if (event.candidate) {
              socket?.send(
                JSON.stringify({
                  type: "ice-candidate",
                  candidate: event.candidate,
                }),
              );
            }
          };

          //geting answer fron receiver
          socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "create-answer")
              ps.setRemoteDescription(data.sdp);
            else if (data.type === "ice-candidate")
              ps.addIceCandidate(data.candidate);
          };
          //connection established now we don't need Server;
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          ps.addTrack(stream.getVideoTracks()[0]);
        }}
      >
        Send Video
      </button>
    </div>
  );
};
