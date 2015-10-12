import {isContextOk} from '../src/context';
import {Readable} from 'stream';
import File from '../node_modules/vinyl';
import jade from 'jade';

export function fileFromContext(contextFile, template) {
  if (!contextFile.nakedPath) {
    throw new Error(`fileFromContext need supplied file to have 'nakedPath'`);
  }

  if (typeof contextFile.data !== 'object') {
    throw new Error(`fileFromContext needs supplied file to have 'data'`);
  }

  const html = jade.render(template, contextFile.data);

  return new File({
    path: `${contextFile.nakedPath}.html`,
    contents: new Buffer(html),
  });
}

export default function createJadeRenderer(template) {
  if (typeof template !== 'string') {
    throw new Error(`createJadeRenderer expected a template, got ${template}`);
  }

  return (context) => {
    if (!isContextOk(context)) {
      throw new Error(`createJadeRenderer expected a context, got ${context}`);
    }

    const stream = new Readable({ objectMode: true });

    Object.keys(context.siteMap).forEach((nakedPath) => {
      const file = fileFromContext(context.siteMap[nakedPath], template);
      stream.push(file);
    });

    stream.push(null);
    return stream;
  };
}
