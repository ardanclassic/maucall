import React, { useRef, useState } from "react";
import { firestore } from "../../utils/firebase";
import { useLocation, useHistory } from "react-router-dom";
import { pc } from "../../utils/webRTC";
import "./style.scss"

const Videos = ({ mode, callID, setPage }) => {
  let history = useHistory();
  const location = useLocation();
  // console.log(location, window.location)

  const [webcamActive, setWebcamActive] = useState(false);
  const [roomID, setRoomID] = useState("");

  useEffect(() => {
    const joinID = new URLSearchParams(location.search).get('id');
    if (joinID) callID = joinID;
    setRoomID(callID)
  }, [roomID])

  const localRef = useRef();
  const remoteRef = useRef();

  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    if (mode === "create") {
      const callDoc = firestore.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      setRoomID(callDoc.id);

      pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } else if (mode === "join") {
      const callDoc = firestore.collection("calls").doc(callID);
      const answerCandidates = callDoc.collection("answerCandidates");
      const offerCandidates = callDoc.collection("offerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();
      if (callData) {
        const offerDescription = callData.offer;
        await pc.setRemoteDescription(
          new RTCSessionDescription(offerDescription)
        );
  
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);
  
        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };
  
        await callDoc.update({ answer });
        offerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              let data = change.doc.data();
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });  
      } else {
        hangUp();
      }

    }

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        hangUp();
      }
    };
  };

  const hangUp = async () => {
    pc.close();

    if (roomID) {
      let roomRef = firestore.collection("calls").doc(roomID);
      await roomRef
        .collection("answerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });

      await roomRef
        .collection("offerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });

      await roomRef.delete();
    }

    /** set page back to home */
    window.location.href = "/";
  };

  const backHome = () => {
    setPage("home")
    history.push("/");
  }

  const handleCopyID = () => {
    const url = window.location;
    const linkURL = `${url.host}${url.pathname}?id=${roomID}`;
    navigator.clipboard.writeText(linkURL);
  }
  
  

  return (
    <div className="videos">
      <video ref={localRef} autoPlay playsInline className={ `local ${webcamActive? "active" : ""}` } muted />
      <video ref={remoteRef} autoPlay playsInline className="remote" />

      <div className="buttons-area">
        <button onClick={hangUp} disabled={!webcamActive} className="btn btn-hangup">
          <i className="fas fa-phone-slash"></i>
        </button>

        <button onClick={() => handleCopyID()} className="btn btn-more">
          <i className="far fa-copy"></i>
        </button>
      </div>

      { !webcamActive && (
        <div className="modalContainer">
          <div className="modal">
            <h3>Turn on your camera and microphone</h3>
            <div className="container">
              <button onClick={() => backHome()} className="secondary">
                Cancel
              </button>
              <button onClick={setupSources}>Okay!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
