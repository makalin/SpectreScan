export const CONFIG = {
  // Camera settings
  camera: {
    fps: 30,
    resolution: {
      width: 1920,
      height: 1080,
    },
    format: 'yuv',
  },

  // IR detection settings
  irDetection: {
    threshold: 200,
    minReflectionSize: 5,
    maxReflectionSize: 50,
    confidenceThreshold: 0.7,
  },

  // LIDAR settings (for Pro models)
  lidar: {
    enabled: false,
    minDepth: 0.1,
    maxDepth: 5.0,
    pointCloudDensity: 'high',
  },

  // UI settings
  ui: {
    darkMode: true,
    reflectionMarker: {
      size: 20,
      color: '#FF0000',
      opacity: 0.3,
    },
  },

  // App settings
  app: {
    name: 'SpectreScan',
    version: '1.0.0',
    buildNumber: '1',
  },
}; 