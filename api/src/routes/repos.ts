import { Request, Response, Router } from 'express';

import localRepos from './../../data/repos.json';
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
      //merge local repos with api repos
      data = data.concat(localRepos);
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

  request(options, callback);
  // TODO: See README.md Task (A). Return repo data here. You’ve got this!
  //res.json([]);
});
