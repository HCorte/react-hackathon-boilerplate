<div align="center"><strong>Start your next react project in seconds</strong></div>
<div align="center">A highly scalable, offline-first foundation with the best DX and a focus on performance and best practices</div>
<div align="center"><strong>NOT for novices.</strong></div>

# Under construction

Caveat Emptor: This project is still in the alpha phase.

Pull requests are welcome.

# Table of Contents

1. [Background](#background)
1. [Features](#features)
1. [Quick Start](#quick-start)
1. [Application Structure](#application-structure)
1. [Development](#development)
  1. [Developer Tools](#developer-tools)
  1. [Routing](#routing)
1. [License](#license)

# Background

A hackathon ready boilerplate, with authentication best practices included.
The focus of the project is to allow programmers to focus only business logic and the user interface, everything else should ideally be in place.

This project created:

* *boilerplate free redux*
* an *auto-adapting API* by integrating redux actions with
  * commands and queries sent over sockets to the server, and
  * events sent to the app
* only *pure functional react* components needed

by standing on the shoulders of giants:

* the biggest chunk comes from [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate)
* with redux-sagas replaced with [redux-observable](https://github.com/redux-observable/redux-observable)
* and changed to the routing structure of [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit)


# Features

<dl>
  <dt>Auto-adapting API: Redux actions integrated with CQRS-ES over sockets</dt>
  <dd>You simply create `COMMAND` or `QUERY` type redux action, and redux-observable will automatically create the corresponding socket call for you (with authentication added). Events sent from the server, are converted into corresponding redux actions. This means the whole API is already in place to adapt as the needs of your program change -- no code needed.</dd>

  <dt>Redux without boilerplate</dt>
  <dd>Because of the way the API has been created, there is no need for boilerplate in redux, instead you just define the reducers and epics you want.<dt>

  <dt>Pure functional react</dt>
  <dd>The router is coupled to redux-observable to emit route changes as redux actions. Per route epics can be created to listen to specific route emitted, and so call side effects, eg, fetch. Together with [recompose](https://github.com/acdlite/recompose) there is no need for lifecycle methods, and so only pure functional react code is possible.</dd>

  <dt>Instant feedback</dt>
  <dd>Enjoy the best DX (Developer eXperience) and code your app at the speed of thought! Your saved changes to the CSS and JS are reflected instantaneously without refreshing the page. Preserve application state even when you update something in the underlying code!</dd>

  <dt>Predictable state management</dt>
  <dd>Unidirectional data flow allows for change logging and time travel debugging.</dd>

  <dt>Next generation JavaScript</dt>
  <dd>Use template strings, object destructuring, arrow functions, JSX syntax and more, today.</dd>

  <dt>Next generation CSS</dt>
  <dd>Write composable CSS that's co-located with your components for complete modularity. Unique generated class names keep the specificity low while eliminating style clashes. Ship only the styles that are on the page for the best performance.</dd>

  <dt>Industry-standard routing</dt>
  <dd>It's natural to want to add pages (e.g. `/about`) to your application, and routing makes this possible.</dd>

  <dt>Industry-standard i18n internationalization support</dt>
  <dd>Scalable apps need to support multiple languages, easily add and support multiple languages with `react-intl`.</dd>

  <dt>Offline-first</dt>
  <dd>The next frontier in performant web apps: availability without a network connection from the instant your users load the app.</dd>

  <dt>SEO</dt>
  <dd>We support SEO (document head tags management) for search engines that support indexing of JavaScript content. (eg. Google)</dd>
</dl>

But wait... there's more!

  - *The best test setup:* Automatically guarantee code quality and non-breaking
    changes. (Seen a react app with 99% test coverage before?)
  - *Native web app:* Your app's new home? The home screen of your users' phones.
  - *The fastest fonts:* Say goodbye to vacant text.
  - *Stay fast*: Profile your app's performance from the comfort of your command
    line!
  - *Catch problems:* AppVeyor and TravisCI setups included by default, so your
    tests get run automatically on Windows and Unix.

<sub><i>Keywords: React.js, Redux, Hot Reloading, ESNext, Babel, react-router, Offline First, ServiceWorker, styled-components, redux-observable, FontFaceObserver, CQRS-ES</i></sub>

# Quick start

1. Clone this repo using `git clone --depth=1 https://github.com/Jan-Jan/react-hackathon-boilerplate <your-project-name>`
1. Enter your project `cd <your-project-name>`
1. Install dependencies `npm install`.<br />
   *We auto-detect `yarn` for installing packages by default, if you wish to force `npm` usage do: `USE_YARN=false npm install`*<br />
1. Install [Redis](https://redis.io/)
1. Install [MongoDB](https://www.mongodb.com/download-center)
1. At this point you can run `DEBUG=boilerplate npm start` to see the example app at `http://localhost:3000`.

Now you're ready to rumble!

**At the moment, when you load at npm package for the backend, you need to add that to `internals/config.js` for exclusion from the dll build.**

> Please note that this boilerplate is **production-ready and not meant for beginners**! If you're just starting out with react or redux, please refer to https://github.com/petehunt/react-howto instead. If you want a solid, battle-tested base to build your next product upon and have some experience with react, this is the perfect start for you.

# Application Structure

Tests are co-located in `tests` directories everywhere.

```
.
├── app                        # App source code
│   ├── components             # Global Reusable Presentational Components
│   ├── containers             # Global Reusable Container Components
│   ├── layouts                # Components that dictate major page structure
│   ├── modules                # Reducers and epics that globally used
│   ├── PropTypes              # Definitions of immutable react PropTypes
│   ├── routes                 # Main route definitions and async split points
│   │   ├── index.js           # Bootstrap main application routes with store
│   │   ├── Home               # Fractal route
│   │   │   ├── index.js       # Route definitions and async split points
│   │   │   ├── assets         # Assets required to render components
│   │   │   ├── components     # Presentational React Components
│   │   │   └── routes **      # Fractal sub-routes (** optional)
│   │   └── Counter            # Fractal route
│   │       ├── index.js       # Counter route definition
│   │       ├── container      # Connect components to actions and store
│   │       ├── modules        # Collections of reducers/constants/actions
│   │       └── routes **      # Fractal sub-routes (** optional)
│   ├── translations           # Result of $ npm run extract-intl
│   ├── utils                  # Utility functions
│   ├── .htaccess              # Proposed setup for Apache
│   ├── .nginx.conf            # Proposed setup for nginx
│   ├── app.js                 # Bootstrap and rendering of app
│   ├── favicon.ico            # Icon used in browser tab of app
│   ├── global-styles.js       # Global style for app
│   └── i18n.js                # Setup the i18n language files and locale data for app
│   ├── index.html             # Main HTML page container for app
│   └── manifest.json          # Manifest used for Progressive Web App definition
│   ├── reducers.js            # Combine all reducers, then export
│   ├── rootEpic.js            # Define rootEpic visa vi redux-observable
│   └── store.js               # Create the store with asynchronously loaded reducers and epics
├── build                      # Target for the build scripts
├── coverage                   # Output $ npm run analyze
├── docs                       # Old react-boilerplate docs
├── internals                  # Old react-boilerplate docs
│   ├── generators             # Deprecated
│   ├── mocks                  #
│   ├── scripts                # Host npm scripts
│   ├── testing                # Testing setup
│   ├── webpack                # Webpack definitions
│   └── config.js              # Config for dllPlugin
├── server                     #
│   ├── commands               # All command definitions and access config
│   ├── middleware             # Middleware
│   ├── models                 # Data model definitions
│   ├── queries                # All query definitions and access config
│   ├── utils                  # Utility functions
│   ├── index.js               # Define server, and load middleware
│   └── logger.js              # Pretty logging used by server and webpack
└── shared                     # Files that are required by both app and server
```

# Old react-boilerplate Documentation

- [**The Hitchhikers Guide to `react-boilerplate`**](docs/general/introduction.md): An introduction for newcomers to this boilerplate.
- [Overview](docs/general): A short overview of the included tools
- [**Commands**](docs/general/commands.md): Getting the most out of this boilerplate
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Your app](docs/js): Supercharging your app with Routing, Redux, simple
  asynchronicity helpers, etc.

# Development



# License

This project is licensed under the MIT license, Copyright (c) 2017 Dr. Jan-Jan van der Vyver. For more information see `LICENSE.md`.
