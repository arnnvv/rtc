import { useEffect, useRef } from "react";

export const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket: WebSocket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    const ps = new RTCPeerConnection();
    //getting offer from sender via server
    socket.onmessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "create-offer") {
        //creating answer
        ps.setRemoteDescription(message.sdp);

        const answer = await ps.createAnswer();
        await ps.setLocalDescription(answer);
        //sending answer back to sender via signaling server
        socket?.send(JSON.stringify({ type: "create-answer", sdp: answer }));

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
        ps.ontrack = (event) => {
          console.log(event);
          if (videoRef.current) {
            videoRef.current.srcObject = new MediaStream([event.track]);
          }
        };
      } else if (message.type === "ice-candidate") {
        ps.addIceCandidate(message.candidate);
      }
    };
  }, []);

  return (
    <div>
      receiver
      <video ref={videoRef}></video>
    </div>
  );
};
