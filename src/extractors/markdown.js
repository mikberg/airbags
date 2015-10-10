import marked from 'marked';
import {loadFront} from 'yaml-front-matter';
import omit from 'lodash.omit';

/**
 * Markdown extractor with support for meta data
 *
 * Takes a string of markdown, possibly with YAML front matter, and outputs a
 * describing object containting meta data and content in HTML format.
 */
export default function markdownExtractor(markdown) {
  if (!(typeof markdown === 'string')) {
    throw new Error('Needs a content string input');
  }

  const parsed = loadFront(markdown);

  return {
    html: marked(parsed.__content),
    meta: omit(parsed, (value, key) => key === '__content'),
  };
}
