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
  //Used to hold a filterd copy of the data from the API to display
  const [repos, setRepos] = useState([] as RepoType[]);
  //Holds the unique languages
  const [repoLanguages, setRepoLanguages] = useState([] as string[]);
  //Holds the commit data for the popup
  const [popupData, setPopupData] = useState({
    author: { date: null, name: null },
    message: null,
    readme: null,
  } as unknown as CommitType);
  //Used to open and close the popup
  const [popupOpen, setPopupOpen] = useState(false);
  //Used to open and close the error popup
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);

  /*
  Used to fetch data from the API on load
  If we were using a framework such as Next.js I would fetched the data in getServerSideProps 
  and pass the data through props so the data would be available before load
  */
  useEffect(() => {
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Async function with axios call to get the data from the API
  async function getInitialData() {
    //Try catch in case of api error
    try {
      //axios call then sort and set the data in useRef
      await axios.get(apiUrl).then((res) => {
        repoMain.current = sortRepos(res.data as RepoType[]);
      });
    } catch (error) {
      //Open the error popup
      setErrorPopupOpen(true);
      // eslint-disable-next-line no-console
      console.log(error);
    }

    //Store the repo data
    setRepos(repoMain.current);
    //Get all unique languages from the data and store them in state
    let repoLan = [
      ...new Array(repoMain.current.map((item) => item.language)),
    ][0];
    repoLan = Array.from(new Set(repoLan));
    setRepoLanguages(repoLan);
    // eslint-disable-next-line no-console
  }

  //Function to sort the repos in reverse chronological order by creation date
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

  //Function to filter repos by language
  function filterRepos(language: string | undefined) {
    //if repo's language isn't the specified langugae it will be filtered out
    const filteredRepos = repoMain.current.filter(
      (obj: { language: string | undefined }) => {
        if (!language) {
          return true;
        }
        return obj.language === language;
      }
    );
    //Save the filtered repos to state to be displayed
    setRepos(filteredRepos);
  }

  //Function to get the data needed for the popup then display the popup
  async function HandlePopup(repoName: string) {
    //Get the data needed for the popup
    const commitData = await getCommitData(repoName);
    commitData.readme = await getReadmeData(repoName);

    //Set the data in state
    setPopupData(commitData);
    //Open the popup
    setPopupOpen(true);
  }

  //Async function to get the commit data from the API
  async function getCommitData(repoName: string) {
    //Placeholder for the commit data
    let commitData = {} as CommitType;
    //Try catch in case of api error, get the data from the API and set it in the placeholder
    try {
      await axios
        .get(`https://api.github.com/repos/${repoName}/commits`)
        .then((res) => {
          commitData = res.data[0].commit as CommitType;
        });
    } catch {
      //Incase of error set the placeholder properties to not available
      commitData = {
        author: { name: 'Author not available', date: 'Date not available' },
        message: 'Message not available',
      } as CommitType;
    }
    return commitData;
  }

  //Async function to get the readme data from the API
  async function getReadmeData(repoName: string) {
    //Placeholder for the readme data incase of error
    let readmeData = 'Readme not available' as string;

    //Try catch in case of api error, get the data from the API and set it in the placeholder
    try {
      await axios
        .get(`https://raw.githubusercontent.com/${repoName}/master/README.md`)
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
        <div className={popupOpen ? 'shown' : 'hidden'}>
          <Popup
            date={popupData.author.date}
            message={popupData.message}
            name={popupData.author.name}
            readme={popupData.readme}
            closePopup={() => setPopupOpen(false)}
          />
        </div>
        <div className={errorPopupOpen ? 'shown' : 'hidden'}>
          <h1>Error fetching repositories, please try again</h1>
        </div>
      </header>
    </div>
  );
}
