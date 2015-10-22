export default function menuMiddleware(state) {
  state.menu = Object.keys(state.siteMap)
    .map((index) => state.siteMap[index])
    .filter((page) => page.data && page.data.meta && page.data.meta.inMenu && page.data.meta.title)
    .map((page) => ({[page.data.meta.title]: page.nakedPath}) );

  return state;
}

menuMiddleware.contextAugmenter = function menu(state) {
  this.getMenu = () => state.menu;
};

menuMiddleware.api = function menuApi() {
  this.getMenu = () => {
    return this.getContext().then((context) => {
      const siteMap = context.getSiteMap();
      return Object.keys(siteMap)
        .map((index) => siteMap[index])
        .filter((page) => page.data && page.data.meta && page.data.meta.inMenu && page.data.meta.title)
        .map((page) => ({[page.data.meta.title]: page.nakedPath}));
    });
  };
};
