/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const pascalCase = str =>
  str
    .replace(/(\w)(\w*)/g, function (g0, g1, g2) {
      return g1.toUpperCase() + g2.toLowerCase();
    })
    .replace(/\W/g, '');

const getBarrelFileContent = ({ folderPath, exportDefault, exportAll, exportExtra, transformCasing }) => {
  const directChildren = fs.readdirSync(path.resolve(__dirname, folderPath));

  const getImportDeclaration = file => {
    if (file === 'index.ts') return '';

    const fileName = file.split('.')[0];

    const componentName = transformCasing ? transformCasing(fileName) : fileName;

    const defaultExport = `export { default as ${componentName} } from './${fileName}';`;
    const allExport = `export * from './${fileName}';`;
    const extraExport = exportExtra?.(componentName, fileName);

    return [exportDefault && defaultExport, exportAll && allExport, extraExport && extraExport]
      .filter(Boolean)
      .join('\n');
  };

  const importDeclarations = directChildren.map(getImportDeclaration).filter(Boolean).join('\n') + '\n';

  return importDeclarations;
};

const targets = [
  { folderPath: '../src/components', exportDefault: false, exportAll: true },
  { folderPath: '../src/hooks', exportDefault: false, exportAll: true },
  { folderPath: '../src/utils', exportDefault: false, exportAll: true },
];

targets.forEach(config => {
  fs.writeFileSync(
    path.resolve(__dirname, config.indexHostingFolderPath ?? config.folderPath, 'index.ts'),
    getBarrelFileContent(config)
  );
});
