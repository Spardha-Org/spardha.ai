import {
  faSquare,
  faThLarge,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ParticipantEvent,
  Room,
  RoomEvent,
  VideoPresets,
} from "livekit-client";
import { DisplayContext, DisplayOptions, LiveKitRoom } from "livekit-react";
import React, { useState } from "react";
import "react-aspect-ratio/aspect-ratio.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSymbl } from "./symbl/hooks/useSymbl";
import Symbl from "./symbl/components/Symbl/Symbl";
import urlConfig from "./config/url-config";

// Fetch environment variables
const apiBaseUrl = urlConfig.apiBaseUrl;

export const RoomPage = () => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [roomID, setRoomID] = useState("");
  const [language, setLanguage] = useState("english");
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: "grid",
    showStats: false,
  });
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const url = query.get("url");
  const token = query.get("token");
  const recorder = query.get("recorder");
  const type = query.get("type");

  const [symblConfig, setSymblConfig] = useState<any>({});
  const {
    closedCaption,
    transcripts,
    insights,
    topics,
    trackers,
    messagesWithSentiment,
    analyticsMetric,
    muteSymbl,
    unmuteSymbl,
  } = useSymbl(symblConfig);

  if (!url || !token) {
    return <div>url and token are required</div>;
  }

  const onLeave = async () => {
    navigate(`/thankyou?room_id=${roomID}`);
  };

  const updateParticipantSize = (room: Room) => {
    setNumParticipants(room.participants.size + 1);
  };

  const onParticipantDisconnected = (room: Room) => {
    updateParticipantSize(room);

    /* Special rule for recorder */
    if (
      recorder &&
      parseInt(recorder, 10) === 1 &&
      room.participants.size === 0
    ) {
      console.log("END_RECORDING");
    }
  };

  const updateLanguage = async (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    await fetch(`${apiBaseUrl}/session/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_id: roomID,
        language: selectedLanguage,
      }),
    });
  };

  const updateOptions = (options: DisplayOptions) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  };

  return (
    <DisplayContext.Provider value={displayOptions}>
      <div className="roomContainer absolute inset-0 bg-gray-900 flex flex-col">
        {/* Top Bar */}
        <div className="topBar absolute top-0 left-0 right-0 z-20 bg-black bg-opacity-70 p-4 flex justify-between items-center">
          <h2 className="text-white text-3xl font-semibold">Meeting</h2>
          <div className="right flex items-center space-x-6">
            <div className="text-white">
              <select
                value={language}
                onChange={(e) => updateLanguage(e.target.value)}
                className="bg-transparent text-white p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="mandarin">Mandarin</option>
              </select>
            </div>
            <div className="text-white flex items-center">
              <input
                id="showStats"
                type="checkbox"
                onChange={(e) => updateOptions({ showStats: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="showStats" className="text-sm">
                Show Stats
              </label>
            </div>
            <div className="space-x-4">
              <button
                className={`iconButton p-2 rounded-md ${
                  displayOptions.stageLayout === "grid"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-200"
                }`}
                disabled={displayOptions.stageLayout === "grid"}
                onClick={() => {
                  updateOptions({ stageLayout: "grid" });
                }}
              >
                <FontAwesomeIcon height={32} icon={faThLarge} />
              </button>
              <button
                className={`iconButton p-2 rounded-md ${
                  displayOptions.stageLayout === "speaker"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-200"
                }`}
                disabled={displayOptions.stageLayout === "speaker"}
                onClick={() => {
                  updateOptions({ stageLayout: "speaker" });
                }}
              >
                <FontAwesomeIcon height={32} icon={faSquare} />
              </button>
            </div>
            <div className="participantCount text-white flex items-center">
              <FontAwesomeIcon icon={faUserFriends} />
              <span className="ml-2">{numParticipants}</span>
            </div>
          </div>
        </div>

        {/* Video Section (LiveKit Room) */}
        <div className="livekit-room flex-grow relative">
          <LiveKitRoom
            url={url}
            token={token}
            onConnected={(room) => {
              setRoomID(room.name);
              onConnected(room, query);
              getSymblConfig(room).then((config) => setSymblConfig(config));
              room.on(RoomEvent.ParticipantConnected, () =>
                updateParticipantSize(room)
              );
              room.on(RoomEvent.ParticipantDisconnected, () =>
                onParticipantDisconnected(room)
              );
              room.localParticipant.on(ParticipantEvent.TrackMuted, muteSymbl);
              room.localParticipant.on(
                ParticipantEvent.TrackUnmuted,
                unmuteSymbl
              );
              updateParticipantSize(room);
            }}
            connectOptions={{
              adaptiveStream: isSet(query, "adaptiveStream"),
              dynacast: isSet(query, "dynacast"),
              videoCaptureDefaults: {
                resolution: VideoPresets.hd.resolution,
              },
              publishDefaults: {
                videoEncoding: VideoPresets.hd.encoding,
                simulcast: isSet(query, "simulcast"),
              },
              logLevel: "debug",
            }}
            onLeave={onLeave}
          />
        </div>
      </div>
    </DisplayContext.Provider>
  );
};

const getSymblConfig = async (room: Room) => {
  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const participantId = room.localParticipant.identity;
  const participantName = room.localParticipant.name
    ? room.localParticipant.name
    : participantId;
  const meetingId = room.sid;
  const meetingName = room.name;
  return { meetingId, meetingName, participantId, participantName, stream };
};

async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  if (isSet(query, "audioEnabled")) {
    const audioDeviceId = query.get("audioDeviceId");
    if (audioDeviceId && room.options.audioCaptureDefaults) {
      room.options.audioCaptureDefaults.deviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
  }

  if (isSet(query, "videoEnabled")) {
    const videoDeviceId = query.get("videoDeviceId");
    if (videoDeviceId && room.options.videoCaptureDefaults) {
      room.options.videoCaptureDefaults.deviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === "1" || query.get(key) === "true";
}
