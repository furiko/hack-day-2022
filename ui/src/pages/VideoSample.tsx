import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { default as ml5, Pose, PosePose } from "ml5";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export const VideoSample = () => {
  const webcamRef = useRef<Webcam>(null);
  let poseNet;

  useEffect(() => {
    const modelLoaded = () => {
      if (!webcamRef.current?.video) return;
      const { width, height } = videoConstraints;
      webcamRef.current.video.width = width;
      webcamRef.current.video.height = height;
      const detectionInterval = setInterval(() => {
        return () => {
          if (detectionInterval) {
            clearInterval(detectionInterval);
          }
        };
      }, 200);
    };
    const f = async () => {
      poseNet = await ml5.poseNet(
        webcamRef.current?.video,
        "single",
        modelLoaded
      );
      poseNet.on("pose", function (poses: PosePose[]) {
        let position = findPositon(poses, videoConstraints.width);
        console.log(position);
      });
    };
    f();
  }, []);

  return (
    <>
      <header>
        <h1>カメラアプリ</h1>
      </header>
      <div>
        <Webcam
          audio={false}
          width={540}
          height={360}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </div>
    </>
  );
};
//
function findPositon(poses: PosePose[], windowWidth: number) {
  // console.log(poses);
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      const threshold = 0.4;
      let position = confirmPosition(pose, threshold, windowWidth);
      // 多分このforを全部回せば複数人対応できる
      return position;
    }
  }
}

const confirmPosition = (pose: Pose, threshold: number, width: number) => {
  // 両肩
  if (
    pose.leftShoulder.confidence > threshold &&
    pose.rightShoulder.confidence > threshold
  ) {
    let center = (pose.leftShoulder.x + pose.rightShoulder.x) / 2;
    let xPersentage = center / width;
    return xPersentage;
  }
  // 両腰
  if (
    pose.leftHip.confidence > threshold &&
    pose.rightHip.confidence > threshold
  ) {
    let center = (pose.leftHip.x + pose.rightHip.x) / 2;
    let xPersentage = center / width;
    return xPersentage;
  }
  // 両膝
  if (
    pose.leftKnee.confidence > threshold &&
    pose.rightKnee.confidence > threshold
  ) {
    let center = (pose.leftKnee.x + pose.rightKnee.x) / 2;
    let xPersentage = center / width;
    return xPersentage;
  }
  // 片肩
  if (
    pose.leftShoulder.confidence > threshold &&
    pose.rightShoulder.confidence > threshold
  ) {
    let center = null;
    if (pose.leftShoulder.confidence > pose.rightShoulder.confidence) {
      center = pose.leftShoulder.x;
    } else {
      center = pose.rightShoulder.x;
    }
    let xPersentage = center / width;
    return xPersentage;
  }
  // 片腰
  if (
    pose.leftHip.confidence > threshold &&
    pose.rightHip.confidence > threshold
  ) {
    let center = null;
    if (pose.leftHip.confidence > pose.rightHip.confidence) {
      center = pose.leftHip.x;
    } else {
      center = pose.rightHip.x;
    }
    let xPersentage = center / width;
    return xPersentage;
  }
  // 片膝
  if (
    pose.leftKnee.confidence > threshold &&
    pose.rightKnee.confidence > threshold
  ) {
    let center = null;
    if (pose.leftKnee.confidence > pose.rightKnee.confidence) {
      center = pose.leftKnee.x;
    } else {
      center = pose.rightKnee.x;
    }
    let xPersentage = center / width;
    return xPersentage;
  }
};