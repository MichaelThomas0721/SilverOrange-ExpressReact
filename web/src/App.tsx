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
  const [repoLanguages, setRepoLanguages] = useState([] as string[]);

  useEffect(() => {
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getInitialData() {
    try {
      await axios.get(apiUrl).then((res) => {
        repoMain.current = sortRepos(res.data as RepoType[]);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    let repoLan = [
      ...new Array(repoMain.current.map((item) => item.language)),
    ][0];
    repoLan = Array.from(new Set(repoLan));
    setRepoLanguages(repoLan);
    // eslint-disable-next-line no-console
    console.log(repoLanguages);
    setRepos(repoMain.current);
  }

  function filterRepos(language: string | undefined) {
    const filteredRepos = repoMain.current.filter(
      (obj: { language: string | undefined }) => {
        if (!language) {
          return true;
        }
        return obj.language === language;
      }
    );
    setRepos(filteredRepos);
  }

  function sortRepos(passedRepos: RepoType[]) {
    passedRepos
      .sort((a, b) => {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      })
      .reverse();
    return passedRepos;
  }

  async function getCommitData(repoName: string) {
    let commitData = {} as any;
    try {
      await axios
        .get(`https://api.github.com/repos/${repoName}/commits`)
        .then((res) => {
          commitData = res.data[0].commit as any;
        });
    } catch {
      commitData = {
        author: { name: 'Author not available', date: 'Date not available' },
        message: 'Message not available',
      } as any;
    }
    return commitData;
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Repositories</h1>

        <div>
          <h2>Languages</h2>
          <button onClick={() => filterRepos(undefined)}>All</button>
          {repoLanguages.map((language: string, index: number) => (
            <button key={index} onClick={() => filterRepos(language)}>
              {language}
            </button>
          ))}
        </div>
        {repos.map((repo: RepoType, index: number) => (
          <div
            key={index}
            // eslint-disable-next-line no-console
            onClick={() => console.log(getCommitData(repo.full_name))}
          >
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
      </header>
    </div>
  );
}
