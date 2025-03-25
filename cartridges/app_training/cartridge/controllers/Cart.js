'use strict';

var server = require('server');
server.extend(module.superModule);

var BasketMgr = require('dw/order/BasketMgr');
var Site = require('dw/system/Site');

server.append('Show', function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var cartTotal = currentBasket.totalGrossPrice.value;
    var cartTotalThreshold = Site.getCurrent().getCustomPreferenceValue('cartTotalThreshold');

    if (cartTotal >= cartTotalThreshold) {
        res.setViewData({
            cartMessage: 'Your cart total exceeds $' + cartTotalThreshold + '!'
        });
    } else {
        res.setViewData({
            cartMessage: ''
        });
    }

    next();
});

module.exports = server.exports();