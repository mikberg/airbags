export default function menuMiddleware(state) {
  state.menu = Object.keys(state.siteMap)
    .map((index) => state.siteMap[index])
    .filter((page) => page.meta && page.meta.inMenu && page.meta.title)
    .map((page) => ({[page.meta.title]: page.nakedPath}) );

  return state;
}

menuMiddleware.contextAugmenter = function menu(state) {
  this.getMenu = () => state.menu;
};
