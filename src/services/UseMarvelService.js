import {useHttp} from "../hooks/http.hook";

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const useMarvelService = () =>{
  const {loading, request, error, clearError} = useHttp();

  const _baseOffset = 1000;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${API_URL}characters?limit=9&offset=${offset}&apikey=${API_KEY}`);

    return res.data.results.map(_transformCharacter)
  }

  const getCharacter = async (id) => {
    const res = await request(`${API_URL}characters/${id}?apikey=${API_KEY}`);

    return _transformCharacter(res.data.results[0]);
  }

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }
  }

  return {loading, error, getAllCharacters, getCharacter, clearError}
}

export default useMarvelService;