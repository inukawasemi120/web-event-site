const book = window.ILLUSTRATION_BOOK;
const spread = document.getElementById("spread");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const position = document.getElementById("position");
const lightbox = document.getElementById("lightbox");
const zoomImage = document.getElementById("zoomImage");
const zoomCaption = document.getElementById("zoomCaption");
const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let screens = [];
let current = 0;
function pageHTML(item, side, n) {
  const desc = [item.comment, item.text].filter(Boolean).join(" — ");
  return `<article class="page art-page ${side}">
   <div class="art-image-area"><img class="art-image" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.comment || `イラスト ${n}`)}" data-full="${escapeHTML(item.image)}" data-caption="${escapeHTML(desc)}" tabindex="0" role="button" aria-label="イラスト ${n} を拡大"></div>
   ${item.comment ? `<p class="comment">${escapeHTML(item.comment)}</p>` : ""}
   ${item.text ? `<p class="extra-text">${escapeHTML(item.text)}</p>` : ""}
   <div class="number">${n}</div>
  </article>`;
}
function coverHTML(src, label) {return `<article class="page cover single"><img src="${escapeHTML(src)}" alt="${escapeHTML(label)}"></article>`;}
function rebuild() {
  const mobile = matchMedia("(max-width:700px)").matches;
  screens = [{label:"表紙", html:coverHTML(book.cover,"表紙")}];
  if (mobile) {
    book.pages.forEach((p,i)=>screens.push({label:`${i+1} / ${book.pages.length}`,html:pageHTML(p,"single",i+1)}));
  } else {
    for(let i=0;i<book.pages.length;i+=2){
      const right=pageHTML(book.pages[i],"right",i+1);
      const left=i+1<book.pages.length?pageHTML(book.pages[i+1],"left",i+2):'<article class="page left empty"></article>';
      screens.push({label:`${i+1}–${Math.min(i+2,book.pages.length)} / ${book.pages.length}`,html:left+right});
    }
  }
  screens.push({label:"裏表紙",html:coverHTML(book.back,"裏表紙")});
  current=Math.min(current,screens.length-1);render();
}
function render(){spread.innerHTML=screens[current].html;position.textContent=screens[current].label;prev.disabled=current===0;next.disabled=current===screens.length-1;}
prev.addEventListener("click",()=>{if(current>0){current--;render();}});
next.addEventListener("click",()=>{if(current<screens.length-1){current++;render();}});
function openPicture(el){zoomImage.src=el.dataset.full;zoomImage.alt=el.alt;zoomCaption.textContent=el.dataset.caption;lightbox.showModal();}
spread.addEventListener("click",e=>{const image=e.target.closest(".art-image");if(image)openPicture(image);});
spread.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".art-image")){e.preventDefault();openPicture(e.target);}});
document.getElementById("closeLightbox").addEventListener("click",()=>lightbox.close());
lightbox.addEventListener("click",e=>{if(e.target===lightbox)lightbox.close();});
window.addEventListener("keydown",e=>{if(lightbox.open)return;if(e.key==="ArrowLeft")next.click();if(e.key==="ArrowRight")prev.click();});
let wasMobile=matchMedia("(max-width:700px)").matches;
window.addEventListener("resize",()=>{const now=matchMedia("(max-width:700px)").matches;if(now!==wasMobile){wasMobile=now;current=0;rebuild();}});
rebuild();
