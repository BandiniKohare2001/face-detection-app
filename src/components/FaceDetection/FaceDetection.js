import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './FaceDetection.css';

function FaceDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        startWebcam();
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    const startWebcam = () => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    };
    const getLabeledFaceDescriptors = async () => {
      const labels = ["Anju", "Bandini"];
      const labeledFaceDescriptors = [];
    
      for (const label of labels) {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          try {
            const img = await faceapi.fetchImage(`../labels/${label}/${i}.jpg`);
            const detections = await faceapi.detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor()
              .withfaceExpressionNet();
            descriptions.push(detections.descriptor);
          } catch (error) {
            console.error(`Error fetching image for ${label} (${i}.jpg):`, error);
          }
        }
        labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptions));
      }
    
      return labeledFaceDescriptors;
    };
    
    

    videoRef.current.addEventListener('play', async () => {
      const labeledFaceDescriptors = await getLabeledFaceDescriptors();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      canvasRef.current.append(canvas);

      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        resizedDetections.forEach(detection => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() });
          drawBox.draw(canvas);
        });
      }, 100);
    });

    loadModels();
  }, []);

  return (
    <div className="container">
      <video ref={videoRef} id="video" width="600" className="current-image" height="450" autoPlay></video>
      <div className="canvass" ref={canvasRef}></div>
    </div>
  );
}

export default FaceDetection;
