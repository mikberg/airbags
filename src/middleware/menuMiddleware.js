function generateMenu(state) {
  return Object.keys(state.siteMap)
    .map((index) => state.siteMap[index])
    .filter((page) => page.data && page.data.meta && page.data.meta.inMenu && page.data.meta.title)
    .map((page) => ({[page.data.meta.title]: page.nakedPath}) );
}

export default function menu() {
  this.getMenu = () => {
    return this.getContext().then((context) => {
      return generateMenu(context);
    });
  };
}
