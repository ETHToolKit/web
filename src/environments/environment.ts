// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dropperAddress:"0xC6c2e5a86569B8107Be86AFe9D3fAD01d895c488",
  dropperAddressMainnet:"0x7f12D6e6c2E3b608A01e4dEf372921da2B3C471B",
  testToken:"0x75d0462e6ebd792d2873d4d3c0710df326d4ba17",
  etherscanTx:"https://rinkeby.etherscan.io/tx/",
  etherscanTxMainnet:"https://etherscan.io/tx/",
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  }
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
