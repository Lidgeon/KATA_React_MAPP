import { Component } from 'react'
import { Alert, Spin } from 'antd'
import PropTypes from 'prop-types'

import { GCConsumer } from '../GenresContext/GenresContext'
import Wrapper from '../Wrapper/Wrapper'
import Movie from '../Movie/Movie'

import './MovieList.css'

export default class MovieList extends Component {
  componentDidUpdate(prevP) {
    if (prevP.rateMovieData !== this.props.rateMovieData) {
      sessionStorage.setItem('rateMovieData', JSON.stringify(this.props.rateMovieData))
    }
  }

  render() {
    const {
      movies,
      loadingStatus,
      errorStatus,
      notFoundStatus,
      addRateMovie,
      rateMovieData,
      //tabKey,
      guestId,
      postMovieRating,
    } = this.props

    const movieEl = (movies) => {
      return (
        <GCConsumer>
          {(genres) => {
            return movies?.map((el) => {
              let rating
              rateMovieData.map((item) => {
                if (item.id === el.id) {
                  rating = item.value
                }
              })
              return (
                <Wrapper key={el.id}>
                  <Movie
                    el={el}
                    genres={genres}
                    addRateMovie={addRateMovie}
                    rating={rating}
                    guestId={guestId}
                    postMovieRating={postMovieRating}
                  />
                </Wrapper>
              )
            })
          }}
        </GCConsumer>
      )
    }

    const movieHasData = !(loadingStatus || errorStatus)

    const error =
      errorStatus && !loadingStatus ? (
        <Alert
          message="Пу-пу-пу..."
          description="Что-то пошло не так. Возможно, нам нужно покормить наших рабочих драконов"
          type="error"
          showIcon
        />
      ) : null

    const spin = loadingStatus && !errorStatus ? <Spin className="movie-list__spin" size="large" /> : null

    const content = movieHasData ? movieEl(movies) : null

    const notFound = notFoundStatus ? (
      <Alert
        message="Ну, как бы это самое..."
        description="Наши рабочие драконы ничего не нашли..."
        type="warning"
        showIcon
      />
    ) : null

    return (
      <div className="movie-list__position">
        {notFound}
        {error}
        {spin}
        {content}
      </div>
    )
  }
}

MovieList.propTypes = {
  addRateMovie: PropTypes.func.isRequired,
  notFoundStatus: PropTypes.bool,
  loadingStatus: PropTypes.bool,
  errorStatus: PropTypes.bool,
}
