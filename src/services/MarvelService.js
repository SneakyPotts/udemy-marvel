const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

class MarvelService {
  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok)
      throw new Error(`Could not fetch ${url}, status - ${res.status}`)

    return await res.json();
  }

  getAllCharacters = async () => {
    const res = this.getResource(`${API_URL}characters?limit=9&offset=1235&apikey=${API_KEY}`);

    return res.data.results.map(this._transformCharacter)
  }

  getCharacter = async (id) => {
    const res = await this.getResource(`${API_URL}characters/${id}?apikey=${API_KEY}`);

    return this._transformCharacter(res.data.results[0]);
  }

  _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url
    }
  }
}

export default MarvelService;