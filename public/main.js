document.getElementById("fetch-artist").addEventListener("click", async () => {
  const artistId = document.getElementById("artist-id").value;
  if (!artistId) {
    alert("Please enter an artist ID");
    return;
  }

  try {
    const artistData = await fetchArtist(artistId);
    displayArtistInfo(artistData);

    const topTracks = await fetchTopTracks(artistId);
    displayTopTracks(topTracks);
  } catch (error) {
    console.error("Error fetching artist data:", error);
    document.getElementById("artist-info").innerText =
      "Failed to fetch artist data";
    document.getElementById("top-tracks").innerText =
      "Failed to fetch top tracks";
  }
});

async function fetchArtist(artistId) {
  try {
    const response = await fetch(`/artist/${artistId}`);
    const artistData = await response.json();
    return artistData;
  } catch (error) {
    console.error("Error fetching artist data:", error);
    throw error;
  }
}

async function fetchTopTracks(artistId) {
  try {
    const response = await fetch(`/artist/${artistId}/top-tracks`);
    const topTracks = await response.json();
    return topTracks;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
}

function displayArtistInfo(artist) {
  const artistInfoDiv = document.getElementById("artist-info");
  artistInfoDiv.innerHTML = `
    <h2>${artist.name}</h2>
    <img src="${artist.images[0]?.url}" alt="${artist.name}" width="300">
    <p>Followers: ${artist.followers.total}</p>
    <p>Genres: ${artist.genres.join(", ")}</p>
    <a href="${
      artist.external_urls.spotify
    }" target="_blank">Open in Spotify</a>
  `;
}

function displayTopTracks(tracks) {
  const topTracksDiv = document.getElementById("top-tracks");
  topTracksDiv.innerHTML = "<h3>Top Tracks:</h3>";

  tracks.forEach((track) => {
    const trackElement = document.createElement("div");
    trackElement.innerHTML = `
      <h4>${track.name}</h4>
      <audio controls>
        <source src="${track.preview_url}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    `;
    topTracksDiv.appendChild(trackElement);
  });
}
