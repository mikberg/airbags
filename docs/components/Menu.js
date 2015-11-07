import React from 'react';
import {Link} from 'react-router';

if (process.env.__BROWSER__) {
  require('../styles/Menu.scss');
}

export default class Menu extends React.Component {
  static propTypes = {
    menu: React.PropTypes.array.isRequired,
  }

  render() {
    return (
      <ul className="Menu">
        {this.props.menu.map((item) => {
          const title = Object.keys(item)[0];
          return (
            <li key={item[title]}>
              <Link to={'/' + item[title] + '.html'}>{title}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
}
