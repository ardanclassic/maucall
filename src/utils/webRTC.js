/** initialize Web RTC */
const servers = {
  iceServers: [
    {
      // urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
  ],
  iceCandidatePoolSize: 10,
};

export const pc = new RTCPeerConnection(servers);
