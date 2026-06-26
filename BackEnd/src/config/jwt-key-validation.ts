import * as fs from 'fs';

/**
 * Validates that JWT keypair files exist and are readable at startup.
 * Throws a descriptive error if any file is missing or unreadable.
 */
export function validateJwtKeyFiles(
  privateKeyPath: string,
  publicKeyPath: string,
): void {
  for (const [label, filePath] of [
    ['JWT private key', privateKeyPath],
    ['JWT public key', publicKeyPath],
  ] as const) {
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `[jwt-keys] ${label} file not found at: ${filePath}`,
      );
    }
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch {
      throw new Error(
        `[jwt-keys] ${label} file is not readable at: ${filePath}`,
      );
    }
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    if (!content) {
      throw new Error(`[jwt-keys] ${label} file is empty at: ${filePath}`);
    }
  }
}
