import { Component } from 'react'

import './Wrapper.css'

export default class Wrapper extends Component {
  render() {
    return <div className="movie-list__card-wrapper">{this.props.children}</div>
  }
}
