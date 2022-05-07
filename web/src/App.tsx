import './App.css';

import React, { useEffect, useRef } from 'react';

import axios from 'axios';

export function App() {
  const repoMain = useRef([] as RepoType[]);

  interface RepoType {
    id: number;
    name: string;
    description: string;
    language: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    forks_count: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    full_name: string;
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getData() {
    try {
      await axios.get('http://localhost:4000/repos').then((res) => {
        repoMain.current = res.data as RepoType[];
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    // eslint-disable-next-line no-console
    console.log(repoMain.current);
  }
  return (
    <div className="App">
      <header className="App-header">
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
