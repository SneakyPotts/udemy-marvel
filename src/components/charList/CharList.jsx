import './charList.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spiner/Spinner";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemsLoading: false,
    offset: 1535,
    charEnded: false
  }

  marvelService = new MarvelService()

  componentDidMount() {
    this.onRequest();
    window.addEventListener('scroll', this.onScrollPagination);
  }

  onScrollPagination = () => {
    if (this.state.charEnded) {
      window.removeEventListener('scroll', this.onScrollPagination);
      return;
    }
    if ((window.pageYOffset + document.documentElement.clientHeight) >= (document.documentElement.scrollHeight - 1)) {
      this.onRequest(this.state.offset);
    }
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError)
  }

  onCharListLoading = () => {
    this.setState({
      newItemsLoading: true
    });
  }

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({charList, offset}) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemsLoading: false,
      offset: offset + 9,
      charEnded: ended
    }))
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false
    })
  }

  renderItems(arr) {
    const items = arr.map(({id, name, thumbnail}) => {
      let imgStyle = {'objectFit' : 'cover'};

      if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
      }

      return (
        <li
          className="char__item"
          key={id}
          onClick={() => this.props.onCharSelected(id)}
        >
          <img src={thumbnail} alt={name} style={imgStyle}/>
          <div className="char__name">{name}</div>
        </li>
      )
    });

    return (
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

  render() {
    const {charList, loading, error, newItemsLoading, offset, charEnded} = this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {spinner}
        {errorMessage}
        {content}
        <button
          className="button button__main button__long"
          type='button'
          disabled={newItemsLoading}
          style={{display: charEnded ? "none" : "block"}}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

export default CharList;