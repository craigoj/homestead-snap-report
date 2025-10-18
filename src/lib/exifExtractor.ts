import { parse } from 'exifr';

export interface EXIFData {
  photoTakenAt: string | null;
  gpsCoordinates: { latitude: number; longitude: number } | null;
  cameraMake: string | null;
  cameraModel: string | null;
  originalFilename: string;
  exifData: Record<string, any> | null;
}

export async function extractEXIFData(file: File): Promise<EXIFData> {
  try {
    const exif = await parse(file, {
      gps: true,
      tiff: true,
    });

    const photoTakenAt = exif?.DateTimeOriginal 
      ? new Date(exif.DateTimeOriginal).toISOString() 
      : null;

    let gpsCoordinates = null;
    if (exif?.latitude && exif?.longitude) {
      gpsCoordinates = {
        latitude: exif.latitude,
        longitude: exif.longitude,
      };
    }

    return {
      photoTakenAt,
      gpsCoordinates,
      cameraMake: exif?.Make || null,
      cameraModel: exif?.Model || null,
      originalFilename: file.name,
      exifData: exif || null,
    };
  } catch (error) {
    console.error('EXIF extraction error:', error);
    return {
      photoTakenAt: null,
      gpsCoordinates: null,
      cameraMake: null,
      cameraModel: null,
      originalFilename: file.name,
      exifData: null,
    };
  }
}

export async function generatePhotoHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
