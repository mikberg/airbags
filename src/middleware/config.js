export default function createConfig(configObject) {
  if (configObject && typeof configObject !== 'object') {
    throw new Error(`createConfig expected a config object, got ${configObject}`);
  }

  function config() {
    if (configObject) {
      if (!this.context) {
        this.context = {};
      }

      this.context.config = configObject;
    }

    this.getConfig = () => {
      return this.getContext().then((context) => {
        return context.config;
      });
    };
  }

  return config;
}
