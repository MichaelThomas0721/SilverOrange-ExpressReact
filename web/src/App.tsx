import './App.css';

import React, { useEffect, useRef, useState } from 'react';

import CommitType from './types/CommitType';
import Popup from './components/Popup';
import RepoBox from './components/RepoBox';
import RepoType from './types/RepoType';
import axios from 'axios';

const apiUrl = 'http://localhost:4000/repos';

export function App() {
  //Used to hold a main copy of the data from the API
  const repoMain = useRef([] as RepoType[]);
  const [repos, setRepos] = useState([] as RepoType[]);
  const [repoLanguages, setRepoLanguages] = useState([] as string[]);
  const [popupData, setPopupData] = useState({
    author: { date: null, name: null },
    message: null,
    readme: null,
  } as unknown as CommitType);
  const [popupOpen, setPopupOpen] = useState(false);

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

  async function HandlePopup(repoName: string) {
    const commitData = await getCommitData(repoName);
    commitData.readme = await getReadmeData(repoName);

    setPopupData(commitData);
    setPopupOpen(true);
  }

  async function getCommitData(repoName: string) {
    let commitData = {} as CommitType;
    try {
      await axios
        .get(`https://api.github.com/repos/${repoName}/commits`)
        .then((res) => {
          commitData = res.data[0].commit as CommitType;
        });
    } catch {
      commitData = {
        author: { name: 'Author not available', date: 'Date not available' },
        message: 'Message not available',
      } as CommitType;
    }
    return commitData;
  }

  async function getReadmeData(repoName: string) {
    let readmeData = 'Readme not available' as string;

    try {
      await axios
        .get(`https://raw.githubusercontent.com/${repoName}/master/README.md`)
        //.get(
        //  `https://raw.githubusercontent.com/MichaelThomas0721/Programming-Problems/main/README.md`
        //)
        .then((res) => {
          readmeData = res.data;
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    return readmeData;
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
            onClick={() => HandlePopup(repo.full_name)}
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
        <div className={popupOpen ? 'popup_shown' : 'popup_hidden'}>
          <Popup
            date={popupData.author.date}
            message={popupData.message}
            name={popupData.author.name}
            readme={popupData.readme}
            closePopup={() => setPopupOpen(false)}
          />
        </div>
      </header>
    </div>
  );
}
