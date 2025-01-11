const config = {
  appId: "346d6a683961487977393532306e334655775573506131504d4c6c716e374d77",
  appSecret:
    "764d314869376947356d55792d58306a45657a5038496d736a5745366e564f347353752d69646434384165454347506f35736d50486b357041413836546b3337",
  generateTokenEndpoint: "https://api.symbl.ai/oauth2/token:generate",
  wssBasePath: "wss://api.symbl.ai",
  apiBasePath: "https://api.symbl.ai",
  bufferSize: 8192,
  retryCount: 3,
  insightTypes: ["action_item", "question", "follow_up"],
  confidenceThreshold: 0.5,
  timezoneOffset: 480,
  languageCode: "en-US",
  realtimeSentimentAnalysis: true,
  realtimeAnalyticsMetric: true,
  customVocabulary: ["Symbl", "Symbl.ai"],
  trackers: [
    {
      name: "Promotion Mention",
      vocabulary: [
        "We have a special promotion going on if you book this before",
        "I can offer you a discount of 10 20 percent you being a new customer for us",
        "We have our month special",
        "We have a sale right now",
      ],
    },
    {
      name: "Trackers Demo",
      vocabulary: [
        "Trackers is a great feature",
        "Imagine a way to customize what is being tracked for your own business",
        "Trackers allow you to look for a particular mention",
      ],
    },
  ],
};

module.exports = config;
