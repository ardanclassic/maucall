/** initialize Web RTC */
const servers = {
  iceServers: [
    {
      // urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
      url: 'turn:relay.backups.cz?transport=tcp',
      credential: 'webrtc',
      username: 'webrtc'
    },
  ],
  iceCandidatePoolSize: 10,
};

export const pc = new RTCPeerConnection(servers);
