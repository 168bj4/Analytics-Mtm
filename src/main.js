export default {
    _mtm: [],
    /**
    * Vue Plugin entry
    * options: {
    *     url: 'matomo url',
    *     id: 'tag manager container id'
    * }
    */
    install: function(Vue, options) {
        this._mtm = window._mtm = window._mtm || [];
        // check if matomo url and container id is defined
        if ( (typeof options == "undefined") || (typeof options.url == "undefined") || (typeof options.id == "undefined") || (typeof options.id == "number") ) {
            return;
        }
        this.init(options);
    },
    /**
    * Init Matomo Tag Manager
    * options: {
    *     url: 'matomo url',
    *     id: 'tag manager container id'
    * }
    */
    init: function(options) {
        this._mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});

        const d=document, 
              g=d.createElement('script'), 
              s=d.getElementsByTagName('script')[0];

        g.async=true; 
        g.src=`${options.url}/js/container_${options.id}.js`;
        s.parentNode.insertBefore(g,s);
    },
    /**
    * Bind SPA router function
    * options: {
    *     router: 'vue router instance'
    *     user: {
    *         id: 
    *         account:
    *     }
    * }
    */
    bind: function(options) {
        // check if vue router is loaded
        if ( (typeof options == "undefined") || (typeof options.router == "undefined") ) {
            return;
        }

        options.router.afterEach((to, from) => {
            const currentOptions = options.router.options.history || options.router.options,
                base = currentOptions.base.substring(0, currentOptions.base.length - 1),
                currentUrl = `${window.location.protocol}//${window.location.host}${base}${to.fullPath}`;

            let currentTitle = null,
                userId = null,
                userAccount = null,
                referrerUrl = document.referrer,
                loadTime = null;

            if (referrerUrl == "") {
                referrerUrl = null;
            }

            // if user id = 0, will be verifyed as none login user
            if (typeof options.user !== "undefined" && typeof options.user.id !== "undefined" && options.user.id !== 0) {
                userId = `${options.user.id.toString()}`;
            }

            if (typeof options.user !== "undefined" && typeof options.user.account !== "undefined") {
                userAccount = `${options.user.account.toString()}`;
            }

            if (from.name !== null) {
                referrerUrl = `${window.location.protocol}//${window.location.host}${base}${from.fullPath}`;
            }

            if (window.performance && window.performance.timing && window.performance.timing.domContentLoadedEventEnd && window.performance.timing.navigationStart) {
                loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            }

            // delay 0.5 second for title parse
            setTimeout(() => {
                currentTitle = `${document.title}`;
                this._mtm.push({
                event: "PageView",
                currentUrl: currentUrl,
                referrerUrl: referrerUrl,
                currentTitle: currentTitle,
                userId: userId,
                userAccount: userAccount,
                loadTime: loadTime,
                });
            }, 500);
        });
    },
    /**
    * Example {'Event8  Name', data}
    * data: {
    *   key: value,
    *   key2: value2,
    *   key3: [],
    * }
    */
    event: function(name, data) {
        let fireContent = { 'event': name };
        if (typeof data !== 'object') {
            data = {}
        }
        Object.assign(fireContent, data);
        this._mtm.push(fireContent);
    },
    /**
    * Example getRandomSerial('scott', 'scott1') general random order id example: scott-timestamp-scott1
    */
    getRandomSerial: function(prefix, postfix) {
        let response = '';
        const dateTime = new Date().getTime();
        const timestamp = Math.floor(dateTime / 1000);
        if (typeof prefix === 'string') {
            response += `${prefix}-`;
        }
        response += `${timestamp}`;
        if (typeof postfix === 'string') {
            response += `-${postfix}`;
        }
        return response;
    }
}