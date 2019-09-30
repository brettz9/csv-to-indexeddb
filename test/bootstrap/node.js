// eslint-disable-next-line no-shadow
const {expect} = require('chai');

// See test file on why requiring here
const setGlobalVars = require('indexeddbshim');
const {getSuccess, cleanupDatabases} = require('./utils.js');
const {importCSVToIndexedDB, importJSONToIndexedDB} = require('../../');

global.setGlobalVars = setGlobalVars;
global.getSuccess = getSuccess;
global.cleanupDatabases = cleanupDatabases;
global.importCSVToIndexedDB = importCSVToIndexedDB;
global.importJSONToIndexedDB = importJSONToIndexedDB;

global.expect = expect;

// Needed by IndexedDB
global.location = {origin: 'http://localhost:8010'};
setGlobalVars();
