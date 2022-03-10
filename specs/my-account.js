/* eslint-disable no-undef -- framework automatically recognizes functions Feature, secret, scenario, tag, etc. */
const { goToLogin, enterCredentials } = require('../actions/login.actions')
const { config } = require('../codecept.conf')
const { envVars } = config.environmentConfig
const { readFileSync } = require('fs')
const { join } = require('path')

function randString () {
  return Math.random().toString(36).replace(/[^a-z]+/g, '')
}

function goToAccountDetails (I) {
  I.waitForVisible('.home_head', envVars.assertionTimeout)
  I.click('.account > a:nth-child(1)')
  I.click(locate('a').withChild('li').withText('My account'))

  const accountDetails = locate('a').withText('Account details')
  I.waitForVisible(accountDetails, envVars.assertionTimeout)
  I.click(accountDetails)
}

Feature('My Account')

Background(({ I }) => {
  goToLogin(I)
  enterCredentials(I, envVars.username, envVars.password)
})

Scenario('I can update my e-mail', ({ I }) => {
  goToAccountDetails(I)
  I.waitForVisible('#email', envVars.assertionTimeout)
  I.fillField('#email', `${randString()}@dylaneddies.co.uk`)
  I.click('#update_profile')

  I.waitForVisible('#swal2-content', envVars.assertionTimeout)
  I.see('Your account has been updated.', '#swal2-content')
})

Scenario('I cannot use invalid email addresses to perform an e-mail update', ({ I }) => {
  const badEmails = JSON.parse(readFileSync(
    join(__dirname, 'files', 'badEmails.json')
  ))

  goToAccountDetails(I)
  I.waitForVisible('#email', envVars.assertionTimeout)

  for (const sut of badEmails.emails) {
    I.fillField('#email', sut.email)
    I.click('#update_profile')
    I.waitForVisible('#error-otp', envVars.assertionTimeout)
    I.see(sut.validationMessage, '#error-otp')
    I.fillField('#email', '')
    I.click('#update_profile')
  }
})
