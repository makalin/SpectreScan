// Mock react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  Camera: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    isActive: jest.fn().mockReturnValue(false)
  })),
  useCameraDevices: jest.fn().mockReturnValue({
    back: {
      id: 'back',
      name: 'Back Camera',
      hasFlash: true,
      hasTorch: true,
      supportsLowLightBoost: true,
      supportsFocus: true,
      supportsVideoStabilization: true,
      supportsVideoHDR: true,
      supportsPhotoHDR: true,
      supportsDepthCapture: true,
      minZoom: 1,
      maxZoom: 10,
      supportsRawCapture: true,
      supportsFocus: true,
      supportsVideoStabilization: true,
      supportsVideoHDR: true,
      supportsPhotoHDR: true,
      supportsDepthCapture: true,
      minZoom: 1,
      maxZoom: 10,
      supportsRawCapture: true
    }
  })
}));

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Platform = {
    OS: 'ios',
    Version: '14.0',
    select: jest.fn(obj => obj.ios)
  };
  RN.useColorScheme = jest.fn().mockReturnValue('dark');
  return RN;
});

// Mock console.error to suppress error messages during tests
console.error = jest.fn();

// Mock ImageData
global.ImageData = class ImageData {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
}; 