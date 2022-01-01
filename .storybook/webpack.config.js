const path = require('path');

module.exports = ({ config }) => {
  // a bunch of other rules here

  config.resolve.modules = [path.resolve(__dirname, '..', 'src'), 'node_modules'];

  // Alternately, for an alias:
  config.resolve.alias = {
    utils: path.resolve(__dirname, '..', 'src', 'utils'),
    components: path.resolve(__dirname, '..', 'src', 'components'),
    hooks: path.resolve(__dirname, '..', 'src', 'hooks'),
    types: path.resolve(__dirname, '..', 'src', 'types'),
    providers: path.resolve(__dirname, '..', 'src', 'providers'),
    consts: path.resolve(__dirname, '..', 'src', 'consts'),
  };

  return config;
};
