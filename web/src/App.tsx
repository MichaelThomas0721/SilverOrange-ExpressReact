import './App.css';

import React, { useEffect, useRef, useState } from 'react';

import RepoBox from './components/RepoBox';
import RepoType from './types/RepoType';
import axios from 'axios';

const apiUrl = 'http://localhost:4000/repos';

export function App() {
  //Used to hold a main copy of the data from the API
  const repoMain = useRef([] as RepoType[]);
  const [repos, setRepos] = useState([] as RepoType[]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getData() {
    try {
      await axios.get(apiUrl).then((res) => {
        repoMain.current = res.data as RepoType[];
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    setRepos(repoMain.current);
  }
  return (
    <div className="App">
      <header className="App-header">
        {repos.map((repo: RepoType, index: number) => (
          <div key={index}>
            <RepoBox
              id={repo.id}
              name={repo.name}
              description={repo.description}
              language={repo.language}
              forks={repo.forks_count}
              created_at={repo.created_at}
            />
          </div>
        ))}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
