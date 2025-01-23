import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { createLocalVideoTrack, LocalVideoTrack } from "livekit-client";
import {
  AudioSelectButton,
  ControlButton,
  VideoRenderer,
  VideoSelectButton,
} from "livekit-react";
import React, { ReactElement, useEffect, useState } from "react";
import { AspectRatio } from "react-aspect-ratio";
import { useNavigate, useLocation } from "react-router-dom";
import urlConfig from "./config/url-config";
import { log } from "console";

// Fetch environment variables for WebSocket and HTTPS URL
const wsUrl = urlConfig.webSocketUrl;
const apiBaseUrl = urlConfig.apiBaseUrl;

const generateRandomRoomName = () => {
  return `single-${Math.floor(10000000 + Math.random() * 90000000)}`;
};

export const PreJoinPage = () => {
  const [type, setType] = useState("single");
  const [title, setTitle] = useState("Spardha_ai.to");
  const [url, setUrl] = useState(wsUrl);
  const [usecase_id, setUsecase_id] = useState("");
  const [name, setName] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [simulcast, setSimulcast] = useState(true);
  const [dynacast, setDynacast] = useState(true);
  const [adaptiveStream, setAdaptiveStream] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connectDisabled, setConnectDisabled] = useState(true);
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [audioDevice, setAudioDevice] = useState<MediaDeviceInfo>();
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo>();
  const [lang, setlang] = useState("en");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse the query parameters from the URL
    const params = new URLSearchParams(location.search);
    const usecaseId = params.get("usecase_id");

    // Log the usecase_id
    if (usecaseId) {
      setUsecase_id(usecaseId);
      console.log("this is usecase_id :", usecaseId);
    } else {
      console.log("No usecase_id found in the URL");
    }
  }, [location.search]); // Runs when the search query in the URL changes

  useEffect(() => {
    if (url && name && (roomName || type === "single")) {
      setConnectDisabled(false);
    } else {
      setConnectDisabled(true);
    }
  }, [url, name, roomName, type]);

  const toggleVideo = async () => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoEnabled(false);
      setVideoTrack(undefined);
    } else {
      const track = await createLocalVideoTrack({
        deviceId: videoDevice?.deviceId,
      });
      setVideoEnabled(true);
      setVideoTrack(track);
    }
  };

  useEffect(() => {
    createLocalVideoTrack({
      deviceId: videoDevice?.deviceId,
    }).then((track) => {
      setVideoEnabled(true);
      setVideoTrack(track);
    });
  }, [videoDevice]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const selectVideoDevice = (device: MediaDeviceInfo) => {
    setVideoDevice(device);
    if (videoTrack) {
      if (
        videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId
      ) {
        return;
      }
      videoTrack.stop();
    }
  };

  const connectToRoom = async () => {
    var room = roomName;
    if (type === "single") {
      console.log("Generating random room name");
      room = generateRandomRoomName();
    }

    console.log("Connecting to room " + room);
    if (videoTrack) {
      videoTrack.stop();
    }

    if (
      window.location.protocol === "https:" &&
      url.startsWith("ws://") &&
      !url.startsWith("ws://localhost")
    ) {
      alert("Unable to connect to insecure websocket from https");
      return;
    }

    const bodyPayload = {
      userName: name, // Use the `name` variable for the user name
      room_name: room, // Optional, can be omitted if you don't want to provide a room name
      usecase_id: usecase_id,
      lang: lang,
    };

    // Log the body payload
    console.log("Request Body:", bodyPayload);

    const tokenResponse = await fetch(`${apiBaseUrl}/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload), // Stringify the payload
    });

    if (tokenResponse.status === 403) {
      alert("Incorrect secret key. Please try again");
      return;
    }

    const tokenData = await tokenResponse.json();
    console.log("this is the token recieved :", tokenData.access_token);

    const params: { [key: string]: string } = {
      url,
      token: tokenData.access_token,
      videoEnabled: videoEnabled ? "1" : "0",
      audioEnabled: audioEnabled ? "1" : "0",
      simulcast: simulcast ? "1" : "0",
      dynacast: dynacast ? "1" : "0",
      adaptiveStream: adaptiveStream ? "1" : "0",
      type: type ? type : "dexter",
    };

    if (audioDevice) {
      params.audioDeviceId = audioDevice.deviceId;
    }
    if (videoDevice) {
      params.videoDeviceId = videoDevice.deviceId;
    } else if (videoTrack) {
      const deviceId = await videoTrack.getDeviceId();
      if (deviceId) {
        params.videoDeviceId = deviceId;
      }
    }

    navigate({
      pathname: "/room",
      search: "?" + new URLSearchParams(params).toString(),
    });
  };

  let videoElement: ReactElement;
  if (videoTrack) {
    videoElement = <VideoRenderer track={videoTrack} isLocal={true} />;
  } else {
    videoElement = <div className="placeholder" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen align-middle">
      <main className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {title}
        </h2>
        <hr className="border-t border-gray-300 mb-6" />

        {/* Entry Section */}
        <div className="entrySection mb-6">
          <div className="input-container space-y-4">
            <div className="input-group">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {type !== "single" && (
              <div className="input-group">
                <label className="block text-gray-700 font-medium mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  name="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Video Section */}
        <div className="videoSection mb-6 relative">
          <AspectRatio
            ratio={16 / 9}
            className="bg-black rounded-lg overflow-hidden shadow-lg"
          >
            {videoElement}
          </AspectRatio>
        </div>

        {/* Control Section */}
        <div className="flex items-center justify-between px-8">
          <div className="flex space-x-4">
            <AudioSelectButton
              isMuted={!audioEnabled}
              onClick={toggleAudio}
              onSourceSelected={setAudioDevice}
              className="p-3 border rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <VideoSelectButton
              isEnabled={videoTrack !== undefined}
              onClick={toggleVideo}
              onSourceSelected={selectVideoDevice}
              className="p-3 border rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ControlButton
            label="Connect"
            disabled={connectDisabled}
            onClick={connectToRoom}
            className={`p-4 text-white rounded-lg ${
              connectDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          />
        </div>
      </main>
    </div>
  );
};
