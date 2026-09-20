export interface StoredSchoolCoordinates {
  lat: number | null;
  lng: number | null;
  isVerified?: boolean;
}

/**
 * Safety check for stored school coordinates.
 *
 * isVerified must be explicitly true, and the point must fall inside a broad
 * Delhi-NCR sanity envelope. The envelope is only a guard against obviously
 * incorrect locations; it does not establish independent verification and
 * never changes the stored coordinates.
 */
export function isSafeStoredSchoolCoordinate(
  coordinates?: StoredSchoolCoordinates | null
): coordinates is { lat: number; lng: number; isVerified: true } {
  if (
    coordinates?.isVerified !== true ||
    typeof coordinates.lat !== 'number' ||
    typeof coordinates.lng !== 'number' ||
    !Number.isFinite(coordinates.lat) ||
    !Number.isFinite(coordinates.lng)
  ) {
    return false;
  }

  return (
    coordinates.lat >= 27.8 &&
    coordinates.lat <= 29.2 &&
    coordinates.lng >= 76.7 &&
    coordinates.lng <= 78.3
  );
}
