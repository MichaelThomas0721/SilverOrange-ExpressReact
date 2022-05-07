import './App.css';

import React, { useEffect } from 'react';

import axios from 'axios';

const apiUrl = 'http://localhost:4000/repos';

export function App() {
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      await axios.get(apiUrl).then((res) => {
        console.log(res.data);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
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
