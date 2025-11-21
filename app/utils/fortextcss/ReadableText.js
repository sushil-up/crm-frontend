export function getReadableText(htmlString) {
  if (!htmlString) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  // Replace <br>, <p> with line breaks
  tempDiv.querySelectorAll("br, p").forEach(el => {
    el.insertAdjacentText("beforebegin", "\n");
  });

  // Replace list items with bullets
  tempDiv.querySelectorAll("li").forEach(li => {
    li.insertAdjacentText("beforebegin", "\n- ");
  });

  let text = tempDiv.textContent || tempDiv.innerText || "";

  // Cleanup
  text = text.replace(/\u00a0/g, " ")   // replace &nbsp;
             .replace(/\n\s*\n\s*\n+/g, "\n\n") // collapse too many newlines
             .replace(/[ \t]+/g, " ")   // collapse spaces
             .trim();

  return text;
}
