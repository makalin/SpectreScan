import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { IRDetectionService } from '../IRDetectionService';
import { Camera } from 'react-native-vision-camera';

describe('IRDetectionService', () => {
  let service: IRDetectionService;
  let mockCamera: jest.Mocked<Camera>;

  beforeEach(() => {
    service = IRDetectionService.getInstance();
    mockCamera = new Camera() as jest.Mocked<Camera>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be a singleton', () => {
    const instance1 = IRDetectionService.getInstance();
    const instance2 = IRDetectionService.getInstance();
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
      type: 'ir_reflection',
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
}); 