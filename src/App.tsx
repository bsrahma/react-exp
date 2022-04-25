import {useState, useEffect} from "react";
import { BrowserRouter as Router, useNavigate, useRoutes } from 'react-router-dom';
import styles from './App.module.css';
import Character from './Character';
import { ICharacter, IInfo } from "./interfaces";


const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

function Home() {
  const navigate = useNavigate();
  const [results, updateResults] = useState<ICharacter[]>([]);
  const [page, updatePage] = useState<IInfo>({current: defaultEndpoint} as IInfo);

  const { current } = page;

  useEffect(() => {
    async function requestResult() {
      const res = await fetch(defaultEndpoint);
      const nextData = await res.json();

      updateResults((prev: ICharacter[]) => {
        return [...prev, ...nextData.results];
      });

      updatePage((prev: IInfo) => {
        return {...prev, ...nextData.info};
      });
    }
    requestResult();
  }, []);

  useEffect(() => {
    if (current === defaultEndpoint) return;
    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev: ICharacter[]) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev: IInfo) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  function handleOnSubmitSearch(e: React.FormEvent<HTMLFormElement> ) {
    e.preventDefault();

    const { currentTarget = {} as HTMLFormElement} = e;
    const fields = Array.from(currentTarget?.elements) as HTMLInputElement [];
    const fieldQuery = fields.find((field) => field.name === 'query');

    const value = fieldQuery?.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      ...page,
      current: endpoint,
    });
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>The Rick and Morty</h1>

        <p className={styles.description}>Welcome to Rick and Morty world</p>
        <form className={styles.search} onSubmit={handleOnSubmitSearch}>
          <input name="query" type="search" />
          <button>Search</button>
        </form>

        <ul className={styles.grid}>
          {results.length && results.map((result) => {
            const { id, name, image } = result;
            return (
              <li key={id} className={styles.card}>
                  <div onClick={() => navigate(`/character/${id}`, { state: {id}})}>
                    <img src={image} alt={`${name} Thumbnail`} />
                    <h3>{name}</h3>
                  </div>
              </li>
            );
          })}
        </ul>
        <p>
          <button className={styles.btn} onClick={handleLoadMore}>
            Load More
          </button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://sites.google.com/devoteam.com/ct-studio-front/home"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' Devoteam Pole Front'}
        </a>
      </footer>
    </div>
  );
}

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/character/:id", element: <Character /> },
    { path: "*", element: <Home /> },
  ]);
  return routes;
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>

  );
}

export default App;
