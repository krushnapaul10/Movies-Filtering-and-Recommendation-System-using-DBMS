async function fetchMovies() {
    try {
        const response = await fetch("/movies");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const movies = await response.json();
        displayTable(movies, ["ID", "Title", "Year", "Certification", "Rating", "Revenue", "Runtime", "Language"]);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function showGenreSearch() {
    const genreSelect = document.getElementById("genre-select");
    const genre = genreSelect.value;
    if (!genre) return alert("Please select a genre.");
    
    fetch("/movies/genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre })
    })
    .then(response => response.json())
    .then(data => displayTable(data, ["Title", "Year", "Genre"]))
    .catch(error => console.error("Error fetching genre:", error));
}

function showMovieDetails() {
    const title = prompt("Enter Movie Title:");
    if (!title) return;
    fetch("/movies/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    })
    .then(response => response.json())
    .then(data => displayTable([data], ["ID", "Title", "Year", "Rating", "Revenue", "Runtime"]))
    .catch(error => console.error("Error fetching details:", error));
}

function showPlatformSearch() {
    const platformSelect = document.getElementById("platform-select");
    const platform = platformSelect.value;
    if (!platform) return alert("Please select a platform.");

    fetch("/movies/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform })
    })
    .then(response => response.json())
    .then(data => displayTable(data, ["Title", "Year", "Platform"]))
    .catch(error => console.error("Error fetching platform:", error));
}

function showAdvancedSearch() {
    const typeSelect = document.getElementById("search-type");
    const type = typeSelect.value;

    let criteria = {};
    if (type === "genre") {
        const genreSelect = document.getElementById("advanced-genre");
        const genre = genreSelect.value;
        if (!genre) return alert("Please select a genre.");
        criteria = { type: "genre", value: genre };
    } else if (type === "rating") {
        const rating = parseFloat(prompt("Enter Minimum IMDb Rating:"));
        if (isNaN(rating)) return;
        criteria = { type: "rating", value: rating };
    } else if (type === "revenue") {
        const min = parseFloat(prompt("Enter Minimum Revenue:"));
        const max = parseFloat(prompt("Enter Maximum Revenue:"));
        if (isNaN(min) || isNaN(max)) return;
        criteria = { type: "revenue", min, max };
    } else {
        alert("Invalid option.");
        return;
    }

    fetch("/movies/advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria)
    })
    .then(response => response.json())
    .then(data => displayTable(data, ["Title", "Year", "Details"]))
    .catch(error => console.error("Error in advanced search:", error));
}

function displayTable(data, headers) {
    const output = document.getElementById("output");
    output.innerHTML = "";
    if (!data || data.length === 0) {
        output.textContent = "No results found.";
        return;
    }

    const table = document.createElement("table");
    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    data.forEach(row => {
        const tr = tbody.insertRow();
        (Array.isArray(row) ? row : Object.values(row)).forEach(cell => {
            const td = tr.insertCell();
            td.textContent = cell;
        });
    });

    output.appendChild(table);
} 



