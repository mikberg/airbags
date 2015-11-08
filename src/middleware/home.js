export default () => {
  function home() {

  }

  home.amendContext = (context) => {
    const siteMap = context.siteMap;
    const homes = Object.keys(context.siteMap)
      .map(key => context.siteMap[key])
      .filter(page => page.data && page.data.meta)
      .filter(page => page.data.meta.home);

    if (homes.length > 1) {
      throw new Error('More than one home is defined');
    }

    if (homes.length === 0) {
      return { siteMap };
    }

    siteMap.index = {
      nakedPath: 'index',
      originalPath: homes[0].originalPath,
      data: {
        meta: Object.assign({}, homes[0].data.meta),
        html: homes[0].data.html,
      },
    };

    Object.assign(siteMap.index.data.meta, {
      inMenu: true,
    });

    return { siteMap };
  };

  return home;
};
