export interface Point {
  x: number;
  y: number;
}

export interface ImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface DetectionResult {
  type: 'ir_reflection' | 'lidar_anomaly';
  x: number;
  y: number;
  confidence: number;
  metadata?: {
    size?: number;
    intensity?: number;
  };
}

export class ImageProcessor {
  private static readonly IR_THRESHOLD = 200;
  private static readonly LIDAR_THRESHOLD = 0.5;
  private static readonly MIN_POINTS = 3;
  private static readonly MIN_REFLECTION_SIZE = 5;
  private static readonly MAX_REFLECTION_SIZE = 50;

  public static async processFrame(frame: ImageData): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];
    
    // Convert to grayscale if needed
    const grayscale = await this.toGrayscale(frame);
    
    // Detect bright spots (potential IR reflections)
    const brightSpots = await this.detectBrightSpots(grayscale);
    
    // Filter and process bright spots
    for (const spot of brightSpots) {
      if (this.isValidReflection(spot)) {
        results.push({
          type: 'ir_reflection',
          x: spot.x,
          y: spot.y,
          confidence: this.calculateConfidence(spot),
          metadata: {
            size: spot.size,
            intensity: spot.intensity,
          },
        });
      }
    }
    
    return results;
  }

  private static async toGrayscale(image: ImageData): Promise<ImageData> {
    // Implementation would use native modules for performance
    return image;
  }

  private static async detectBrightSpots(image: ImageData): Promise<Array<{
    x: number;
    y: number;
    size: number;
    intensity: number;
  }>> {
    const spots: Array<{
      x: number;
      y: number;
      size: number;
      intensity: number;
    }> = [];

    // Implementation would use native modules for performance
    // This is a placeholder for the actual implementation
    
    return spots;
  }

  private static isValidReflection(spot: {
    size: number;
    intensity: number;
  }): boolean {
    return (
      spot.size >= this.MIN_REFLECTION_SIZE &&
      spot.size <= this.MAX_REFLECTION_SIZE &&
      spot.intensity >= this.IR_THRESHOLD
    );
  }

  private static calculateConfidence(spot: {
    size: number;
    intensity: number;
  }): number {
    // Calculate confidence based on size and intensity
    const sizeConfidence = Math.min(
      1,
      spot.size / this.MAX_REFLECTION_SIZE
    );
    const intensityConfidence = Math.min(
      1,
      (spot.intensity - this.IR_THRESHOLD) / (255 - this.IR_THRESHOLD)
    );
    
    return (sizeConfidence + intensityConfidence) / 2;
  }

  public static detectIRReflections(imageData: ImageData): Point[] {
    const points: Point[] = [];
    const data = imageData.data;

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const index = (y * imageData.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        // Check if pixel is bright enough to be an IR reflection
        if (r > this.IR_THRESHOLD && g > this.IR_THRESHOLD && b > this.IR_THRESHOLD) {
          points.push({ x, y });
        }
      }
    }

    return this.filterClusters(points);
  }

  public static analyzeLIDARData(imageData: ImageData): Point[] {
    const points: Point[] = [];
    const data = imageData.data;

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const index = (y * imageData.width + x) * 4;
        const depth = data[index + 3] / 255; // Assuming depth is stored in alpha channel

        // Check if depth value indicates an anomaly
        if (depth > this.LIDAR_THRESHOLD) {
          points.push({ x, y });
        }
      }
    }

    return this.filterClusters(points);
  }

  private static filterClusters(points: Point[]): Point[] {
    if (points.length < this.MIN_POINTS) {
      return [];
    }

    const clusters: Point[][] = [];
    const visited = new Set<number>();

    for (let i = 0; i < points.length; i++) {
      if (visited.has(i)) continue;

      const cluster: Point[] = [points[i]];
      visited.add(i);

      for (let j = i + 1; j < points.length; j++) {
        if (visited.has(j)) continue;

        const distance = this.calculateDistance(points[i], points[j]);
        if (distance <= 5) { // 5 pixels threshold for clustering
          cluster.push(points[j]);
          visited.add(j);
        }
      }

      if (cluster.length >= this.MIN_POINTS) {
        clusters.push(cluster);
      }
    }

    return clusters.flat();
  }

  private static calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
} 