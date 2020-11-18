
// import connect interface
import fetch from 'node-fetch';
import { Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class FacebookConnect extends Struct {
  /**
   * construct stripe connector
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);

    // bind methods
    this.saveAction = this.saveAction.bind(this);
    this.confirmAction = this.confirmAction.bind(this);
  }

  /**
   * returns connect type
   */
  get type() {
    // return connect type label
    return 'facebook';
  }

  /**
   * returns connect type
   */
  get title() {
    // return connect type label
    return 'Facebook';
  }

  /**
   * returns connect icon
   */
  get icon() {
    // return connect icon label
    return 'fab fa-facebook';
  }

  /**
   * returns connect data
   */
  get data() {
    // return connect data
    return {
      protected : ['secret'],
    };
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      auth   : 'connect/facebook/auth',
      config : 'connect/facebook/config',
    };
  }

  /**
   * returns connect actions
   */
  get actions() {
    // return connect actions
    return {
      save    : this.saveAction,
      confirm : this.confirmAction,
    };
  }

  /**
   * returns category list for connect
   */
  get categories() {
    // return array of categories
    return ['auth'];
  }

  /**
   * returns connect descripton for list
   */
  get description() {
    // return description string
    return 'Facebook Connector';
  }

  /**
   * action method
   *
   * @param param0 
   * @param connect 
   * @param data 
   */
  async saveAction({ req, dashup, connect : oldConnect }, connect = {}) {
    // check dashup
    if (!dashup) return;

    // check secret
    if (connect.secret === 'SECRET') {
      // secret
      connect.secret = oldConnect.secret;
    }

    // return connect
    return { connect };
  }

  /**
   * action method
   *
   * @param param0 
   * @param connect 
   * @param data 
   */
  async confirmAction({ req, dashup, session }, connect) {
    // check dashup
    if (!dashup) return;

    // confirm
    const confirm = await fetch(`https://graph.facebook.com/v8.0/oauth/access_token?
client_id=${connect.client}
&redirect_uri=${encodeURIComponent(`${this.dashup.config.url}/connect/facebook`)}
&client_secret=${connect.secret}
&code=${req.body.code || req.query.code}`.split('\n').join(''));
    
    // await JSON
    const { access_token, token_type, expires_in } = await confirm.json();

    // get profile
    const profile = await fetch(`https://graph.facebook.com/me
?fields=id,name,email
&access_token=${access_token}`.split('\n').join(''));

    // get profile
    const actualProfile = await profile.json();

    // emit message
    this.dashup.connection.rpc('create.auth', {
      name     : actualProfile.name,
      email    : actualProfile.email,
      username : actualProfile.email,

      _hidden : {
        id      : actualProfile.id,
        type    : 'facebook',
        token   : access_token,
        expires : expires_in,
      }
    }, connect, session);

    // return true
    return true;
  }
}