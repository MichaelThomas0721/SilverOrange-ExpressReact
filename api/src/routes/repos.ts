import { Request, Response, Router } from 'express';

//Used to read the local json file
import fs from 'fs';
import path from 'path';
//import localRepos from './../../data/repos.json'; //used to test but won't work if the file is expected to change
import request from 'request';

export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  //callback function that will be used to call the github api and get the repos
  function callback(
    error: any,
    response: { statusCode: number },
    body: string
  ) {
    if (!error && response.statusCode === 200) {
      //parse api data
      let data = JSON.parse(body);

      //get the local data then parse
      const jsonPath = path.join(__dirname, '..', '..', 'data', 'repos.json');
      const rawdata = fs.readFileSync(jsonPath, 'utf-8');
      const parsedData = JSON.parse(rawdata);
      //merge local repos with api repos
      data = data.concat(parsedData);
      data = data.filter((obj: { fork: boolean }) => {
        return !obj.fork;
      });
      res.json(data);
    } else {
      // eslint-disable-next-line no-console
      console.log(error);
      // eslint-disable-next-line no-console
      console.log(response.statusCode);
      res.json([]);
    }
  }

  const options = {
    url: 'https://api.github.com/users/silverorange/repos',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'User-Agent': 'request',
    },
  };

  res.header('Cache-Control', 'no-store');

  res.status(200);

  // COMPLETED: See README.md Task (A). Return repo data here. You’ve got this!
  request(options, callback);
  //res.json([]);
});
