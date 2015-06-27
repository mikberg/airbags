import path from 'path';

export function locationFromPath(filePath) {
  return '/' +
    path.relative(process.cwd(), filePath).replace(/\.[^/.]+$/, '');
}

export function fileManifestFromFile(file, enc, cb) {
  let fileManifest = {
    path: locationFromPath(file.path)
  };

  cb(null, fileManifest);
}
