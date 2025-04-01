'use strict';

/**
* Appends functionality to the 'Show' route of the Product controller to include suggested products.
* 
* This function retrieves a product based on the product ID from the query string. If the product
* exists and has a primary category, it performs a product search within that category to find
* similar products. It then compiles a list of suggested products, excluding the current product,
* and limits the suggestions to a maximum of four. The suggested products are added to the view
* data for rendering.
* 
* @param {Object} req - The server request object, containing the query string with the product ID.
* @param {Object} res - The server response object, used to set view data for rendering.
* @param {Function} next - The next middleware function in the server's request-response cycle.
*/

var server = require('server');

var ProductMgr = require('dw/catalog/ProductMgr');

var ProductSearchModel = require('dw/catalog/ProductSearchModel');

var URLUtils = require('dw/web/URLUtils');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {

    var productId = req.querystring.pid;

    var product = ProductMgr.getProduct(productId);

    if (product) {

        var category = product.primaryCategory;

        if (category) {

            var productSearch = new ProductSearchModel();

            productSearch.setCategoryID(category.ID);
            
            productSearch.search();

            var suggestedProducts = [];

            var productSearchHits = productSearch.getProductSearchHits();

            var count = 0;

            var maxSuggestions = 4;

            while (productSearchHits.hasNext() && count < maxSuggestions) {

                var suggestedProduct = productSearchHits.next().getProduct();

                if (suggestedProduct || suggestedProduct.ID !== productId) {

                    suggestedProducts.push({

                        uuid: suggestedProduct.UUID,

                        name: suggestedProduct.name,

                        price: suggestedProduct.priceModel.price,

                        image: suggestedProduct.getImage('small').getURL(),

                        url: URLUtils.url('Product-Show', 'pid', suggestedProduct.ID).toString()

                    });

                    count++;

                }

            }

            var currentViewData = res.getViewData();

            res.setViewData(Object.assign({}, currentViewData, {

                suggestedProducts: suggestedProducts

            }));

        }

    }

    next();
    
});

module.exports = server.exports();