import marked from 'marked';

export default function markdown(md) {
  return marked(md);
}
