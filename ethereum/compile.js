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

var output = JSON.parse(solc.compile(JSON.stringify(input)));


for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}