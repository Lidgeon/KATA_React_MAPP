import { Component } from 'react'

export default class MovieapiService extends Component {
  _apiToken =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYThlYTgzMmNiYjQzZTk4OGQ2MGY4NTJmNGFlNWMwOCIsIm5iZiI6MTcyNjA2NzkxMy44MjAxODksInN1YiI6IjY2ZDViNjAzZmI1YTA0YjJhZTRjZTE1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qoQP8ogNGeJJOEIOAfgVG9PwBtgA3o1v_NhvFis9SEc'

  _apiKey = 'ba8ea832cbb43e988d60f852f4ae5c08'

  _baseURL = 'https://api.themoviedb.org/3/'

  _headers = {
    accept: 'application/json',
    Authorization: `${this._apiToken}`,
  }

  async getInfo(url) {
    const response = await fetch(`${this._baseURL}${url}`, {
      method: 'GET',
      headers: this._headers,
    })

    if (!response.ok) {
      throw new Error(`Нет ответа от ${url}, статус ошибки ${response.status}`)
    }
    return await response.json()
  }

  async getMoviesInfo(search, page = 1, adult = false, language = 'en-US') {
    const url = `search/movie?query=${search}&include_adult=${adult}&language=${language}&page=${page}`
    const res = await this.getInfo(url)
    return res
  }

  async getPopularMovies(page = 1, language = 'en-US') {
    const url = `movie/popular?language=${language}&page=${page}`
    const res = await this.getInfo(url)
    return res
  }

  async getGenreList(language = 'en') {
    const url = `genre/movie/list?language=${language}`
    const res = await this.getInfo(url)
    return res
  }

  async guestSession() {
    const url = 'authentication/guest_session/new'
    return this.getInfo(url).then((res) => res.guest_session_id)
  }

  async getRatedMovies(guestId, page = 1, language = 'en-US') {
    const url = `guest_session/${guestId}/rated/movies?api_key=${this._apiKey}&language=${language}&page=${page}&sort_by=created_at.asc`
    return this.getInfo(url).then((res) => res)
  }

  async postMovieRating(guestId, movieId, value) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: `{"value": ${value}}`,
    }

    const response = await fetch(
      `${this._baseURL}movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestId}`,
      options
    )

    if (response.ok) {
      return await response.json()
    }

    throw new Error('Ошибка отправки данных (оценка рейтинга)')
  }
}
