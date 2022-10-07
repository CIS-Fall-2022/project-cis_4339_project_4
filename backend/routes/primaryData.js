const express = require("express"); 
const { default: mongoose } = require("mongoose");
const router = express.Router(); 

//importing data model schemas
let { primarydata, organizationdata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 

//GET all entries
//Example: http://127.0.0.1:3000/primaryData
router.get("/", (req, res, next) => { 
    primarydata.find( 
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
//Example: 'http://127.0.0.1:3000/primaryData/id/2086fb30-44e5-11ed-af01-53f43b15e8c5'
router.get("/id/:id", (req, res, next) => {
    primarydata.find( 
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
//Example: 'http://127.0.0.1:3000/primaryData/search/?firstName=Hannah&lastName=Do&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }
        }
    };
    primarydata.find( 
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

//GET events for a single client
//Possibly needs changes or not needed, same functionality than eventsData.js router.get("/client/:id"...) API
//Example: 'http://127.0.0.1:3000/primaryData/events/2086fb30-44e5-11ed-af01-53f43b15e8c5' 
router.get("/events/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET endpoint that will retrieve clients by name of organization
// Example: 'http://127.0.0.1:3000/primaryData/orgName/Community%20Center' (Postman: do not use %20, %20 used for URL browser)
router.get('/orgName/:name', (req, res, next) => {
    organizationdata.aggregate([
        { $match: { name: req.params.name } },
        {
            $lookup: {
                from: 'primaryData',
                localField: '_id',
                foreignField: 'organization_id',
                as: 'primaryData'
            }
        }
    ], (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data);
        }
    });
});

//GET endpoint that will retrieve clients by the id of the organization
// Example: http://127.0.0.1:3000/primaryData/orgId/633dd0400b7c9d8f912fb0b2
router.get('/orgId/:id', (req, res, next) => {
    organizationdata.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'primaryData',
                localField: '_id',
                foreignField: 'organization_id',
                as: 'primaryData'
            }
        }
    ], (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data);
        }
    });
});

//POST Add a new Client
//Example: 'http://127.0.0.1:3000/primaryData'
router.post("/", (req, res, next) => { 
    primarydata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
//Example: http://127.0.0.1:3000/primaryData/2086fb30-44e5-11ed-af01-53f43b15e8c5'
// { "address": { "county": "Harris" }}
router.put("/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
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

//Delete client by id
//Example: 'http://127.0.0.1:3000/primaryData/client/a2a707d0-4527-11ed-b74f-896395cf3c7b'
router.delete("/client/:id", (req, res, next) => { 
    primarydata.deleteOne({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

module.exports = router;