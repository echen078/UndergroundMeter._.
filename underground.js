
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