export class Comparator {
  /**
   * Compare actual output with expected output.
   * Handles whitespace normalization and common formatting differences.
   */
  static compare(actual: string, expected: string): boolean {
    // Exact match
    if (actual === expected) return true;

    // Normalized comparison (trim + normalize whitespace)
    const normalizedActual = this.normalize(actual);
    const normalizedExpected = this.normalize(expected);

    return normalizedActual === normalizedExpected;
  }

  /**
   * Normalize output for comparison:
   * - Trim leading/trailing whitespace
   * - Normalize line endings
   * - Remove trailing newlines
   */
  private static normalize(s: string): string {
    return s
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim()
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
  }

  /**
   * Check if output matches with floating point tolerance.
   */
  static compareFloat(actual: string, expected: string, tolerance = 1e-6): boolean {
    const actualNum = parseFloat(actual);
    const expectedNum = parseFloat(expected);

    if (isNaN(actualNum) || isNaN(expectedNum)) {
      return this.compare(actual, expected);
    }

    return Math.abs(actualNum - expectedNum) <= tolerance;
  }
}
