let env = process.env.NODE_ENV || 'development'

if(env === 'development' || env === 'test') {
    //carica json file
    const config = require('./config.json')
    const envConfig = config[env]

    //Object.keys(envConfig) => creates array of keys ['PORT', 'MONGODB_URI']
    Object.keys(envConfig).forEach( (key) => {
        process.env[key] = envConfig[key]
    })

}