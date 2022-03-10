/* eslint-disable no-undef -- framework automatically recognizes functions Feature, secret, scenario, tag, etc. */
const { config } = require('../codecept.conf')
const { envVars } = config.environmentConfig

function goToLogin (I) {
  I.resizeWindow('maximize')
  I.amOnPage('/')
  I.waitForVisible('.btn-signin', envVars.assertionTimeout)
  I.click('#cookiescript_accept')
  I.click('.btn-signin')
}

function enterCredentials (I, username, password = '') {
  I.waitForVisible('#phoneNo', envVars.assertionTimeout)
  I.fillField('#phoneNo', username)

  if (password) {
    I.fillField('#password', secret(password))
  }

  I.click('#checkLogin')
}

exports.enterCredentials = enterCredentials
exports.goToLogin = goToLogin
