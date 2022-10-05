const express = require("express"); 
const { default: mongoose } = require("mongoose");
const router = express.Router(); 

//importing data model schemas
let { primarydata, organizationdata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 

//GET all entries
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
//Example: 'http://127.0.0.1:3000/primaryData/search/?firstName=Nikolas&lastName=Walker&searchBy=name' 
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
//Need to recreate the events data to correctly reflect an array of ids, similar to phones in primary data, see corresponding eventData route API, then rework this API
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
// Example: http://127.0.0.1:3000/primaryData/orgName/Community_Center
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
// Example: http://127.0.0.1:3000/primaryData/orgId/6339061b3c00665da8a64ab5
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

//POST
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

module.exports = router;