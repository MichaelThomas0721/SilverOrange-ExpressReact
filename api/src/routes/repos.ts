import { Request, Response, Router } from 'express';

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
      const data = JSON.parse(body);
      res.json(data);
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
