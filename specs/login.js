/* eslint-disable no-undef -- framework automatically recognizes functions Feature, secret, scenario, tag, etc. */
const { goToLogin, enterCredentials } = require('../actions/login.actions')
const { config } = require('../codecept.conf')
const { envVars } = config.environmentConfig

Feature('Login Page')

Scenario('I can sign in successfully', async ({ I }) => {
  goToLogin(I)
  enterCredentials(I, envVars.username, envVars.password)

  I.waitForVisible('.home_head', envVars.assertionTimeout)
  I.see('HI, DYLAN', '.home_head')
}).tag('smokeTest')

Scenario('Password Field Should not be susceptible to SQL injection', async ({ I }) => {
  const suspiciousString = '\'; DECLARE @DropConstraints NVARCHAR(max) = \'\' SELECT @DropConstraints += \'ALTER TABLE \' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + \'.\' + QUOTENAME(OBJECT_NAME(parent_object_id)) + \' \' + \'DROP CONSTRAINT\' + QUOTENAME(name) FROM sys.foreign_keys EXECUTE sp_executesql @DropConstraints; GO DECLARE @DropTables NVARCHAR(max) = \'\' SELECT @DropTables += \'DROP TABLE \' + QUOTENAME(TABLE_SCHEMA) + \'.\' + QUOTENAME(TABLE_NAME) FROM INFORMATION_SCHEMA.TABLES EXECUTE sp_executesql @DropTables; GO --'

  goToLogin(I)
  enterCredentials(I, envVars.username, suspiciousString)

  I.waitForVisible('.swal2-confirm', envVars.assertionTimeout)
  I.click('.swal2-confirm')

  enterCredentials(I, envVars.username, envVars.password)

  I.waitForVisible('.home_head', envVars.assertionTimeout)
  I.see('HI, DYLAN', '.home_head')
}).tag('destructive')

Scenario('Mobile number field does not accept invalid options', async ({ I }) => {
  goToLogin(I)
  enterCredentials(I, '1')
  I.see('Your phone number must consist of at least 11 characters', '#phoneNo-error')
  enterCredentials(I, '11111111111')
  I.see('This is not a valid UK mobile number', '#phoneNo-error')
}).tag('smokeTest')
