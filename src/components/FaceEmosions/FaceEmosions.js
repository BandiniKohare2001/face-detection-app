
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
// import "./FaceDetection.css"

const FaceEmosions = () => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  let detectFacesInterval;

  useEffect(() => {
    const loadModelsAndStartDetection = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);

      if (navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
          videoRef.current.srcObject = stream;

          // Wait for the video to finish loading
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
          };
        } catch (error) {
          console.error('Error accessing media devices:', error);
          setIsLoading(true);
        }
      } else {
        console.error('getUserMedia not supported');
        setIsLoading(true);
      }
    };

    loadModelsAndStartDetection();

    return () => {
      clearInterval(detectFacesInterval);
    };
  }, []);

  useEffect(() => {
    const detectFaces = async () => {
      const video = videoRef.current;
      if (!video || isLoading) return;

      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      detectFacesInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }, 100);
    };

    detectFaces();

    return () => {
      clearInterval(detectFacesInterval);
    };
  }, [isLoading]);

  return (
    <div className='div'>
      {/* {isLoading ? (
        <p>Loading...</p>
      ) : (
        <video ref={videoRef} autoPlay muted width="720" height="560" />
      )} */}
       <video ref={videoRef} autoPlay muted width="720" height="560" />
    </div>
  );
};

export default FaceEmosions;




// / Get labeled face descriptors (replace this with your own implementation)
    // const getLabeledFaceDescriptors = async () => {
    //   const labels = ["Anju", "Bandini"];
    //   const labeledFaceDescriptors = [];
    
    //   for (const label of labels) {
    //     const descriptions = [];
    //     for (let i = 1; i <= 2; i++) {
    //       try {
    //         const img = await faceapi.fetchImage(`../labels/${label}/${i}.jpg`);
    //         const detections = await faceapi.detectSingleFace(img)
    //           .withFaceLandmarks()
    //           .withFaceDescriptor()
    //           .withfaceExpressionNet();
    //         descriptions.push(detections.descriptor);
    //       } catch (error) {
    //         console.error(`Error fetching image for ${label} (${i}.jpg):`, error);
    //       }
    //     }
    //     labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptions));
    //   }
    
    //   return labeledFaceDescriptors;
    // };