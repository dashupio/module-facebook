// require first
const { Module } = require('@dashup/module');

// import base
const FacebookConnect = require('./connects/facebook');

/**
 * export module
 */
class FacebookModule extends Module {

  /**
   * construct discord module
   */
  constructor() {
    // run super
    super();
  }
  
  /**
   * Register interfaces here
   */
  register(fn) {
    // register discord connect
    fn('connect', FacebookConnect);
  }
}

// create new
module.exports = new FacebookModule();
