export default {
    environment: process.env.ENVIRONMENT as ('dev' | 'live' | 'beta' | 'api') || 'live',

    port: process.env.PORT || 8041,
    version: process.env.VERSION || '1.0.0',

    db: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '3306'),
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'mysql',
        database: process.env.DATABASE_DATABASE || 'resources'
    },

    ppk: {
        key: process.env.PPK_KEY || 'key',
        secret: process.env.PPK_SECRET || 'secret'
    },

    aws: {
        key: process.env.AWS_ACCESS_KEY_ID || 'key',
        secret: process.env.AWS_SECRET_ACCESS_KEY || 'secret',

        bucket: process.env.AWS_BUCKET || 'c19learningexchange.esd.org.uk'
    },

    search: {
        root: process.env.WEBSERVICES_ROOT || 'api.porism.com/ServiceDirectoryServiceCombined'
    },

    kHub: {
		key: 'DvBdO8i2UM4IYwu8+eXwDsYN95ldhIoZJlGoeBa4fKx8IWJoT6xO/mJ/zIcQ0xn2pTQhhYxyAllVv8H0obfJoUSCsX7T1esYB2DLa6E92bH90kpYtXqudQ8XkGE3UNxJZHn37RHM445i9ACHxZ0rti2tI3gBAfDlG3gJfAstS/M=',
		path: '/groups',
		secret: 'fIRR5n3ivimfQC04epKluN94e/ZtVcATeirhcBQfX4CHRAbQlLa7rtTrsADvOcTdDxTO4cC7a55ias+ZQFjP87EYrTWqBuq3jCWcEj4DASQpeaiGcrMFf0FwYy5g6QKkgwSb6Q6wSFoYBGXv+nIWbjuV28VWVGW1bKXalWRF7v4=',
		baseUrl: 'https://khub.net',
        contextPath: '/o/group.rest.application',
        resultsPerPage: 1000
    },

    kml: {
        localSavePath: `D:\\Projects\\porism.lga.learningExchangeMap\\docs`,
        checkInterval: 60 * 10
    }
};