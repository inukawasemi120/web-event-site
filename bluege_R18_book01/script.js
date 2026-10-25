
const spread = document.getElementById("spread");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const position = document.getElementById("position");

let screens = [];
let current = 0;

const escapeHTML = s =>
  s.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

const all = (window.BOOK_TEXT || "タイトル\n\nここに本文を入力してください。")
  .trim()
  .split(/\r?\n/);

const title = (all.shift() || "無題").trim();
const body = all.join("\n").trim();

const paragraphs = body
  .split(/\n+/)
  .map(s => s.trim())
  .filter(Boolean);

// 段落をHTMLに変換する
function proseHTML(parts) {
  return parts.map(part => {
    const dialogue = part.first && part.text.startsWith("「");

    const classes = [
      part.first ? "" : "continued",
      dialogue ? "dialogue" : ""
    ].filter(Boolean).join(" ");

    return `<p class="${classes}">${escapeHTML(part.text)}</p>`;
  }).join("");
}

// 実際の表示領域を使って改ページ位置を測る
function paginate() {
  const mobile = matchMedia("(max-width:700px)").matches;

  const testSpread = document.createElement("div");
  testSpread.className = "spread";
  testSpread.style.position = "fixed";
  testSpread.style.left = "-10000px";
  testSpread.style.top = "0";
  testSpread.style.visibility = "hidden";
  testSpread.style.width = spread.getBoundingClientRect().width + "px";

  const testPage = document.createElement("article");
  testPage.className = mobile ? "page single" : "page right";

  const testProse = document.createElement("div");
  testProse.className = "prose";

  testPage.appendChild(testProse);
  testSpread.appendChild(testPage);
  document.body.appendChild(testSpread);

  const fits = parts => {
    testProse.innerHTML = proseHTML(parts);
    return (
      testProse.scrollWidth <= testProse.clientWidth + 1 &&
      testProse.scrollHeight <= testProse.clientHeight + 1
    );
  };

  const pages = [];
  let page = [];

  function finishPage() {
    if (page.length) {
      pages.push(page);
      page = [];
    }
  }

  for (const paragraph of paragraphs) {

  if (paragraph === "===PAGEBREAK===") {
    finishPage();
    continue;
  }

  const chars = Array.from(paragraph);
  let offset = 0;

    while (offset < chars.length) {
      const first = offset === 0;

      // 残り全部が収まるか確認
      const remainder = {
        text: chars.slice(offset).join(""),
        first
      };

      if (fits([...page, remainder])) {
        page.push(remainder);
        offset = chars.length;
        continue;
      }

      // 二分探索で収まる最大文字数を探す
      let low = 0;
      let high = chars.length - offset;

      while (low < high) {
        const mid = Math.ceil((low + high) / 2);

        const candidate = {
          text: chars.slice(offset, offset + mid).join(""),
          first
        };

        if (fits([...page, candidate])) {
          low = mid;
        } else {
          high = mid - 1;
        }
      }

      if (low === 0) {
        if (page.length) {
          finishPage();
          continue;
        }

        // 極端に画面が狭い場合の安全策
        low = 1;
      }

      page.push({
        text: chars.slice(offset, offset + low).join(""),
        first
      });

      offset += low;
      finishPage();
    }
  }

  finishPage();
  testSpread.remove();

  return pages.length ? pages : [[]];
}

function pageHTML(parts, side, num) {
  return `<article class="page ${side}">
    <div class="prose">${proseHTML(parts)}</div>
    <div class="number">${num}</div>
  </article>`;
}

function coverHTML(src, label) {
  return `<article class="page cover single">
    <img src="${src}" alt="${label}">
  </article>`;
}

function rebuild() {
  const mobile = matchMedia("(max-width:700px)").matches;
  const textPages = paginate();

  screens = [
    {
      name: "表紙",
      html: coverHTML("cover.png", "表紙")
    },
    {
      name: "扉",
      html: `<article class="page titlepage single">
        <span class="title-ornament">✦</span>
        <div class="title-lettering">${escapeHTML(title)}</div>
      </article>`
    }
  ];

  if (mobile) {
    textPages.forEach((p, i) => {
      screens.push({
        name: `本文 ${i + 1} / ${textPages.length}`,
        html: pageHTML(p, "single", i + 1)
      });
    });
  } else {
    for (let i = 0; i < textPages.length; i += 2) {
      const right = pageHTML(textPages[i], "right", i + 1);
      const left = i + 1 < textPages.length
        ? pageHTML(textPages[i + 1], "left", i + 2)
        : '<article class="page left empty"></article>';

      screens.push({
        name: `本文 ${i + 1}–${Math.min(i + 2, textPages.length)} / ${textPages.length}`,
        html: left + right
      });
    }
  }

  screens.push({
    name: "裏表紙",
    html: coverHTML("back.png", "裏表紙")
  });

  current = Math.min(current, screens.length - 1);
  render();
}

function render() {
  spread.innerHTML = screens[current].html;
  position.textContent = screens[current].name;
  prev.disabled = current === 0;
  next.disabled = current === screens.length - 1;
}

prev.onclick = () => {
  if (current > 0) {
    current--;
    render();
  }
};

next.onclick = () => {
  if (current < screens.length - 1) {
    current++;
    render();
  }
};

window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") next.click();
  if (e.key === "ArrowRight") prev.click();
});

// 画面幅が変わったら再計算
let resizeFrame;
window.addEventListener("resize", () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(rebuild);
});

rebuild();
