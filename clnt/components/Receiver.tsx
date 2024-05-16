import { useEffect } from "react";

export const Receiver = () => {
  useEffect(() => {
    const socket: WebSocket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    const video = document.createElement("video");
    document.body.appendChild(video);

    const ps = new RTCPeerConnection();

    ps.ontrack = (event) => {
      console.log(event);
      video.srcObject = new MediaStream([event.track]);
      video.play();
    };

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
      } else if (message.type === "ice-candidate") {
        ps.addIceCandidate(message.candidate);
      }
    };
  }, []);

  return <div>Receiving</div>;
};
