const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


const eventFactoryPath = path.resolve(__dirname, 'contracts', 'EventFactory.sol');
const source = fs.readFileSync(eventFactoryPath, 'utf8');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

var input = {
  language: 'Solidity',
  sources: {
    'contracts/EventFactory.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

function findImports(path) {
  if (path === 'lib.sol')
    return {
      contents:
        'library L { function f() internal returns (uint) { return 7; } }'
    };
  else return { error: 'File not found' };
}

// New syntax (supported from 0.5.12, mandatory from 0.6.0)
var output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

for (let contract in output) {
  console.log(contract);
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}