
const movies = [
  {id:1,title:"Interstellar",year:2014,genre:"Sci-Fi",rating:8.7,poster:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",desc:"An astronaut travels across the galaxy to save humanity."},
  {id:2,title:"The Dark Knight",year:2008,genre:"Action",rating:9.0,poster:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",desc:"Batman faces Gotham's most dangerous criminal."},
  {id:3,title:"La La Land",year:2016,genre:"Romance",rating:8.0,poster:"https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",desc:"Two dreamers find love while pursuing their ambitions."},
  {id:4,title:"Dune: Part Two",year:2024,genre:"Sci-Fi",rating:8.5,poster:"https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",desc:"Paul Atreides joins the Fremen on an epic journey."},
  {id:5,title:"Knives Out",year:2019,genre:"Thriller",rating:7.9,poster:"https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg",desc:"A detective investigates a mysterious family murder."},
  {id:6,title:"The Hangover",year:2009,genre:"Comedy",rating:7.7,poster:"https://image.tmdb.org/t/p/w500/A0uS9rHR56FeBtpjVki16M5xxSW.jpg",desc:"Friends try to piece together a wild night in Vegas."},
  {id:7,title:"The Shawshank Redemption",year:1994,genre:"Drama",rating:9.3,poster:"https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",desc:"Hope and friendship grow inside a prison."},
  {id:8,title:"Spider-Man: Into the Spider-Verse",year:2018,genre:"Action",rating:8.4,poster:"https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",desc:"Miles Morales discovers a whole universe of Spider heroes."},
  {id:9,title:"Get Out",year:2017,genre:"Thriller",rating:7.8,poster:"https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",desc:"A weekend visit turns into a chilling mystery."},
  {id:10,title:"The Truman Show",year:1998,genre:"Drama",rating:8.2,poster:"https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg",desc:"A man starts questioning his seemingly perfect world."},
  {id:11,title:"The Martian",year:2015,genre:"Sci-Fi",rating:8.0,poster:"https://image.tmdb.org/t/p/w500/5aGhaIHYuQbqlHWvWYqMCnj40y2.jpg",desc:"An astronaut uses science and humour to survive on Mars."},
  {id:12,title:"Mad Max: Fury Road",year:2015,genre:"Action",rating:8.1,poster:"https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",desc:"A high-speed escape across a dangerous desert."}
];

const grid = document.getElementById("movieGrid");
const savedGrid = document.getElementById("savedGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
let genre = "All";
let query = "";
let saved = [];

try {
  saved = JSON.parse(localStorage.getItem("cine-watchlist") || "[]");
} catch {
  saved = [];
}

function renderCard(movie) {
  const isSaved = saved.includes(movie.id);

  return `
    <article class="card">
      <img src="${movie.poster}"
        alt="${movie.title} poster"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/400x600/211b31/ffffff?text=Movie'">
      <div class="info">
        <h3>${movie.title}</h3>
        <p>${movie.year} · ${movie.genre}</p>
        <p class="rating">★ ${movie.rating} / 10</p>
        <p>${movie.desc}</p>
        <button data-save="${movie.id}">
          ${isSaved ? "♥ Saved" : "♡ Add to Watchlist"}
        </button>
      </div>
    </article>`;
}

function render() {
  const filtered = movies.filter(movie => {
    const matchesGenre = genre === "All" || movie.genre === genre;
    const matchesSearch =
      (movie.title + " " + movie.genre + " " + movie.desc)
        .toLowerCase().includes(query.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  grid.innerHTML = filtered.map(renderCard).join("");
  empty.hidden = filtered.length > 0;

  const watchlistMovies = saved
    .map(id => movies.find(movie => movie.id === id))
    .filter(Boolean);

  savedGrid.innerHTML = watchlistMovies.map(renderCard).join("");
  document.getElementById("count").textContent = watchlistMovies.length;
}

function toggleSave(id) {
  if (saved.includes(id)) {
    saved = saved.filter(item => item !== id);
  } else {
    saved.push(id);
  }

  localStorage.setItem("cine-watchlist", JSON.stringify(saved));
  render();
}

document.querySelector(".filters").addEventListener("click", event => {
  const button = event.target.closest("[data-genre]");
  if (!button) return;

  genre = button.dataset.genre;

  document.querySelectorAll(".filters button").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  render();
});

search.addEventListener("input", () => {
  query = search.value.trim();
  render();
});

document.addEventListener("click", event => {
  const button = event.target.closest("[data-save]");
  if (button) toggleSave(Number(button.dataset.save));
});

document.getElementById("surprise").addEventListener("click", () => {
  const pool = movies.filter(movie =>
    genre === "All" || movie.genre === genre
  );

  const choice = pool[Math.floor(Math.random() * pool.length)];
  if (!choice) return;

  search.value = choice.title;
  query = choice.title;
  genre = "All";

  document.querySelectorAll(".filters button").forEach(button => {
    button.classList.toggle("active", button.dataset.genre === "All");
  });

  render();
  document.getElementById("movies").scrollIntoView({behavior:"smooth"});
});

render();
