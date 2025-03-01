'use strict';

var server = require('server');

var productHelpers = require('*/cartridge/scripts/helpers/productHelpers');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {

    var discountPercentage = null;
    
    var product = res.getViewData().product;

    if (product.price.list && product.price.sales) {
        
        var standardPrice = product.price.list.value;
        
        var salePrice = product.price.sales.value;

        if (typeof standardPrice === 'number' && typeof salePrice === 'number') {

            discountPercentage = productHelpers.calculatePercentageOff(standardPrice, salePrice);

        }
    }

    res.setViewData({

        discountPercentage: discountPercentage

    });

    return next();
    
});

module.exports = server.exports();