// 1.Find all the information about each products
db.products.find({}).toArray();

// 2. Find the product price which are between 400 to 800
db.products.find({product_price : {$gte: 400, $lte : 800}});

// 3.Find the product price which are not between 400 to 600
db.products.find({product_price: {$not :{$gte:400, $lte:800}}});

// 4.List the four product which are grater than 500 in price 
db.products.find({product_price: {$gte:500}});

// 5.Find the product name and product material of each products
db.products.find({},{_id: 0, product_name:1, product_meterial:1}).toArray();

// 6.Find the product with a row id of 10
db.products.findOne({id: '10'});

// 7.Find only the product name and product material
db.products.find({},{product_name:1, product_meterial:1}).toArray();

// 8. Find all products which contain the value of soft in product material 
db.products.find({product_meterial: {$eq: 'soft'}});

// 9.Find products which contain product color indigo  and product price 492.00
db.products.find({$or : [{product_color: "indigo"},{product_price: 492}]});

// 10.Delete the products which product price value are same
db.products.aggregate([
    {$group: {_id: "$product_price", count: {$sum:1}}},
    {$match: {_id: {$ne:null},count: {$gt:1}}}
]);
db.products.deleteMany({$or: [{product_price:36},{product_price:47}]});