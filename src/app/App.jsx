import { Component, Fragment } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert } from 'antd'

import { GCProvider } from '../component/GenresContext/GenresContext'
import MovieapiService from '../services/movieapi-services'
import MovieList from '../component/MovieList/MovieList'
import Search from '../component/Search/Search'
import Footer from '../component/Footer/Footer'
import Header from '../component/Header/Header'

import './App.css'
import 'inter-ui/inter.css'

export default class App extends Component {
  state = {
    movieData: [],
    genreList: [],
    rateMovieData: [],
    isLoading: true,
    isError: false,
    searchQuery: '',
    movieNotFound: false,
    page: 1,
    totalPage: 0,
    isSearchMovies: false,
    guestId: '',
    tabKey: 1,
  }

  componentDidMount() {
    if (!sessionStorage.getItem('guestId')) {
      this.createGuest()
    } else {
      this.setState({
        guestId: sessionStorage.getItem('guestId'),
      })
    }
    this.getGenreList()
    this.getPopularMovies()

    if (sessionStorage.getItem('rateMovieData')) {
      this.setState({
        rateMovieData: JSON.parse(sessionStorage.getItem('rateMovieData')),
      })
    }
  }

  createGuest = () => {
    const movieapi = new MovieapiService()
    movieapi
      .guestSession()
      .then((res) => {
        sessionStorage.setItem('guestId', res)

        this.setState({ guestId: res, isLoading: false })
      })
      .catch(() => {
        this.setState({ isError: true, movieNotFound: false, isLoading: false })
      })
  }

  onError = () => {
    this.setState({ isError: true, isLoading: false })
  }

  onChangeTab = (key) => {
    this.setState({ tabKey: key })
    //console.log('Проверка вызова таба')
    if (key === 1) {
      this.setState({ page: 1, tabKey: 1 }, () => {
        this.getPopularMovies()
      })
    } else {
      this.setState({ isSearchMovies: false, page: 1, tabKey: 2 }, () => {
        this.getRatedMovies()
      })
    }
  }

  getGenreList = () => {
    const movieapi = new MovieapiService()
    movieapi
      .getGenreList()
      .then((res) => {
        this.setState({ genreList: res.genres })
      })
      .catch(() => {
        this.setState({ isError: true, movieNotFound: false, isLoading: false })
      })
  }

  searchMovie = () => {
    //console.log('Это поисковик!')
    const { searchQuery, page } = this.state
    const movieapi = new MovieapiService()
    this.setState({
      movieData: [],
      isLoading: true,
      movieNotFound: false,
      isError: false,
      isSearchMovies: true,
    })

    if (searchQuery === '') {
      this.getPopularMovies()
      this.setState({ isSearchMovies: false })
    } else {
      movieapi
        .getMoviesInfo(searchQuery, page)
        .then((res) => {
          this.setState({
            totalPage: res.total_pages,
            page,
          })
          if (res.results.length === 0) {
            this.setState({
              isLoading: false,
              movieNotFound: true,
            })
          }
          this.moviesShow(res.results)
        })
        .catch(() => {
          this.setState({ isError: true, movieNotFound: false, isLoading: false })
        })
    }
  }

  searchQueryChange = (searchQuery) => {
    this.setState({ searchQuery, page: 1 }, () => {
      this.searchMovie()
    })
  }

  getPopularMovies = () => {
    const { page } = this.state
    //console.log('Это популярити! Страница ' + page)
    const movieapi = new MovieapiService()
    this.setState({
      movieData: [],
      isLoading: true,
      movieNotFound: false,
      isError: false,
      isSearchMovies: false,
    })
    movieapi
      .getPopularMovies(page)
      .then((res) => {
        this.setState({
          totalPage: res.total_pages,
          page,
        })
        if (res.results.length === 0) {
          this.setState({
            isLoading: false,
            movieNotFound: true,
          })
        }
        this.moviesShow(res.results)
      })
      .catch(() => {
        this.setState({ isError: true, movieNotFound: false, isLoading: false })
      })
  }

  changePage = (page) => {
    const { tabKey } = this.state
    this.setState({ page }, () => {
      if (tabKey === 1) {
        if (this.state.isSearchMovies) {
          this.searchMovie()
        } else {
          this.getPopularMovies()
        }
      } else {
        this.getRatedMovies()
      }
    })
  }

  addRateMovie = (id, value) => {
    //console.log('Я получил ', id, ' Со значением ', value)
    const newRateMovie = { id, value }

    this.setState(({ rateMovieData }) => {
      return {
        rateMovieData: [...rateMovieData, newRateMovie],
      }
    })
  }

  getRatedMovies = () => {
    const { guestId, page } = this.state
    //console.log('Это рейтингованные! Страница ' + page)
    const movieapi = new MovieapiService()
    this.setState({
      movieData: [],
      isLoading: true,
      movieNotFound: false,
      isError: false,
      isSearchMovies: false,
    })
    movieapi
      .getRatedMovies(guestId, page)
      .then((res) => {
        this.setState({
          totalPage: res.total_pages,
          page,
        })
        if (res.results.length === 0) {
          console.log('Пусто!!!')
          this.setState({
            isLoading: false,
            movieNotFound: true,
            isError: true,
          })
        }
        this.moviesShow(res.results)
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          movieNotFound: false,
          isError: true,
        })
      })
  }

  postMovieRating = (movieId, value) => {
    const { guestId } = this.state
    const movieapi = new MovieapiService()
    movieapi.postMovieRating(guestId, movieId, value)
  }

  moviesShow = (movieData) => {
    this.setState({ movieData, isLoading: false, isError: false })
  }

  render() {
    return (
      <Fragment>
        <Online>
          <section className="movieapp">
            <header>
              <Header onChangeTab={this.onChangeTab} />
              <Search tabKey={this.state.tabKey} searchQueryChange={this.searchQueryChange} />
            </header>
            <section className="movieapp__position">
              <GCProvider value={this.state.genreList}>
                <MovieList
                  tabKey={this.state.tabKey}
                  movies={this.state.movieData}
                  //getGenresOfMovie={this.getGenresOfMovie}
                  loadingStatus={this.state.isLoading}
                  errorStatus={this.state.isError}
                  notFoundStatus={this.state.movieNotFound}
                  addRateMovie={this.addRateMovie}
                  rateMovieData={this.state.rateMovieData}
                  guestId={this.state.guestId}
                  postMovieRating={this.postMovieRating}
                  getRatedMovies={this.getRatedMovies}
                  searchMovie={this.searchMovie}
                />
              </GCProvider>
            </section>
            <footer>
              <Footer
                notFoundStatus={this.state.movieNotFound}
                loadingStatus={this.state.isLoading}
                errorStatus={this.state.isError}
                totalPage={this.state.totalPage}
                currentPage={this.state.page}
                onChangePage={this.changePage}
              />
            </footer>
          </section>
        </Online>
        <Offline>
          <Alert
            message="У нас убежали драконы!"
            description="Они съели ваше соединение с сетью. Нам очень жаль. Вам стоит поискать новую сеть или попытаться что-то сделать со старой..."
            type="error"
            showIcon
          />
        </Offline>
      </Fragment>
    )
  }
}
