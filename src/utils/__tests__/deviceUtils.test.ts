import { Platform } from 'react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { DeviceUtils } from '../deviceUtils';

describe('DeviceUtils', () => {
  describe('isLIDARSupported', () => {
    it('should return false for non-iOS platforms', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('android');
      expect(DeviceUtils.isLIDARSupported()).toBe(false);
    });

    it('should return false for iOS versions below 14', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
      jest.spyOn(Platform, 'Version', 'get').mockReturnValue('13.0');
      expect(DeviceUtils.isLIDARSupported()).toBe(false);
    });

    it('should return true for iOS 14 and above', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
      jest.spyOn(Platform, 'Version', 'get').mockReturnValue('14.0');
      expect(DeviceUtils.isLIDARSupported()).toBe(true);
    });
  });

  describe('isIRCameraSupported', () => {
    it('should return false for non-iOS platforms', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('android');
      expect(DeviceUtils.isIRCameraSupported()).toBe(false);
    });

    it('should return true for iOS devices', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
      expect(DeviceUtils.isIRCameraSupported()).toBe(true);
    });
  });

  describe('getDeviceCapabilities', () => {
    it('should return correct capabilities for iOS device with LIDAR', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
      jest.spyOn(Platform, 'Version', 'get').mockReturnValue('14.0');
      
      const capabilities = DeviceUtils.getDeviceCapabilities();
      expect(capabilities).toEqual({
        hasLIDAR: true,
        hasIRCamera: true,
        platform: 'ios',
        version: '14.0'
      });
    });

    it('should return correct capabilities for Android device', () => {
      jest.spyOn(Platform, 'OS', 'get').mockReturnValue('android');
      jest.spyOn(Platform, 'Version', 'get').mockReturnValue('11.0');
      
      const capabilities = DeviceUtils.getDeviceCapabilities();
      expect(capabilities).toEqual({
        hasLIDAR: false,
        hasIRCamera: false,
        platform: 'android',
        version: '11.0'
      });
    });
  });

  describe('checkPermissions', () => {
    it('should return all permissions as granted when all are available', async () => {
      const mockCheckPermission = jest.fn().mockResolvedValue('granted');
      jest.spyOn(DeviceUtils, 'checkPermission').mockImplementation(mockCheckPermission);

      const permissions = await DeviceUtils.checkPermissions();
      expect(permissions).toEqual({
        camera: 'granted',
        location: 'granted',
        notifications: 'granted'
      });
    });

    it('should return denied permissions when some are not available', async () => {
      const mockCheckPermission = jest.fn()
        .mockResolvedValueOnce('granted')
        .mockResolvedValueOnce('denied')
        .mockResolvedValueOnce('granted');
      jest.spyOn(DeviceUtils, 'checkPermission').mockImplementation(mockCheckPermission);

      const permissions = await DeviceUtils.checkPermissions();
      expect(permissions).toEqual({
        camera: 'granted',
        location: 'denied',
        notifications: 'granted'
      });
    });
  });
}); 