import { Platform } from 'react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { LIDARUtils, Point3D, LIDARFrame } from '../lidarUtils';

describe('LIDARUtils', () => {
  describe('isLIDARSupported', () => {
    it('should return false for non-iOS platforms', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('android');
      expect(LIDARUtils.isLIDARSupported()).toBe(false);
    });

    it('should return false for iOS versions below 14', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
      jest.spyOn(Platform, 'Version', 'get').mockReturnValue('13.0');
      expect(LIDARUtils.isLIDARSupported()).toBe(false);
    });

    it('should return true for iOS 14 and above', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
      jest.spyOn(Platform, 'Version', 'get').mockReturnValue('14.0');
      expect(LIDARUtils.isLIDARSupported()).toBe(true);
    });
  });

  describe('processPointCloud', () => {
    const mockFrame: LIDARFrame = {
      points: [
        { x: 0, y: 0, z: 0, confidence: 0.8 },
        { x: 0.1, y: 0.1, z: 0.1, confidence: 0.9 },
        { x: 1, y: 1, z: 1, confidence: 0.3 }, // Low confidence point
      ],
      timestamp: Date.now(),
      resolution: { width: 256, height: 192 },
    };

    it('should filter out low confidence points', async () => {
      const result = await LIDARUtils.processPointCloud(mockFrame);
      expect(result.length).toBeLessThan(mockFrame.points.length);
    });

    it('should return an array of points', async () => {
      const result = await LIDARUtils.processPointCloud(mockFrame);
      expect(Array.isArray(result)).toBe(true);
      result.forEach(point => {
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
        expect(point).toHaveProperty('z');
      });
    });
  });

  describe('clusterPoints', () => {
    const mockPoints: Point3D[] = [
      { x: 0, y: 0, z: 0 },
      { x: 0.05, y: 0.05, z: 0.05 },
      { x: 1, y: 1, z: 1 },
      { x: 1.05, y: 1.05, z: 1.05 },
    ];

    it('should group nearby points into clusters', () => {
      const clusters = LIDARUtils['clusterPoints'](mockPoints);
      expect(clusters.length).toBe(2); // Should form 2 clusters
    });

    it('should not include isolated points', () => {
      const isolatedPoint: Point3D = { x: 10, y: 10, z: 10 };
      const points = [...mockPoints, isolatedPoint];
      const clusters = LIDARUtils['clusterPoints'](points);
      expect(clusters.length).toBe(2); // Isolated point should not form a cluster
    });
  });

  describe('calculateDistance', () => {
    it('should calculate correct distance between points', () => {
      const p1: Point3D = { x: 0, y: 0, z: 0 };
      const p2: Point3D = { x: 3, y: 4, z: 0 };
      const distance = LIDARUtils['calculateDistance'](p1, p2);
      expect(distance).toBe(5); // 3-4-5 triangle
    });
  });

  describe('analyzeClusters', () => {
    const mockClusters: Point3D[][] = [
      [
        { x: 0, y: 0, z: 0 },
        { x: 0.1, y: 0.1, z: 0.1 },
        { x: 0.2, y: 0.2, z: 0.2 },
      ],
      [
        { x: 1, y: 1, z: 1 },
        { x: 1.1, y: 1.1, z: 1.1 },
        { x: 1.2, y: 1.2, z: 1.2 },
      ],
    ];

    it('should return an array of anomaly points', () => {
      const anomalies = LIDARUtils['analyzeClusters'](mockClusters);
      expect(Array.isArray(anomalies)).toBe(true);
    });

    it('should filter out non-anomaly clusters', () => {
      const flatCluster: Point3D[][] = [
        [
          { x: 0, y: 0, z: 0 },
          { x: 0.1, y: 0.1, z: 0 },
          { x: 0.2, y: 0.2, z: 0 },
        ],
      ];
      const anomalies = LIDARUtils['analyzeClusters'](flatCluster);
      expect(anomalies.length).toBe(0); // Flat cluster should not be detected as anomaly
    });
  });
}); 