const { setHeadlessWhen, setCommonPlugins, setWindowSize } = require('@codeceptjs/configure')
const { readFileSync } = require('fs')
const { join } = require('path')

const environment = (process.env.ENVNAME || 'dev').toLowerCase()

// read the configuration based on the environment variable 'ENVNAME'
// if not set, default to 'dev'.
const environmentFile = readFileSync(
  join(__dirname, 'conf', `${environment}.json`)
)

const environmentConfig = JSON.parse(environmentFile)
const keys = Object.keys(environmentConfig.envVars)

// read values the environment variables, and replace them if present.
for (const key of keys) {
  const variableName = `${environment}_${key}`.toUpperCase()
  const variableValue = process.env[variableName]

  if (variableValue !== undefined) {
    environmentConfig.envVars[key] = variableValue
  }
}

// console.log(config)

setHeadlessWhen(environmentConfig.headless)

if (environmentConfig.headless) {
  setWindowSize(1024, 768)
}

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins()

const provider = environmentConfig.provider.toLowerCase()
let helper
let plugins

switch (provider) {
  case 'testcafe': {
    helper = {
      TestCafe: {
        url: environmentConfig.testUrl,
        browser: environmentConfig.browser,
        show: true
      }
    }

    plugins = {}
    break
  }
  default: {
    helper = {
      WebDriver: {
        url: environmentConfig.testUrl,
        browser: environmentConfig.browser
      }
    }

    plugins = {
      wdio: {
        enabled: true,
        services: ['selenium-standalone']
      }
    }
    break
  }
}

exports.config = {
  tests: './specs/*.js',
  output: './output',
  helpers: helper,
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {
    reporterOptions: {
      reportDir: 'output'
    }
  },
  name: 'tmm-interview-poc',
  plugins: plugins,
  environmentConfig
}
