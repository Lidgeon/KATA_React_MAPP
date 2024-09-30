import { Component } from 'react'
import { Alert, Spin } from 'antd'
import PropTypes from 'prop-types'

import { GCConsumer } from '../../GenresContext/GenresContext'
import Wrapper from '../Wrapper/Wrapper'
import Movie from '../Movie/Movie'

import './MovieList.css'

export default class MovieList extends Component {
  render() {
    const {
      movies,
      loadingStatus,
      errorStatus,
      notFoundStatus,
      addRatingMovie,
      rateMovieData,
      //tabKey,
      guestId,
      postMovieRating,
    } = this.props

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

    const content = movieHasData ? (
      <GCConsumer>
        {(genres) => {
          //console.log('Я запрашиваю список оцененных фильмов, а там', rateMovieData)
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
                  addRatingMovie={addRatingMovie}
                  rating={rating}
                  guestId={guestId}
                  postMovieRating={postMovieRating}
                />
              </Wrapper>
            )
          })
        }}
      </GCConsumer>
    ) : null

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
  addRatingMovie: PropTypes.func.isRequired,
  notFoundStatus: PropTypes.bool,
  loadingStatus: PropTypes.bool,
  errorStatus: PropTypes.bool,
}
