import React, { useState, useRef } from 'react';
import axios from 'axios';

const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        chunksRef.current.push(event.data);
      });

      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        chunksRef.current = [];

        // Send the audio blob to the backend server
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        axios.post('http://localhost:3000/upload', formData)
          .then(() => {
            console.log('Audio uploaded successfully');
          })
          .catch((error) => {
            console.error('Error uploading audio:', error);
          });
      });
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      {audioURL && (
        <div>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;