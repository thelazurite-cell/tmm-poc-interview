
to run: 
- node js >= 14.17.x 
- to install dependencies `npm i`
- run the command to run the test suite with reporting `npm run codeceptjs -- --reporter mochawesome`
- run the codecept ui with `npm run codeceptjs:ui`

Add env variables:
`DEV_USERNAME` and `DEV_PASSWORD`

Optionally set `ENVNAME` to CI or DEV
if set to CI create env variables `CI_USERNAME` and `CI_PASSWORD`

Note: The Workflow via github actions was not done within the 3 hour time slot, but I wanted to give it a go anyway :)
