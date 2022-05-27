import './comicsList.scss';
import {useEffect, useState} from "react";
import useMarvelService from "../../services/UseMarvelService";
import Spinner from "../spiner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import {Link} from "react-router-dom";


const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const {loading, error, clearError, getComicsList} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);


  const onRequest = (offset, initial) => {
    initial
      ? setNewItemsLoading(false)
      : setNewItemsLoading(true);

    clearError();
    getComicsList(offset)
      .then(onComicsLoaded)
  }

  const onComicsLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList.length < 8) {
      ended = true;
    }

    setComicsList(prev => [...prev, ...newComicsList]);
    setOffset(offset => offset + 8);
    setNewItemsLoading(false);
    setComicsEnded(ended);
  }

  const renderItems = (arr) => {
    const items = arr.map(({id, title, thumbnail, price}, index) => {
      return (
        <li
          className="comics__item"
          key={index}
        >
          <Link to={`/comics/${id}`}>
            <img src={thumbnail} alt={title} className="comics__item-img"/>
            <div className="comics__item-name">{title}</div>
            <div className="comics__item-price">{price}</div>
          </Link>
        </li>
      );
    });

    return (
      <ul className="comics__grid">
        {items}
      </ul>
    );
  }

  const spinner = loading && !newItemsLoading ? <Spinner/> : null;
  const errorMessage = error ? <ErrorMessage/> : null;
  const content = renderItems(comicsList);

  return (
    <div className="comics__list">
      {spinner}
      {errorMessage}
      {content}
      <button
        className="button button__main button__long"
        type="button"
        disabled={newItemsLoading}
        style={{display: comicsEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

export default ComicsList;