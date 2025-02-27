console.log(
  "%c" +
    " __      __  ______   __  __   ______     " +
    "\n" +
    "/\\ \\  __/\\ \\ /\\__  _\\ /\\ \\ /\\ \\ /\\__  _\\    " +
    "\n" +
    "\\ \\ \\/\\ \\ \\ \\/_\\/\\ \\/ \\ \\ \\/'/'\\/ _/\\ \\/    " +
    "\n" +
    " \\ \\ \\ \\ \\ \\ \\ \\ \\ \\  \\ \\ , <    \\ \\ \\    " +
    "\n" +
    "  \\ \\ \\_/ \\_\\ \\ \\_\\ \\__\\ \\ \\\\`\\   \\_\\ \\__ " +
    "\n" +
    "   \\ `\\___x___/ /\\_____\\\\ \\_\\ \\_\\ /\\_____\\ " +
    "\n" +
    "    '/__//__/  /_____/ \\/_/\\/_/ /_____/",
  "color: #d81b60; font-size: 16px; font-weight: bold;"
);
document.addEventListener("DOMContentLoaded", () => {
  const movieTitles = document.querySelectorAll("h4[data-wiki-title]");
  const tooltips = document.querySelectorAll(".wiki-tooltip");

  if (!movieTitles.length || !tooltips.length) {
    console.error("Movie title or tooltip element not found.");
    return;
  }

  movieTitles.forEach((movieTitle, index) => {
    const tooltip = tooltips[index]; // 같은 인덱스의 tooltip과 연결

    if (!tooltip) return; // 대응되는 tooltip이 없으면 이벤트 리스너 추가 안 함

    movieTitle.addEventListener("mouseover", async () => {
      const title = movieTitle.dataset.wikiTitle;
      if (!title) return;

      try {
        const summary = await getWikiSummary(title);
        tooltip.textContent = removeHtmlTags(summary);
      } catch (error) {
        tooltip.textContent = "Failed to load Wikipedia summary.";
        console.error(error);
      }
    });

    movieTitle.addEventListener("mouseout", () => {
      tooltip.textContent = "";
    });
  });

  async function getWikiSummary(title) {
    try {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${title}&exintro=1`;
      const response = await fetch(endpoint);
      const data = await response.json();
      const page = Object.values(data.query.pages)[0];

      if (page && page.extract) {
        return page.extract.slice(0, 300) + "......";
      }
      throw new Error("Could not retrieve summary from Wikipedia.");
    } catch (error) {
      console.error(`Error fetching Wikipedia summary for "${title}":`, error);
      throw error;
    }
  }

  function removeHtmlTags(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
});
