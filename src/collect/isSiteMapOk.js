/**
 * Verifies a sitemap is plausible
 */
export default function isSiteMapOk(siteMap) {
  if (typeof siteMap !== 'object') {
    return false;
  }

  return Object.keys(siteMap).every((nakedPath) => {
    return nakedPath === siteMap[nakedPath].nakedPath
      && !!siteMap[nakedPath].originalPath
      && !!siteMap[nakedPath].data;
  });
}
