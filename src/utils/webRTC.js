/** initialize Web RTC */
const servers = {
  iceServers: [
    {
      // urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
      url: 'turn:numb.viagenie.ca',
      credential: '123321',
      username: 'ardan@mailinator.com'
    },
  ],
  iceCandidatePoolSize: 10,
};

export const pc = new RTCPeerConnection(servers);
