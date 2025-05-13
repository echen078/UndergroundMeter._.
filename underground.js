document.getElementById("login").addEventListener("click", async () => {
  const clientId = '0b708c705a3b4b00b67f6e68c1d68ed6';
  const redirectUri = chrome.identity.getRedirectURL('spotify');
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("verifier", codeVerifier); // Save for later

  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=user-top-read` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    async function (redirectUrl) {
      const urlParams = new URL(redirectUrl).searchParams;
      const authCode = urlParams.get("code");
      const codeVerifier = localStorage.getItem("verifier");

      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier: codeVerifier
        })
      });

      const data = await tokenResponse.json();
      const accessToken = data.access_token;
      console.log("Access token:", data.access_token);


      if (!accessToken) {
        alert("Failed to get access token.");
        return;
      }

      try {
        const topArtists = await fetchTopArtists(accessToken);
        const avg = calculateAveragePopularity(topArtists);
        
        //alert(`🎧 Your average artist popularity is: ${avg.toFixed(2)}`);
        // Redirect to results page
        window.location.href = `results.html?avg=${avg.toFixed(2)}`;

      } catch (err) {
        alert("Failed to fetch top artists: " + err.message);
      }


    }
  );
});

// -- Spotify API Helpers --

async function fetchTopArtists(token) {
  const res = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) {
    throw new Error("Spotify API error: " + res.status);
  }

  const data = await res.json();
  return data.items || [];
}

function calculateAveragePopularity(artists) {
  if (artists.length === 0) return 0;
  const total = artists.reduce((sum, artist) => sum + artist.popularity, 0);
  return total / artists.length;
}


// -- PKCE Utility Functions --

function generateRandomString(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  return result;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}




/*
const clientId = '0b708c705a3b4b00b67f6e68c1d68ed6';
const redirectUri = chrome.identity.getRedirectURL('spotify');
const scopes = 'user-top-read';

document.querySelector('#login-btn').addEventListener('click', () => {
  const authUrl =
    `https://accounts.spotify.com/authorize` +
    `?client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  console.log("Auth URL: ", authUrl);

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    async (redirectedTo) => {
      if (chrome.runtime.lastError || !redirectedTo) {
        alert("Authentication failed: " + chrome.runtime.lastError.message);
        return;
      }

      const token = new URL(redirectedTo).hash.match(/access_token=([^&]*)/)[1];

      try {
        const topArtists = await fetchTopArtists(token);
        const averagePopularity = calculateAveragePopularity(topArtists);
        alert(`Your average popularity is ${averagePopularity.toFixed(2)}!`);
      } catch (error) {
        alert("Error fetching artists: " + error.message);
      }
    }
  );
});

async function fetchTopArtists(token) {
  const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
    headers: { Authorization: 'Bearer ' + token }
  });

  if (!response.ok) throw new Error('Failed to fetch top artists');
  const data = await response.json();
  return data.items;
}

function calculateAveragePopularity(artists) {
  const total = artists.reduce((sum, artist) => sum + artist.popularity, 0);
  return total / artists.length;
}

*/

/*
document.getElementById("login-btn").addEventListener("click", function () {
  chrome.identity.launchWebAuthFlow(
    {
      url: 'http://localhost:8888/login', // Replace with your deployed backend URL in production
      interactive: true,
    },
    function (redirectUrl) {
      if (!redirectUrl) {
        console.error("Login failed or user closed the popup.");
        return;
      }

      // Extract the access token from the redirect URI's hash
      const tokenMatch = redirectUrl.match(/#(.+)$/);
      if (!tokenMatch) {
        console.error("Access token not found in redirect URL.");
        return;
      }

      const params = new URLSearchParams(tokenMatch[1]);
      const accessToken = params.get("access_token");

      if (!accessToken) {
        console.error("Access token missing in URL params.");
        return;
      }

      fetchTopArtists(accessToken);
    }
  );
});

function fetchTopArtists(token) {
  fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.items || data.items.length === 0) {
        alert("No top artists found.");
        return;
      }

      const popularities = data.items.map((artist) => artist.popularity);
      const avgPopularity =
        popularities.reduce((sum, val) => sum + val, 0) / popularities.length;

      alert("🎧 Your average artist popularity is: " + avgPopularity.toFixed(2));
    })
    .catch((err) => {
      console.error("Error fetching top artists:", err);
      alert("Failed to fetch top artists.");
    });
}
*/