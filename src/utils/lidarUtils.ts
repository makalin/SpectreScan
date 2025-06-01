import { Platform } from 'react-native';
import { Point } from './imageProcessing';

export interface LIDARFrame {
  width: number;
  height: number;
  data: Float32Array;
  timestamp: number;
}

export interface Point3D extends Point {
  z: number;
}

export class LIDARUtils {
  private static readonly DISTANCE_THRESHOLD = 0.5; // meters
  private static readonly CLUSTER_THRESHOLD = 0.1; // meters
  private static readonly MIN_CLUSTER_SIZE = 5;

  public static isLIDARSupported(): boolean {
    if (Platform.OS !== 'ios') {
      return false;
    }
    const version = parseFloat(Platform.Version.toString());
    return version >= 14.0;
  }

  public static async processPointCloud(frame: LIDARFrame): Promise<Point[]> {
    const points: Point3D[] = this.convertFrameToPoints(frame);
    const clusters = this.clusterPoints(points);
    return this.filterAnomalies(clusters);
  }

  private static convertFrameToPoints(frame: LIDARFrame): Point3D[] {
    const points: Point3D[] = [];
    const { width, height, data } = frame;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 3;
        const z = data[index + 2];

        if (z > 0) {
          points.push({
            x,
            y,
            z
          });
        }
      }
    }

    return points;
  }

  private static clusterPoints(points: Point3D[]): Point3D[][] {
    const clusters: Point3D[][] = [];
    const visited = new Set<number>();

    for (let i = 0; i < points.length; i++) {
      if (visited.has(i)) continue;

      const cluster: Point3D[] = [points[i]];
      visited.add(i);

      for (let j = i + 1; j < points.length; j++) {
        if (visited.has(j)) continue;

        const distance = this.calculateDistance(points[i], points[j]);
        if (distance < this.CLUSTER_THRESHOLD) {
          cluster.push(points[j]);
          visited.add(j);
        }
      }

      if (cluster.length >= this.MIN_CLUSTER_SIZE) {
        clusters.push(cluster);
      }
    }

    return clusters;
  }

  private static filterAnomalies(clusters: Point3D[][]): Point[] {
    const anomalies: Point[] = [];

    clusters.forEach(cluster => {
      const center = this.calculateClusterCenter(cluster);
      const variance = this.calculateClusterVariance(cluster, center);

      if (variance > this.DISTANCE_THRESHOLD) {
        anomalies.push({ x: center.x, y: center.y });
      }
    });

    return anomalies;
  }

  private static calculateDistance(p1: Point3D, p2: Point3D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private static calculateClusterCenter(cluster: Point3D[]): Point3D {
    const sum = cluster.reduce(
      (acc, point) => ({
        x: acc.x + point.x,
        y: acc.y + point.y,
        z: acc.z + point.z
      }),
      { x: 0, y: 0, z: 0 }
    );

    return {
      x: sum.x / cluster.length,
      y: sum.y / cluster.length,
      z: sum.z / cluster.length
    };
  }

  private static calculateClusterVariance(cluster: Point3D[], center: Point3D): number {
    const squaredDistances = cluster.map(point => {
      const distance = this.calculateDistance(point, center);
      return distance * distance;
    });

    return squaredDistances.reduce((sum, squared) => sum + squared, 0) / cluster.length;
  }
} 