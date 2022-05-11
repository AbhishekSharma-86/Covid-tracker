
module.exports = function override(config, env) {
    console.log("Running config-overrides.js");
    const paths = require('react-scripts-ts/config/paths');
    console.log(paths);
    let rules = config.module.rules;
    //let paths = config._paths;
    let oneOf = rules[3].oneOf;
    oneOf.splice(0, 0, {
        test: /\.worker\.ts$/,
        include: paths.appSrc,
        use: [ 'worker-loader', {
            loader: require.resolve('ts-loader'),
            options: {
                transpileOnly: true,
            }
        }
    ]});

    config.output.globalObject = 'this';

    return config;
}