class AirbagsApi {
  getPage(path) {
    return new Promise((resolve) => {
      resolve({
        content: '*Hi*, I am **content**!',
        path,
        frontMatter: {
          title: 'Colophon',
          tags: ['About', 'Cool', 'Awesome']
        }
      });
    });
  }
}

export default new AirbagsApi();
