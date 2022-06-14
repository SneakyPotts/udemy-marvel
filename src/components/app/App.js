import {BrowserRouter, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spiner/Spinner";

const Page404 = lazy(() => import("../pages/404"));
const MainPage = lazy(() => import("../pages/MainPage"));
const ComicsPage = lazy(() => import("../pages/ComicsPage"));
const SingleComicPage = lazy(() => import("../pages/SingleComicPage"));

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <AppHeader/>
        <main>
          <Suspense fallback={<Spinner/>}>
            <Routes>
              <Route path="/udemy-marvel" element={<MainPage/>}/>
              <Route path="/udemy-marvel/comics" element={<ComicsPage/>}/>
              <Route path="/udemy-marvel/comics/:id" element={<SingleComicPage/>}/>
              <Route path="*" element={<Page404/>}/>
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;