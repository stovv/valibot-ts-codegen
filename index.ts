import { Command } from 'commander';
import { Project } from 'ts-morph';
import { writeFile } from 'fs/promises';
import packageInfo from './package.json';

const uniq = (arr: string[]) => arr.filter((value, index, array) => array.indexOf(value) === index);

const importsTemplate = (imports: string[]) => `import {${uniq(imports).join(', ')}} from 'valibot';\n\n`;
const schemaTemplate = (schemaName: string, schemaBody: string) => `export const ${schemaName} = ${schemaBody};\n\n`;


export const generateSchemas = async (files: string, resultPath: string) => {
  const project = new Project({});
  project.addSourceFilesAtPaths(files);


  const imports: string[] = [];
  let generated = ``;

  for (let file of project.getSourceFiles()) {
    for (let typee of file.getTypeAliases()) {
      const name = typee.getStructure().name;
      if (typeof typee.getStructure().type !== 'string') continue;

      const body = (typee.getStructure().type as string)
        /* Simple types */
        .replace(/string/g, () => {
          imports.push('string');
          return 'string()';
        })
        .replace(/number/g, () => {
          imports.push('number');
          return 'number()';
        })
        .replace(/bigint/g, () => {
          imports.push('bigint');
          return 'bigint()';
        })
        .replace(/boolean/g, () => {
          imports.push('boolean');
          return 'boolean()';
        })
        .replace(/null/g, () => {
          imports.push('nullType');
          return 'nullType()';
        })
        .replace(/symbol/g, () => {
          imports.push('symbol');
          return 'symbol()';
        })
        .replace(/undefined/g, () => {
          imports.push('undefinedType');
          return 'undefinedType()';
        })
        .replace(/any/g, () => {
          imports.push('any');
          return 'any()';
        })
        .replace(/never/g, () => {
          imports.push('never');
          return 'never()';
        })
        .replace(/unknown/g, () => {
          imports.push('unknown');
          return 'unknown()';
        })
        .replace(/void/g, () => {
          imports.push('void');
          return 'void()';
        })
        /* Complex types */
        .replace(/(\s+)(.+)\:(.+)\[\]/g, (match: string, space, name, content) => {
          imports.push('array');
          return `${space}${name}: array(${content.trim()})`;
        })
        .replace(/(\{.+\})/gs, (match: string, content) => {
          imports.push('object');
          return `object(${content})`;
        })
        .replace(/date/g, () => {
          imports.push('date');
          return `date()`;
        })
        .replace(/Map<(.+)>/g, (match, content) => {
          imports.push('map');
          return `map(${content})`;
        })
        .replace(/Record<(.+)>/g, (match, content) => {
          imports.push('record');
          return `record(${content})`;
        })
        .replace(/Set<(.+)>/g, (match, content) => {
          imports.push('set');
          return `set(${content})`;
        })
        .replace(/\[(.+)\]/g, (match, content) => {
          imports.push('tuple');
          return `tuple(${content})`;
        })
        .replace(/(.+):((.+)(\s|)\|)+(\s|)(.+)/g, (match, param) => {
          console.log(match);
          const items = match.split(':')[1].split('|').map((item) => item.trim().replace(';', ''));
          imports.push('union');
          return `${param}: union([${items.join(',')}]),`;
        })
        .replace(/\;/g, ',');

      generated += schemaTemplate(name, body);
    }
  }


  generated = importsTemplate(imports) + generated;
  await writeFile(resultPath, generated);
}

const program = new Command();


program
  .name(packageInfo.name)
  .description(packageInfo.description)
  .version(packageInfo.version)
  .requiredOption('--path <glob pattern>', 'File glob')
  .requiredOption('--result <result file path>', 'Result schema file path')
  .parse();

const options = program.opts();

generateSchemas(options.path, options.result)
  .then(() => {
    console.info('Valibot schema generated ✨\nHappy coding!')
  })
  .catch((e) => {
    console.error('Valibot schema generated Fail!');
    console.error(e);
  })