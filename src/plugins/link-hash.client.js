export default () => {
  if (!process.client) {
    return;
  }
  window.document.addEventListener('click', (e) => {
    const linkNode = e.target.closest('a[data-hash="true"]');
    if (linkNode) {
      e.preventDefault();
      const url = window.atob(linkNode.dataset.link);
      const linkTarget = linkNode.target || '_self';
      if (linkTarget === '_self') {
        setTimeout(() => {
          window.location.href = url;
        }, 0);
      } else {
        window.open(url, linkTarget);
      }
    }
  });
};
