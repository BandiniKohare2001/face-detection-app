import React from 'react';
import './App.css';
import FaceDetection from "././components/FaceDetection/FaceDetection";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Face Detect App</h1>
      </header> */}
      <main>
        <FaceDetection />
      </main>
    </div>
  );
}

export default App;

















// import React, { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';
// import "./FaceDetection.css"

// const FaceDetection = () => {
//   const videoRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   let detectFacesInterval;

//   useEffect(() => {
//     const loadModelsAndStartDetection = async () => {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//         faceapi.nets.faceExpressionNet.loadFromUri('/models')
//       ]);

//       if (navigator.mediaDevices.getUserMedia) {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
//           videoRef.current.srcObject = stream;

//           // Wait for the video to finish loading
//           videoRef.current.onloadedmetadata = () => {
//             setIsLoading(false);
//           };
//         } catch (error) {
//           console.error('Error accessing media devices:', error);
//           setIsLoading(true);
//         }
//       } else {
//         console.error('getUserMedia not supported');
//         setIsLoading(true);
//       }
//     };

//     loadModelsAndStartDetection();

//     return () => {
//       clearInterval(detectFacesInterval);
//     };
//   }, []);

//   useEffect(() => {
//     const detectFaces = async () => {
//       const video = videoRef.current;
//       if (!video || isLoading) return;

//       const canvas = faceapi.createCanvasFromMedia(video);
//       document.body.append(canvas);

//       const displaySize = { width: video.width, height: video.height };
//       faceapi.matchDimensions(canvas, displaySize);

//       detectFacesInterval = setInterval(async () => {
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//       }, 100);
//     };

//     detectFaces();

//     return () => {
//       clearInterval(detectFacesInterval);
//     };
//   }, [isLoading]);

//   return (
//     <div className='div'>
//       {/* {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <video ref={videoRef} autoPlay muted width="720" height="560" />
//       )} */}
//        <video ref={videoRef} autoPlay muted width="720" height="560" />
//     </div>
//   );
// };

// export default FaceDetection;






// import React, { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';

// const FaceDetection = () => {
//   const videoRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isMatch, setIsMatch] = useState(false);
//   const savedImage = useRef(null);
//   let detectFacesInterval;

//   useEffect(() => {
//     const loadModelsAndStartDetection = async () => {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//         faceapi.nets.faceExpressionNet.loadFromUri('/models')
//       ]);

//       if (navigator.mediaDevices.getUserMedia) {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
//           videoRef.current.srcObject = stream;

//           // Wait for the video to finish loading
//           videoRef.current.onloadedmetadata = () => {
//             setIsLoading(false);
//           };
//         } catch (error) {
//           console.error('Error accessing media devices:', error);
//           setIsLoading(true);
//         }
//       } else {
//         console.error('getUserMedia not supported');
//         setIsLoading(true);
//       }
//     };

//     loadModelsAndStartDetection();

//     return () => {
//       clearInterval(detectFacesInterval);
//     };
//   }, []);

//   useEffect(() => {
//     const detectFaces = async () => {
//       const video = videoRef.current;
//       if (!video || isLoading) return;

//       const canvas = faceapi.createCanvasFromMedia(video);
//       document.body.append(canvas);

//       const displaySize = { width: video.width, height: video.height };
//       faceapi.matchDimensions(canvas, displaySize);

//       detectFacesInterval = setInterval(async () => {
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

//         // Compare current frame with saved image
//         if (savedImage.current) {
//           const savedDescriptor = await faceapi.computeFaceDescriptor(savedImage.current);
//           resizedDetections.forEach(async detection => {
//             const descriptor = await faceapi.computeFaceDescriptor(video, detection);
//             const distance = faceapi.euclideanDistance(savedDescriptor, descriptor);
//             if (distance < 0.6) {
//               setIsMatch(true);
//             } else {
//               setIsMatch(false);
//             }
//           });
//         }
//       }, 100);
//     };

//     detectFaces();

//     return () => {
//       clearInterval(detectFacesInterval);
//     };
//   }, [isLoading]);

//   const handleSaveImage = async (file) => {
//     const img = await faceapi.bufferToImage(file);
//     const canvas = faceapi.createCanvasFromMedia(img);
//     const ctx = canvas.getContext('2d');
//     canvas.width = img.width;
//     canvas.height = img.height;
//     ctx.drawImage(img, 0, 0);
//     savedImage.current = canvas;
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       handleSaveImage(file);
//     }
//   };

//   return (
//     <div>
    
//         <video ref={videoRef} autoPlay muted width="720" height="560" />
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         {isMatch ? (<p>Image Successfully Match</p>) : (<p>Image Not Match</p>) }
//     </div>
//   );
// };

// export default FaceDetection;


