const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
app.use(cors());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'https://YOUR_EXTENSION_ID.chromiumapp.org/callback';

app.get('/login', function (req, res) {
  const scope = 'user-top-read';
  const state = generateRandomString(16);
  const auth_query = querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  });
  res.redirect('https://accounts.spotify.com/authorize?' + auth_query);
});

app.get('/callback', function (req, res) {
  const code = req.query.code || null;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    const { access_token } = body;
    res.redirect(`https://lkonanollikphmpbdokppikhgfmjeahn.chromiumapp.org/callback#access_token=${access_token}`);
  });
});

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

app.listen(8888, () => console.log('Listening on 8888'));
