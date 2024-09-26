import { Component } from 'react'
import { Rate } from 'antd'
import { format, parseISO } from 'date-fns'
import './Movie.css'
import PropTypes from 'prop-types'

export default class Movie extends Component {
  onChangeRate = (value) => {
    this.props.addRateMovie(this.props.el.id, value)
    this.props.postMovieRating(this.props.el.id, value)
  }

  render() {
    const { rating, el, genres } = this.props
    const genresOfMovie = genres.filter((item) => el.genre_ids.includes(item.id))
    const { title, release_date, overview, poster_path, vote_average } = el
    const curPosterPath = poster_path || '/vbLxDKfo8fYC8ISKKrJczNbGKLP.jpg'
    const curTitle = title || 'Заголовка нет'
    const curOverview = overview || 'Описания нет'
    const curReleaseDate = release_date ? format(parseISO(release_date), 'MMMM d, y') : 'Нет даты'
    const voteAverage = vote_average.toFixed(1)

    let rateClass

    if (voteAverage < 3) {
      rateClass = 'rate__03'
    } else if (voteAverage < 5) {
      rateClass = 'rate__35'
    } else if (voteAverage < 7) {
      rateClass = 'rate__57'
    } else {
      rateClass = 'rate__710'
    }

    const shortOverview = overviewShrink(curOverview, 150)

    function overviewShrink(overview, maxSymbol) {
      if (overview.length <= maxSymbol) {
        return overview
      }
      const subStr = overview.substring(0, maxSymbol - 1)
      return `${subStr.substring(0, subStr.lastIndexOf(' '))}...`
    }

    return (
      <div className="movie">
        <div className="movie__flex">
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/original${curPosterPath}`}
            alt="Постер фильма"
          />
          <div className="movie-info">
            <div className="movie-info__header">
              <h2 className="title">{curTitle}</h2>
              <span className={`rated ${rateClass}`}>{voteAverage}</span>
            </div>
            <span className="date">{curReleaseDate}</span>
            <ul className="genres">
              {genresOfMovie.map((item) => {
                return (
                  <li className="genre" key={item.id}>
                    <span>{item.name}</span>
                  </li>
                )
              })}
            </ul>
            <span className="description">{shortOverview}</span>
            <Rate
              className="rate"
              count={10}
              allowHalf
              onChange={this.onChangeRate}
              defaultValue={rating ? rating : 0}
            />
          </div>
        </div>
      </div>
    )
  }
}

Movie.propTypes = {
  el: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    overview: PropTypes.string,
  }),
  addRateMovie: PropTypes.func.isRequired,
}
