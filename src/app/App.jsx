import { Component, Fragment } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert } from 'antd'

import { GCProvider } from '../GenresContext/GenresContext'
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
    //console.log(localStorage, this.state.guestId)
    if (!localStorage.getItem('guestId')) {
      this.createGuest()
    } else {
      this.setState({
        guestId: localStorage.getItem('guestId'),
      })
    }
    this.getGenreList()
    this.getPopularMovies()
  }

  // componentDidUpdate(prevP) {
  //   if (prevP.rateMovieData !== this.props.rateMovieData) {
  //     this.setState(({ rateMovieData }) => {
  //       return { rateMovieData: rateMovieData }
  //     })
  //   }
  // }

  movieapi = new MovieapiService()

  createGuest = () => {
    //console.log('Создание сессии')
    this.movieapi
      .guestSession()
      .then((res) => {
        localStorage.setItem('guestId', res)

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
    this.movieapi
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
      this.movieapi
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
    this.setState({
      movieData: [],
      isLoading: true,
      movieNotFound: false,
      isError: false,
      isSearchMovies: false,
    })

    this.movieapi
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

  addRatingMovie = (id, value) => {
    //console.log('Рейтинг добавлен!')

    let newArr = []
    this.state.rateMovieData.map((el) => {
      if (el !== id) {
        return (newArr = { id: id, value: value })
      }
    })
    this.setState(({ rateMovieData }) => {
      return { rateMovieData: [...rateMovieData, newArr] }
    })
    //this.getDataRatingMovie()
    //console.log('Я вызван, результат ', this.state.rateMovieData)
  }

  getDataRatingMovie = () => {
    const { guestId, page } = this.state

    this.movieapi
      .getRatedMovies(guestId, page)
      .then((res) => {
        const result = res.results.map((el) => {
          return { id: el.id, value: el.rating }
        })
        const arr = []
        arr.push(...result)
        this.setState({ rateMovieData: [...arr] })
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          movieNotFound: false,
          isError: true,
        })
        //console.log('Ошибочка')
      })
  }

  getRatedMovies = () => {
    const { guestId, page } = this.state
    //console.log('Это рейтингованные! Страница ' + page)
    this.setState({
      movieData: [],
      isLoading: true,
      movieNotFound: false,
      isError: false,
      isSearchMovies: false,
    })
    this.movieapi
      .getRatedMovies(guestId, page)
      .then((res) => {
        this.setState({
          totalPage: res.total_pages,
          page,
        })

        if (res.results.length === 0) {
          //console.log('Пусто!!!')
          this.setState({
            isLoading: false,
            movieNotFound: true,
            isError: true,
          })
        }
        this.getDataRatingMovie()
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
    this.movieapi.postMovieRating(guestId, movieId, value)
  }

  moviesShow = (movieData) => {
    const { guestId, page } = this.state
    //console.log(this.state.rateMovieData)
    this.movieapi
      .getRatedMovies(guestId, page)
      .then((res) => {
        const result = res.results.map((el) => {
          return { id: el.id, value: el.rating }
        })
        const arr = []
        arr.push(...result)
        this.setState({ rateMovieData: [...arr] })
        this.setState({ movieData, isLoading: false, isError: false })
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          movieNotFound: false,
          isError: true,
        })
        this.setState({ movieData, isLoading: false, isError: false })
        console.log(
          'Я не знаю как НЕ делать запрос на получение звездочек, я не нашла через что проверить, но это точно такая же ошибка, как при запросе во второй таб-вкладке и там она разрешается. А-а-а'
        )
      })
  }

  render() {
    const mainContent = (
      <section className="movieapp__position">
        <GCProvider value={this.state.genreList}>
          <MovieList
            tabKey={this.state.tabKey}
            movies={this.state.movieData}
            //getGenresOfMovie={this.getGenresOfMovie}
            loadingStatus={this.state.isLoading}
            errorStatus={this.state.isError}
            notFoundStatus={this.state.movieNotFound}
            addRatingMovie={this.addRatingMovie}
            rateMovieData={this.state.rateMovieData}
            guestId={this.state.guestId}
            postMovieRating={this.postMovieRating}
            getRatedMovies={this.getRatedMovies}
            searchMovie={this.searchMovie}
          />
        </GCProvider>
      </section>
    )
    return (
      <Fragment>
        <Online>
          <section className="movieapp">
            <header>
              <Header onChangeTab={this.onChangeTab} />
              <Search tabKey={this.state.tabKey} searchQueryChange={this.searchQueryChange} />
            </header>
            {mainContent}
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
          {mainContent}
        </Offline>
      </Fragment>
    )
  }
}
