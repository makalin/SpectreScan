import { Camera } from 'react-native-vision-camera';
import { ImageProcessor, DetectionResult } from '../utils/imageProcessing';
import { LIDARUtils, LIDARFrame, Point3D } from '../utils/lidarUtils';

export interface DetectionCallback {
  (detection: DetectionResult): void;
}

export class LIDARService {
  private static instance: LIDARService;
  private camera: Camera | null = null;
  private isScanning: boolean = false;
  private detectionCallbacks: DetectionCallback[] = [];

  private constructor() {}

  public static getInstance(): LIDARService {
    if (!LIDARService.instance) {
      LIDARService.instance = new LIDARService();
    }
    return LIDARService.instance;
  }

  public async startScanning(camera: Camera): Promise<void> {
    if (this.isScanning) {
      return;
    }

    this.camera = camera;
    this.isScanning = true;

    try {
      await this.camera.start();
      this.startFrameProcessing();
    } catch (error) {
      this.isScanning = false;
      this.camera = null;
      throw error;
    }
  }

  public async stopScanning(): Promise<void> {
    if (!this.isScanning || !this.camera) {
      return;
    }

    try {
      await this.camera.stop();
    } finally {
      this.isScanning = false;
      this.camera = null;
    }
  }

  public onDetection(callback: DetectionCallback): void {
    this.detectionCallbacks.push(callback);
  }

  public offDetection(callback: DetectionCallback): void {
    const index = this.detectionCallbacks.indexOf(callback);
    if (index !== -1) {
      this.detectionCallbacks.splice(index, 1);
    }
  }

  private async startFrameProcessing(): Promise<void> {
    if (!this.isScanning || !this.camera) {
      return;
    }

    try {
      const frame = await this.camera.getCurrentFrame();
      if (frame) {
        await this.processFrame(frame);
      }
    } catch (error) {
      console.error('Error processing frame:', error);
    }

    // Schedule next frame processing
    if (this.isScanning) {
      requestAnimationFrame(() => this.startFrameProcessing());
    }
  }

  private async processFrame(frame: ImageData): Promise<void> {
    const detections = await ImageProcessor.processFrame(frame);
    const lidarDetections = detections.filter(d => d.type === 'lidar_anomaly');

    lidarDetections.forEach(detection => {
      this.detectionCallbacks.forEach(callback => {
        callback(detection);
      });
    });
  }

  public async processPointCloud(frame: LIDARFrame): Promise<Point[]> {
    return LIDARUtils.processPointCloud(frame);
  }

  isActive(): boolean {
    return this.isScanning;
  }

  isAvailable(): boolean {
    return LIDARUtils.isLIDARSupported();
  }

  getDeviceCapabilities(): {
    hasLIDAR: boolean;
    maxDepth: number;
    minDepth: number;
    resolution: {
      width: number;
      height: number;
    };
  } {
    return {
      hasLIDAR: this.isAvailable(),
      maxDepth: 5.0, // 5 meters
      minDepth: 0.1, // 10 centimeters
      resolution: {
        width: 256,
        height: 192,
      },
    };
  }
} 