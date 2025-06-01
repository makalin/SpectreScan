import { Platform } from 'react-native';

export interface DeviceCapabilities {
  hasLIDAR: boolean;
  hasIRCamera: boolean;
  platform: string;
  version: string;
}

export interface PermissionStatus {
  camera: 'granted' | 'denied' | 'undetermined';
  location: 'granted' | 'denied' | 'undetermined';
  notifications: 'granted' | 'denied' | 'undetermined';
}

export class DeviceUtils {
  static isIOS(): boolean {
    return Platform.OS === 'ios';
  }

  static isAndroid(): boolean {
    return Platform.OS === 'android';
  }

  static async checkCameraPermission(): Promise<boolean> {
    // TODO: Implement actual permission check
    return true;
  }

  static async requestCameraPermission(): Promise<boolean> {
    // TODO: Implement actual permission request
    return true;
  }

  static hasLIDAR(): boolean {
    // TODO: Implement actual LIDAR hardware check
    // This should check if the device has LIDAR capabilities
    return false;
  }

  static getDeviceInfo(): {
    platform: string;
    version: string;
    hasLIDAR: boolean;
  } {
    return {
      platform: Platform.OS,
      version: Platform.Version.toString(),
      hasLIDAR: this.hasLIDAR(),
    };
  }

  public static isLIDARSupported(): boolean {
    if (Platform.OS !== 'ios') {
      return false;
    }
    const version = parseFloat(Platform.Version.toString());
    return version >= 14.0;
  }

  public static isIRCameraSupported(): boolean {
    return Platform.OS === 'ios';
  }

  public static getDeviceCapabilities(): DeviceCapabilities {
    return {
      hasLIDAR: this.isLIDARSupported(),
      hasIRCamera: this.isIRCameraSupported(),
      platform: Platform.OS,
      version: Platform.Version.toString()
    };
  }

  public static async checkPermissions(): Promise<PermissionStatus> {
    const [camera, location, notifications] = await Promise.all([
      this.checkPermission('camera'),
      this.checkPermission('location'),
      this.checkPermission('notifications')
    ]);

    return {
      camera,
      location,
      notifications
    };
  }

  private static async checkPermission(
    permission: 'camera' | 'location' | 'notifications'
  ): Promise<'granted' | 'denied' | 'undetermined'> {
    // In a real implementation, this would use the appropriate permission API
    // For now, we'll mock it to always return 'granted'
    return 'granted';
  }
} 