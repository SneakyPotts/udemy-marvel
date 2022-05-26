import './charList.scss';
import useMarvelService from "../../services/UseMarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spiner/Spinner";
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(1000);
  const [charEnded, setCharEnded] = useState(false);

  const {loading, error, getAllCharacters, clearError} = useMarvelService();

  useEffect(() => {
    onRequest();

    //todo: if u want use scroll pagination use next line code

    // window.addEventListener('scroll', this.onScrollPagination);
  },[]);

  const onScrollPagination = () => {
    if (charEnded) {
      window.removeEventListener('scroll', onScrollPagination);
      return;
    }
    if ((window.pageYOffset + document.documentElement.clientHeight) >= (document.documentElement.scrollHeight - 1)) {
      onRequest(offset, true);
    }
  }

  const onRequest = (offset, initial) => {
    initial
      ? setNewItemsLoading(false)
      : setNewItemsLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList(charList => [...charList, ...newCharList]);
    setNewItemsLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
  }

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  const renderItems = (arr) => {
    const items = arr.map(({id, name, thumbnail}, index) => {
      let imgStyle = {'objectFit': 'cover'};

      if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'unset'};
      }

      return (
        <li
          className="char__item"
          tabIndex={0}
          key={id}
          ref={el => {
            itemRefs.current[index] = el
          }}
          onClick={() => {
            props.onCharSelected(id);
            focusOnItem(index);
          }}
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === "Enter") {
              e.preventDefault();
              props.onCharSelected(id);
              focusOnItem(index);
            }
          }}>
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

  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemsLoading ? <Spinner/> : null;

  return (
    <div className="char__list">
      {spinner}
      {errorMessage}
      {items}
      <button
        className="button button__main button__long"
        type='button'
        disabled={newItemsLoading}
        style={{display: charEnded ? "none" : "block"}}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;