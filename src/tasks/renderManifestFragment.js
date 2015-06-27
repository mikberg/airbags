import through from 'through2';
import {renderComponentWithProps} from '../utils/taskUtils';

export default function renderManifestFragment(component, propsFromFragment) {
  return through.obj((file, enc, cb) => {
    let frag = JSON.parse(file.contents.toString());
    let props = propsFromFragment(frag);

    console.log(props);
    let rendered = renderComponentWithProps(component, props);

    file.contents = new Buffer(rendered, enc);

    cb(null, file);
  });
}
