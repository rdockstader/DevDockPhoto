var mongoose    = require("mongoose"),
    PriceGroup  = require("../models/priceGroup"),
    Collection  = require("../models/collection");

var priceGroupArray = [
        {
            label: "Portraits",
            order: 1,
            prices: [
                {priceType: "Single Session/Head Shots", time: "Up to 30 min", price: "$199.00"},
                {priceType: "Small Family (4 or less)", time: "up to 1 hour/1-3 Location(s)", price: "$399.00"},
                {priceType: "Medium Family (4-10)", time: "up to 1 hour/1-2 Location(s)", price: "$449.00"},
                {priceType: "Large Family (10+)", time: "up to 1 hour/1 location", price: "$499.00+"},
            ]
        },
        {
            label: "Seniors",
            order: 2,
            prices: [
                {priceType: "Half Session", time: "up to 30 min/1 Location", price: "$199.00"},
                {priceType: "Full Session", time: "up to 60 min/1-2 Locations", price: "$399.00"},
                {priceType: "Extended Session", time: "up to 90 min/1-3 Locations", price: "$499.00"}
            ]
        },
        {
            label: "Weddings",
            order: 3,
            prices: [
                {priceType: "Engagements", time: "up to 1 hour/1-3 Location(s)", price: "$399.00"},
                {priceType: "Formals/Bridals", time: "up to 1 hour/1-3 Location(s)", price: "$399.00"},
                {priceType: "Reception", time: "3 hour MAX", price: "$699.00"},
                {priceType: "Wedding Day", time: "2 hour MAX", price: "$699.00"}
            ]
        },
        {
            label: "Add Ons", 
            order: 4,
            prices: [
                {priceType: "Travel Out of Cache County", time: "-", price: "$50.00/hour"},
                {priceType: "Second Photographer", time: "-", price: "Dependant upon Time/Distance"},
                {priceType: "Extra Time/Going Over", time: "-", price: "$300/hr"}
            ]
        }
    ];
    
var collectionArray = [
    {
        title: "Portraits",
        titleLower: "portraits",
        images: 
        [
            {path: "portraits/benji-min.jpg", title:"benji-min.jpg", alt: "Benji", showOnHome: false},   
            {path: "portraits/bradey-min.jpg", title:"bardey-min.jpg", alt: "Bradey", showOnHome: false},
            {path: "portraits/carson-min.jpg", title:"carson-min.jpg", alt: "Carson", showOnHome: false},
            {path: "portraits/devinrae-1.jpg", title:"devinrae-1.jpg", alt: "Devin Rae", showOnHome: false},
            {path: "portraits/devinrae-2.jpg", title:"devinrae-2.jpg", alt: "Devin Rae", showOnHome: false},
            {path: "portraits/devinrae-3.jpg", title:"devinrae-3.jpg", alt: "Devin Rae", showOnHome: false},
            {path: "portraits/devinrae-4.jpg", title:"devinrae-4.jpg", alt: "Devin Rae", showOnHome: false},
            {path: "portraits/devinrae-5.jpg", title:"devinrae-5.jpg", alt: "Devin Rae", showOnHome: false},
            {path: "portraits/devinrae-6.jpg", title:"devinrae-6.jpg", alt: "Devin Rae", showOnHome: false},
            {path: "portraits/devinrae-7.jpg", title:"devinrae-7.jpg", alt: "Devin Rae", showOnHome: false},
            {path: "portraits/jordan-min.jpg", title:"jordan-min.jpg", alt: "Jordan", showOnHome: false},
            {path: "portraits/jr-min.jpg", title:"jr-min.jpg", alt: "JR", showOnHome: false},
            {path: "portraits/kade-min.jpg", title:"kade-min.jpg", alt: "Kade", showOnHome: false},
            {path: "portraits/kelson-min.jpg", title:"kelson-min.jpg", alt: "Kelson", showOnHome: false},
            {path: "portraits/ryan-min.jpg", title:"ryan-min.jpg", alt: "Ryan", showOnHome: false},
            {path: "portraits/sam-min.jpg", title:"sam-min.jpg", alt: "Sam", showOnHome: false},
            {path: "portraits/trevor-min.jpg", title:"trevor-min.jpg", alt: "Trevor", showOnHome: false},
            {path: "portraits/P03.jpg", title:"P03.jpg", alt: "p03", showOnHome: false},
            {path: "portraits/P06.jpg", title:"P06.jpg", alt: "p06", showOnHome: false},
            {path: "portraits/P07.jpg", title:"P07.jpg", alt: "p07", showOnHome: false},
            {path: "portraits/P09.jpg", title:"P09.jpg", alt: "p09", showOnHome: false},
            {path: "portraits/P10.jpg", title:"P10.jpg", alt: "p10", showOnHome: false},
            {path: "portraits/P17.jpg", title:"P17.jpg", alt: "p17", showOnHome: false},
            {path: "portraits/P19.jpg", title:"P19.jpg", alt: "p19", showOnHome: false},
            {path: "portraits/P21.jpg", title:"P21.jpg", alt: "p21", showOnHome: false},
            {path: "portraits/P25.jpg", title:"P25.jpg", alt: "p25", showOnHome: false},
            {path: "portraits/P26.jpg", title:"P26.jpg", alt: "p26", showOnHome: false},
            {path: "portraits/P29.jpg", title:"P29.jpg", alt: "p29", showOnHome: false}
        ]
    },
    {
        title: "Family",
        titleLower: "family",
        images: 
        [
            {path: "family/_MG_2206-min.jpg", title:"_MG_2206-min.jpg", alt: "first picture", showOnHome: false},
            {path: "family/_MG_2213-min.jpg", title:"_MG_2213-min.jpg", alt: "Second picture", showOnHome: false},
            {path: "family/_MG_2219-min.jpg", title:"_MG_2219-min.jpg", alt: "Third picture", showOnHome: false},
            {path: "family/_MG_2242-min.jpg", title:"_MG_2242-min.jpg", alt: "Fourth picture", showOnHome: false},
            {path: "family/_MG_2296-min.jpg", title:"_MG_2296-min.jpg", alt: "Fifth picture", showOnHome: false},
            {path: "family/_MG_2314-min.jpg", title:"_MG_2314-min.jpg", alt: "Sixth picture", showOnHome: false},
            {path: "family/_MG_2318-min.jpg", title:"_MG_2318-min.jpg", alt: "Seventh picture", showOnHome: false},
            {path: "family/DSC_0612-min.jpg", title:"DSC_0612-min.jpg", alt: "Eight picture", showOnHome: false},
            {path: "family/DSC_0632-min.jpg", title:"DSC_0632-min.jpg", alt: "Ninth picture", showOnHome: false},
            {path: "family/DSC_0644-min.jpg", title:"DSC_0644-min.jpg", alt: "Tenth picture", showOnHome: false},
            {path: "family/DSC_0678-min.jpg", title:"DSC_0678-min.jpg", alt: "Eleventh picture", showOnHome: false},
            {path: "family/DSC_0798-min.jpg", title:"DSC_0798-min.jpg", alt: "Twelth picture", showOnHome: false},
            {path: "family/DSC_0878-min.jpg", title:"DSC_0878-min.jpg", alt: "13th picture", showOnHome: false},
            {path: "family/DSC_0921-min.jpg", title:"DSC_0921-min.jpg", alt: "14th picture", showOnHome: false},
            {path: "family/DSC_0955-min.jpg", title:"DSC_0955-min.jpg", alt: "15th picture", showOnHome: false},
            {path: "family/DSC_0988-min.jpg", title:"DSC_0988-min.jpg", alt: "16th picture", showOnHome: false},
            {path: "family/DSC_1012-min.jpg", title:"DSC_1012-min.jpg", alt: "17th picture", showOnHome: false},
            {path: "family/DSC_1015-min.jpg", title:"DSC_1015-min.jpg", alt: "18th picture", showOnHome: false},
            {path: "family/DSC_1034-min.jpg", title:"DSC_1034-min.jpg", alt: "19th picture", showOnHome: false},
            {path: "family/DSC_1047-min.jpg", title:"DSC_1047-min.jpg", alt: "20th picture", showOnHome: false},
            {path: "family/DSC_1086-min.jpg", title:"DSC_1086-min.jpg", alt: "21st picture", showOnHome: false},
            {path: "family/DSC_1104-min.jpg", title:"DSC_1104-min.jpg", alt: "22th picture", showOnHome: false},
            {path: "family/F17.jpg", title:"F17.jpg", alt: "23rd picture", showOnHome: false},
            {path: "family/F18.jpg", title:"F18.jpg", alt: "24rd picture", showOnHome: false},
            {path: "family/F21.jpg", title:"F21.jpg", alt: "25rd picture", showOnHome: false},
            {path: "family/F22.jpg", title:"F22.jpg", alt: "26rd picture", showOnHome: false},
            {path: "family/F24.jpg", title:"F24.jpg", alt: "27rd picture", showOnHome: false},
            {path: "family/F27.jpg", title:"F27.jpg", alt: "28rd picture", showOnHome: false},
            {path: "family/F28.jpg", title:"F28.jpg", alt: "29rd picture", showOnHome: false},
            {path: "family/F29.jpg", title:"F29.jpg", alt: "30rd picture", showOnHome: false}
        ]
    }
];    

    
function seedDB(){
    console.log("seed started....");
    // Remove all price groups
    PriceGroup.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("price groups removed.");
        }
    });
    // Create New Price groups
    priceGroupArray.forEach(function(priceGroup){
        PriceGroup.create(priceGroup, function(err, group){
            if(err) {
                console.log(err);
            } else {
                console.log("Pricing Group Created.");
            }
        });
    });
    // Remove all Collections
    Collection.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Collections removed.");
        }
    });
    // Create new Collections
    collectionArray.forEach(function(col){
       Collection.create(col, function(err, collection){
           if(err) {
               console.log(err);
           } else {
               console.log("Collection created");
           }
       }); 
    });
}

module.exports = seedDB;