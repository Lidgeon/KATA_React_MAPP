import { Component } from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import './Footer.css'

export default class Footer extends Component {
  render() {
    const { notFoundStatus, loadingStatus, errorStatus, currentPage, onChangePage, totalPage } = this.props
    //console.log('Всего страниц ' + totalPage)

    const numPages = totalPage * 10

    const pagination =
      !notFoundStatus && !loadingStatus && !errorStatus ? (
        <Pagination
          align="center"
          defaultCurrent={1}
          current={currentPage}
          total={numPages}
          onChange={onChangePage}
          showSizeChanger={false}
        />
      ) : null

    return <div className="pagination">{pagination}</div>
  }
}

Footer.propTypes = {
  notFoundStatus: PropTypes.bool,
  loadingStatus: PropTypes.bool,
  errorStatus: PropTypes.bool,
  totalPage: PropTypes.number,
  currentPage: PropTypes.number,
  onChangePage: PropTypes.func.isRequired,
}
