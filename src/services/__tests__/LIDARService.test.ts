import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { LIDARService } from '../LIDARService';
import { Camera } from 'react-native-vision-camera';

describe('LIDARService', () => {
  let service: LIDARService;
  let mockCamera: jest.Mocked<Camera>;

  beforeEach(() => {
    service = LIDARService.getInstance();
    mockCamera = new Camera() as jest.Mocked<Camera>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be a singleton', () => {
    const instance1 = LIDARService.getInstance();
    const instance2 = LIDARService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should start scanning when not already active', async () => {
    mockCamera.isActive.mockReturnValue(false);
    await service.startScanning(mockCamera);
    expect(mockCamera.start).toHaveBeenCalled();
  });

  it('should not start scanning when already active', async () => {
    mockCamera.isActive.mockReturnValue(true);
    await service.startScanning(mockCamera);
    expect(mockCamera.start).not.toHaveBeenCalled();
  });

  it('should stop scanning', async () => {
    await service.stopScanning();
    expect(mockCamera.stop).toHaveBeenCalled();
  });

  it('should handle errors during scanning', async () => {
    mockCamera.start.mockRejectedValue(new Error('Camera error'));
    await expect(service.startScanning(mockCamera)).rejects.toThrow('Camera error');
  });

  it('should emit detection events', async () => {
    const mockCallback = jest.fn();
    service.onDetection(mockCallback);

    // Simulate a detection
    const mockDetection = {
      type: 'lidar_anomaly',
      points: [{ x: 100, y: 100 }],
      confidence: 0.8
    };

    await service.processFrame(new ImageData(200, 200));
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should remove detection listeners', () => {
    const mockCallback = jest.fn();
    service.onDetection(mockCallback);
    service.offDetection(mockCallback);

    // Simulate a detection
    service.processFrame(new ImageData(200, 200));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should process point cloud data', async () => {
    const mockPointCloud = {
      points: [
        { x: 0, y: 0, z: 0, confidence: 0.8 },
        { x: 0.1, y: 0.1, z: 0.1, confidence: 0.9 },
        { x: 1, y: 1, z: 1, confidence: 0.3 }
      ],
      timestamp: Date.now(),
      resolution: { width: 256, height: 192 }
    };

    const result = await service.processPointCloud(mockPointCloud);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThan(mockPointCloud.points.length);
  });
}); 