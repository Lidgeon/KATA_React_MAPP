import { Component } from 'react'
import { Input } from 'antd'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'

import './Search.css'

export default class Search extends Component {
  onSearch = (e) => {
    const { searchQueryChange } = this.props
    const trimUserRequest = e.target.value.replace(/ +/g, ' ').trim()
    searchQueryChange(trimUserRequest)
  }

  render() {
    const { tabKey } = this.props

    return (
      <div className="search">
        {tabKey === 1 ? (
          <Input placeholder="Type to search..." size="large" onChange={debounce(this.onSearch, 1000)} />
        ) : null}
      </div>
    )
  }
}

Search.propTypes = {
  searchQueryChange: PropTypes.func.isRequired,
  tabKey: PropTypes.number,
}
