import fs from 'fs';
import path from 'path';

const packageJsonPath = path.resolve(__dirname, '../../../package.json');
const versionFilePath = path.resolve(__dirname, '../config/version.ts');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

fs.writeFileSync(versionFilePath, `export const version = '${version}';\n`);

console.log(`✔ Version ${version} written em version.ts`);
