# etymo
A demonstration program that uses a third party API as a delegate, for use as a teaching resource.

The purpose of the application is to demonstrate how to create a facade API that uses a third party API internally. In this case the application uses the Oxford Dictionary API found at: https://developer.oxforddictionaries.com.

##Installation

``npm install``

##Required environment variables

- `APP_ID`, the application ID provided OxfordDictionaries.com, upon registration
- `API_KEY`, the api key token provided by OxfordDictionaries.com, upon registration

##Testing

``npm test``

The tests will fail when the environment variables are not set.