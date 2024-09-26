import { Component } from 'react'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'

import './Header.css'

export default class Header extends Component {
  render() {
    const { onChangeTab } = this.props
    const items = [
      { key: 1, label: 'Search' },
      { key: 2, label: 'Rated' },
    ]

    return (
      <div className="tab">
        <Tabs
          onChange={onChangeTab}
          defaultActiveKey="1"
          items={items}
          tabBarStyle={{ fontFamily: 'Inter, sans-serif', margin: '0 auto 20px' }}
          tabBarGutter={16}
        />
      </div>
    )
  }
}

Header.propTypes = {
  onChangeTab: PropTypes.func.isRequired,
}
