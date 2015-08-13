import React from 'react';
import {bindActionCreators} from 'redux';
import { Connector } from 'redux/react';
import * as ApiActions from '../actions/ApiActions';

export default class Page extends React.Component {
  render() {
    return (
      <Connector>
        {({contents, dispatch}) => {
          <div {...bindActionCreators(ApiActions, dispatch)}>{contents}</div>
        }}
      </Connector>
    );
  }
}

Page.propTypes = {
  path: React.PropTypes.string
};

Page.contextTypes = {
  airbagsApi: React.PropTypes.object
};
