var UI              = require('ui'),
    Accel           = require('ui/accel'),
    ajax            = require('ajax'),
    Vector2         = require('vector2'),
    Vibe            = require('ui/vibe'),
    OAuth           = require('./oauth'),
    yelp            = require('./yelp'),
    utils           = require('./utils'),
    items           = [],
    currentItem     = 0,
    currentLocation = {},
    card            = new UI.Card({style: 'small', scrollable: true, icon: yelp.logo});

//Welcome Screen
var wind      = new UI.Window({ fullscreen: true });
var imageLogo = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    image: 'images/logo.png'
});
wind.add(imageLogo);
wind.show();
card.on('click', 'select', function() {
    Pebble.openURL(items[currentItem].mobile_url);
});

//Request user location (phone)
navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {timeout: 15000, maximumAge: 60000});    

function onLocationError(data) {
    console.log('Location error');
}

//Request data to Yelp API (3rd party API)
function onLocationSuccess(geolocation){
    var terms                     = 'Food';
        currentLocation.latitude  = geolocation.coords.latitude;
        currentLocation.longitude = geolocation.coords.longitude;

    var parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['ll', currentLocation.latitude + "," + currentLocation.longitude]);
    parameters.push(['radius_filter', 300]);
    parameters.push(['sort', 1]);
    parameters.push(['oauth_consumer_key', yelp.auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', yelp.auth.consumerSecret]);
    parameters.push(['oauth_token', yelp.auth.accessToken]);

    var message = { 
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };
    
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, yelp.accessor);

    var parameterMap             = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
    var url                      = OAuth.addToURL(message.action,parameterMap);

    ajax({url: url, type: 'json'}, displayResults, displayAPIError);
}

function displayAPIError(error) {
    console.log('API error');
}

function displayResults(data) {
    Accel.init();
    items = data.businesses;
    updateCard();
    card.show();    
    wind.hide();
    Accel.on('tap', function(e) {
        console.log('currentItem: ', currentItem, 'items.length: ', items.length);
        if ((currentItem + 1) < items.length) {
            currentItem++;
        } else {
            currentItem = 0;
        }
        updateCard();
        Vibe.vibrate('short');
    });
}

function updateCard() {
    console.log('updateCard currentItem: ', currentItem);
    var business = items[currentItem];
    
    card.subicon(yelp.rating[business.rating]);
    card.title(business.name);  
    card.subtitle('('+ business.review_count +')');

    var bodyContent = 'Distance: ' + utils.distance(
        currentLocation.latitude, currentLocation.longitude,
        business.location.coordinate.latitude, business.location.coordinate.longitude
    );
    bodyContent += '\nAddress: ' + business.location.address;
    bodyContent += '\nCategories: ' + utils.parseCategories(business.categories);
    bodyContent += '\nPhone: ' + business.phone;
    bodyContent += '\n"' + business.snippet_text + '"';
    card.body(bodyContent);
}