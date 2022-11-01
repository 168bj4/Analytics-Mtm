# Analytics

This plugin is used to install analytics functions for frontend nuxt projects, must used with /site.js included

# Before Install

Must check the /site.js is included.

Step 1. For develop, you can create static/site.js as follow content. (Required)
```
var _jsvar = {};
_jsvar.siteId = 168;
_jsvar.siteType = 'forum';
_jsvar.siteLocale = 'zh_cn';
_jsvar.siteAnalyticsUrl = 'https://analytcis.dingyi.io';
_jsvar.siteAnalyticsId = 1;
window._jsvar = _jsvar;
```

NUXT / Step 2. Install /site.js in nuxt.config (Required)
```
...
script: {
...
{ src: '/site.js' },
...
},
,,,
```
VUE-CLI / Step 2. Create site.js in public/site.js (Required)

# Registry Setup

### https://git.dingyi.io/help/user/packages/npm_registry/index
```
# Set URL for your scoped packages.
# For example package with name `@frontend/analytics` will use this URL for download
npm config set @frontend:registry https://git.dingyi.io/api/v4/packages/npm/

# Add the token for the scoped packages URL. This will allow you to download
# `@frontend/` packages from private projects.
# You can find persion_token on your profile page, and replace the <your_token> as follow.
npm config set '//git.dingyi.io/api/v4/packages/npm/:_authToken' "<your_token>"
```

# NUXT Setup

After install the package, you should do things follow.

Step 1. Create plugin file name plugins/analytics.js (Required)
```
import Vue from 'vue';
import Analytics from '@frontend/analytics';

Vue.use(Analytics);

export default ({ app }) => {
  const options = {
    router: app.router,
    user: app.store.state.user
  }
  Analytics.bind(options)
};

```

Step 2. Setting analytics plugin in nuxt.config.js (Required)
```
...
/*
** Plugins to load before mounting the App
** https://nuxtjs.org/guide/plugins
*/
plugins: [
  ...
  '@/plugins/analytics',
],
...

```

Step 3. On the page you want to track some event (Optional)
```
import Tracker from '@frontend/analytics';

## Example

Tracker.event('Envelope', 'click', 'button1', 1000);

```

# VUE-CLI Setup

After install the package, you should do things follow.

Step 1. Create file name src/analytics.js (Required)
```
import router from './router'
import store from './store'
import Analytics from '@frontend/analytics'

Analytics.init()
const options = {
  router: router,
  user: store.getters.userInfo
}
Analytics.bind(options)

```

Step 2. Setting analytics import in src/main.js (Required)
```
...
import './analytics' // import analytics plugin
...

```

Step 3. On the page you want to track some event (Optional)
```
import Tracker from '@frontend/analytics';

## Example

Tracker.event('Envelope', 'click', 'button1', 1000);

```