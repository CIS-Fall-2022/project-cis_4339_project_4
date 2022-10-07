const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { organizationdata, primarydata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    organizationdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
//Example: 'http://127.0.0.1:3000/organizationData/id/633dd0400b7c9d8f912fb0b2'
router.get("/id/:id", (req, res, next) => {
    organizationdata.find( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET entries based on search query
//Ex: 'http://127.0.0.1:3000/organizationData/search/?orgName=Community%20Center&searchBy=name' (Postman: do not use %20 for spaces, %20 used in URL browser) 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { name: { $regex: `^${req.query["orgName"]}`, $options: "i" } }
    };
    organizationdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST
//Example: http://127.0.0.1:3000/organizationData, { "name": "Community Outreach" }
router.post("/", (req, res, next) => { 
    organizationdata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
});

//PUT update (make sure req body doesn't have the id)
//Example: 'http://127.0.0.1:3000/organizationData/633dd0400b7c9d8f912fb0b2'
router.put("/:id", (req, res, next) => { 
    organizationdata.findOneAndUpdate( 
        { _id: req.params.id }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

module.exports = router;
