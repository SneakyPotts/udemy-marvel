import React from 'react';
import SingleComic from "../singleComic/SingleComic";
import {useParams} from "react-router-dom";

const SingleComicPage = () => {
  const {id} = useParams();

  return (
    <>
      <SingleComic id={id}/>
    </>
  );
};

export default SingleComicPage;