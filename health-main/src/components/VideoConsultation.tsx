import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import type { Instance as SimplePeerInstance } from 'simple-peer';
import SimplePeer from 'simple-peer';

// Use relative URL to work with Vite's proxy
const SOCKET_URL = '/';

type RTCSdpType = 'offer' | 'answer' | 'pranswer' | 'rollback';

interface SignalData {
  type: RTCSdpType;
  sdp?: string;
  candidate?: RTCIceCandidateInit;
  renegotiate?: boolean;
  transceiverRequest?: {
    kind: string;
    init?: RTCRtpTransceiverInit;
  };
};

interface VideoConsultationProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  consultationId: string;
  participantId: string;
  isDoctor: boolean;
}

const VideoConsultation: React.FC<VideoConsultationProps> = ({ 
  isOpen, 
  onClose, 
  patientName,
  consultationId,
  participantId,
  isDoctor
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeerInstance | null>(null);
  const roomId = consultationId;

  useEffect(() => {
    if (isOpen) {
      try {
        console.log('Attempting to connect to WebSocket server...');
        socketRef.current = io(SOCKET_URL, {
          reconnectionAttempts: 3,
          timeout: 10000,
          transports: ['websocket', 'polling'],
          withCredentials: true
        });

        socketRef.current.on('connect', () => {
          console.log('Socket connected with ID:', socketRef.current?.id);
          setError(null);
          initializeMedia();
        });

        socketRef.current.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error);
          setError(`Failed to connect to video server: ${error.message}`);
        });

        socketRef.current.on('disconnect', (reason: string) => {
          console.log('Socket disconnected:', reason);
          setError('Disconnected from video server. Attempting to reconnect...');
        });

        socketRef.current.on('user-connected', (userId: string) => {
          console.log('User connected to room:', userId);
        });
      } catch (err) {
        console.error('Socket initialization error:', err);
        setError('Failed to initialize video connection');
      }
    }
    return () => {
      cleanup();
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!socketRef.current || !localStream) return;

    socketRef.current.on('user-joined', (data: { signal: SignalData; callerID: string }) => {
      try {
        const peer = new SimplePeer({
          initiator: false,
          trickle: false,
          stream: localStream
        });

        peer.on('signal', (signalData: SignalData) => {
          socketRef.current?.emit('return-signal', { 
            signal: signalData, 
            callerID: data.callerID 
          });
        });

        peer.on('stream', (stream: MediaStream) => {
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        });

        peer.on('error', (err: Error) => {
          console.error('Peer error:', err);
          setError('Video connection error: ' + err.message);
        });

        peer.signal(data.signal);
        peerRef.current = peer;
      } catch (err) {
        console.error('Error creating peer connection:', err);
        setError('Failed to establish video connection');
      }
    });

    socketRef.current.on('receiving-returned-signal', (data: { signal: SignalData }) => {
      if (peerRef.current) {
        try {
          peerRef.current.signal(data.signal);
        } catch (err) {
          console.error('Error processing return signal:', err);
          setError('Failed to process video connection signal');
        }
      }
    });

    socketRef.current.emit('join-room', roomId, participantId);
  }, [roomId, participantId, localStream]);

  const initializeMedia = async () => {
    try {
      console.log('Requesting media permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).catch((err) => {
        console.error('Media access error:', err);
        if (err.name === 'NotAllowedError') {
          throw new Error('Please allow camera and microphone access to use video consultation');
        } else if (err.name === 'NotFoundError') {
          throw new Error('No camera or microphone found. Please connect a device and try again');
        } else {
          throw err;
        }
      });
      
      console.log('Media access granted');
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create and emit signal if we're the initiator
      if (isDoctor && socketRef.current?.connected) {
        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream: stream
        });

        peer.on('signal', (data: SignalData) => {
          console.log('Generated signal:', data);
          socketRef.current?.emit('send-signal', {
            userToSignal: participantId,
            callerID: socketRef.current.id,
            signal: data
          });
        });

        peer.on('stream', (remoteStream: MediaStream) => {
          console.log('Received remote stream');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setRemoteStream(remoteStream);
          setError(null);
        });

        peer.on('error', (err: Error) => {
          console.error('Peer error:', err);
          setError(`Video connection error: ${err.message}`);
        });

        peerRef.current = peer;
      }
    } catch (err: any) {
      console.error('Error accessing media devices:', err);
      setError(`Failed to access camera/microphone: ${err.message}`);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Consultation with {patientName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Remote Video (Patient) */}
          <div className="relative bg-gray-900 rounded-lg aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full rounded-lg"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
              {patientName} {!remoteStream && "(Connecting...)"}
            </div>
          </div>

          {/* Local Video (Doctor) */}
          <div className="relative bg-gray-900 rounded-lg aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full rounded-lg"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
              You (Doctor)
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOff ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            {isVideoOff ? (
              <VideoOff className="h-6 w-6 text-white" />
            ) : (
              <Video className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
