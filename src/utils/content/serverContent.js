import fs from 'fs';
import path from 'path';
import yamlFront from 'yaml-front-matter';

function getContentFile(filePath) {
  return fs.readFileSync(filePath, {encoding: 'utf-8'});
}

function relativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

function contentUrlFromPath(filePath) {
  return '/' + relativePath(filePath);
}

function urlFromPath(filePath) {
  return contentUrlFromPath(filePath).replace(/\.[^/.]+$/, '.html');
}

export function getContentFileContents(filePath) {
  return yamlFront.loadFront(getContentFile(filePath)).__content;
}

// @NOTE Fetching front matter should only be done in build process, as we dont
// want to use yaml parsing on the client side
export function manifestFragmentFromFile(file, enc, cb) {
  let frontMatter = yamlFront.loadFront(file.contents);
  delete frontMatter.__content;

  let contentManifest = {
    path: relativePath(file.path),
    url: urlFromPath(file.path),
    contentUrl: contentUrlFromPath(file.path),
    frontMatter
  };

  cb(null, contentManifest);
}
