const urlConfig = {
  isDevelopment: false, // Toggle this to `false` for production

  urls: {
    development: {
      apiBaseUrl: "http://localhost:8000", // Development API Base URL
      webSocketUrl: "wss://spardhaai-q2ee809e.livekit.cloud", // Development WebSocket URL
    },

    production: {
      apiBaseUrl: "https://spardhaaicore-450748006246.asia-south1.run.app", // Production API Base URL
      webSocketUrl: "wss://spardhaai-q2ee809e.livekit.cloud", // Production WebSocket URL
    },
  },

  // Getter for API Base URL
  get apiBaseUrl() {
    return this.isDevelopment
      ? this.urls.development.apiBaseUrl
      : this.urls.production.apiBaseUrl;
  },

  // Getter for WebSocket URL
  get webSocketUrl() {
    return this.isDevelopment
      ? this.urls.development.webSocketUrl
      : this.urls.production.webSocketUrl;
  },

  // Toggle the environment between development and production
  toggleEnvironment(isDev) {
    this.isDevelopment = isDev;
  },
};

export default urlConfig;
