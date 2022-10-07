const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");

//importing data model schemas
let { eventdata, organizationdata } = require("../models/models"); 

//GET all entries
//Example : http://127.0.0.1:3000/eventData
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//Get next two events
//Example : http://127.0.0.1:3000/eventData/upcoming
router.route("/upcoming").get(function(req, res) {
    eventdata.find({}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      })
      .sort({date: 1})
      .limit(2);
  });

//GET single entry by ID of event
//Example: http://127.0.0.1:3000/eventData/id/d71b4dc0-44df-11ed-af01-53f43b15e8c5
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET count of attendees per event
//Example: 'http://127.0.0.1:3000/eventData/count/d71b4dc0-44df-11ed-af01-53f43b15e8c5'
router.get("/count/:id", (req, res, next) => { 
    eventdata.find(
        { _id: req.params.id },
        { count: { $size: "$attendees"}},
        (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query by name of event
//Example: 'http://127.0.0.1:3000/eventData/search/?eventName=Care%20for%20a%20better%20community&searchBy=name' (Postman: do not use %20 for spaces in the URL)
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
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

//GET events for which a client is signed up using the client id
//Example: http://127.0.0.1:3000/eventData/client/2086fb30-44e5-11ed-af01-53f43b15e8c5
router.get("/client/:id", (req, res, next) => { 
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

//GET endpoint that will retrieve events by name of organization
// Example: 'http://127.0.0.1:3000/eventData/orgName/Community%20Center' (Postman: do not use %20 for spaces in the URL)
router.get('/orgName/:name', (req, res, next) => {
    organizationdata.aggregate([
        { $match: { name: req.params.name } },
        {
            $lookup: {
                from: 'eventData',
                localField: '_id',
                foreignField: 'organization_id',
                as: 'eventData'
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

//GET endpoint that will retrieve events by the id of the organization
// Example: 'http://127.0.0.1:3000/eventData/orgId/633dd0400b7c9d8f912fb0b2'
router.get('/orgId/:id', (req, res, next) => {
    organizationdata.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'eventData',
                localField: '_id',
                foreignField: 'organization_id',
                as: 'eventData'
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
    eventdata.create( 
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

//PUT data or edit data using the id of the event
//Example: http://127.0.0.1:3000/eventData/d71b4dc0-44df-11ed-af01-53f43b15e8c5
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
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

//PUT add attendee to event id and then enter the client string uuid in Postman for the attendees array: {"attendee": "5390a720-43f9-11ed-a422-832625efc587"}
//Example: http://127.0.0.1:3000/eventData/addAttendee/4ab24990-4464-11ed-8ee1-a91e0221bd6d
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                console
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});

//DELETE event by ID
//Example: 'http://127.0.0.1:3000/eventData/event/bdb9a480-4525-11ed-8d07-13a58c20e229'
router.delete("/event/:id", (req, res, next) => { 
    eventdata.deleteOne({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
}); 


module.exports = router;
