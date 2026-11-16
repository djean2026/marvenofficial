const BADGE = /powered by netlify|deploys by netlify/i;

function hint(element) {
  return [
    element.getAttribute("alt"),
    element.getAttribute("aria-label"),
    element.getAttribute("title"),
    element.id,
    typeof element.className === "string" ? element.className : "",
    element.getAttribute("href"),
    element.getAttribute("src"),
  ]
    .filter(Boolean)
    .join(" ");
}

function isBadge(element) {
  if (!(element instanceof Element) || element.closest("#root")) return false;
  const label = hint(element);
  if (BADGE.test(label) || /netlify-badge|netlify-drawer/i.test(label)) return true;
  const ownText = [...element.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join(" ");
  return BADGE.test(ownText);
}

function removeBadge(element) {
  const host = element.parentElement;
  if (host && host !== document.body && host !== document.documentElement && !host.closest("#root") && host.childElementCount <= 2) {
    host.remove();
    return;
  }
  element.remove();
}

export function hideNetlifyBadge(root = document) {
  const scope = root.querySelectorAll ? root : document;
  scope.querySelectorAll("a, img, iframe, div, span, button").forEach((element) => {
    if (isBadge(element)) removeBadge(element);
  });
}

export function watchNetlifyBadge() {
  hideNetlifyBadge();
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.target instanceof Element && record.target.closest("#root")) continue;
      record.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (isBadge(node)) removeBadge(node);
        else hideNetlifyBadge(node);
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 20000);
}
