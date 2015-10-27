export default function createConfig(configObject) {
  if (configObject && typeof configObject !== 'object') {
    throw new Error(`createConfig expected a config object, got ${configObject}`);
  }

  function config() {
    this.getConfig = () => {
      return this.getContext().then((context) => {
        return context.config;
      });
    };
  }

  config.amendContext = () => configObject;

  return config;
}
