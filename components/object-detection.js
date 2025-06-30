"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDload } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

let detectInterval;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocoSSDload();
    setIsLoading(false);
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );
      //console.log(detectedObjects);
      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }

  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  useEffect(() => {
    runCoco();
    showmyVideo();
  }, []);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="gradient-title">Loading AI Modal...</div>
      ) : (
        <div className="relative flex justify-center items-center p-1.5 rounded-md bg-gradient-to-b from-white via-gray-300 to-gray-600">
          {/*webcam */}
          <Webcam
            ref={webcamRef}
            className="lg:h-[720px] rounded-md w-full"
            muted
          />
          {/*canvas*/}
          <canvas
            ref={canvasRef}
            className="lg:h-[720px] w-full absolute top-0 left-0 z-99999"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
