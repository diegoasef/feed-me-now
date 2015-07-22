var yelp = {
    auth: {
        consumerKey: 'YOUR_CONSUMER_KEY', 
        consumerSecret: 'YOUR_CUSTOMER_SECRET',
        accessToken: 'YOUR_ACCESS_TOKEN',
        accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
    },
    rating: {
        0: 'images/stars_0.png',
        1: 'images/stars_1.png',
        1.5: 'images/stars_1_half.png',
        2: 'images/stars_2.png',
        2.5: 'images/stars_2_half.png',
        3: 'images/stars_3.png',
        3.5: 'images/stars_3_half.png',
        4: 'images/stars_4.png',
        4.5: 'images/stars_4_half.png',
        5: 'images/stars_4.png',
    },
    logo: 'images/yelp_logo_40x20.png'
};
yelp.accessor = {
    consumerSecret: yelp.auth.consumerSecret,
    tokenSecret: yelp.auth.accessTokenSecret
};
module.exports = yelp;