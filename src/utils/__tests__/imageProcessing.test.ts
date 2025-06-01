import { describe, it, expect } from '@jest/globals';
import { ImageProcessor, Point, DetectionResult } from '../imageProcessing';

describe('ImageProcessor', () => {
  const mockImageData = new ImageData(100, 100);
  const mockPoint: Point = { x: 50, y: 50 };
  const mockDetectionResult: DetectionResult = {
    type: 'ir',
    points: [mockPoint],
    confidence: 0.8
  };

  describe('processFrame', () => {
    it('should return an array of detection results', async () => {
      const results = await ImageProcessor.processFrame(mockImageData);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should detect IR reflections', async () => {
      const results = await ImageProcessor.processFrame(mockImageData);
      const irResults = results.filter(result => result.type === 'ir');
      expect(irResults.length).toBeGreaterThan(0);
    });

    it('should detect LIDAR anomalies', async () => {
      const results = await ImageProcessor.processFrame(mockImageData);
      const lidarResults = results.filter(result => result.type === 'lidar');
      expect(lidarResults.length).toBeGreaterThan(0);
    });
  });

  describe('detectIRReflections', () => {
    it('should return an array of points', () => {
      const points = ImageProcessor.detectIRReflections(mockImageData);
      expect(Array.isArray(points)).toBe(true);
      points.forEach(point => {
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });
    });

    it('should detect points within image bounds', () => {
      const points = ImageProcessor.detectIRReflections(mockImageData);
      points.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThan(mockImageData.width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThan(mockImageData.height);
      });
    });
  });

  describe('analyzeLIDARData', () => {
    it('should return an array of points', () => {
      const points = ImageProcessor.analyzeLIDARData(mockImageData);
      expect(Array.isArray(points)).toBe(true);
      points.forEach(point => {
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });
    });

    it('should detect points within image bounds', () => {
      const points = ImageProcessor.analyzeLIDARData(mockImageData);
      points.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThan(mockImageData.width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThan(mockImageData.height);
      });
    });
  });

  describe('calculateConfidence', () => {
    it('should return a number between 0 and 1', () => {
      const confidence = ImageProcessor.calculateConfidence(mockDetectionResult);
      expect(typeof confidence).toBe('number');
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });

    it('should return higher confidence for more points', () => {
      const singlePointResult: DetectionResult = {
        type: 'ir',
        points: [mockPoint],
        confidence: 0.5
      };
      const multiplePointsResult: DetectionResult = {
        type: 'ir',
        points: [mockPoint, { x: 51, y: 51 }, { x: 52, y: 52 }],
        confidence: 0.5
      };

      const singleConfidence = ImageProcessor.calculateConfidence(singlePointResult);
      const multipleConfidence = ImageProcessor.calculateConfidence(multiplePointsResult);

      expect(multipleConfidence).toBeGreaterThan(singleConfidence);
    });
  });
}); 