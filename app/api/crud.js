module.exports = {

    /**
     *
     * @param model
     * @param req
     * @param res
     */
    findAll: function (model, req, res) {

        model.find(function(err, items) {

            if (err) {
                res.send(err)
            }
            res.json(items);
        });
    },

    /**
     *
     * @param model
     * @param id
     * @param req
     * @param res
     */
    findOne: function(model, id, req, res) {

        model.findOne({ '_id' : id }, function(err, item) {

            if (err) {
                res.send(err)
            }
            res.json(item);
        });
    },

    /**
     *
     * @param model
     * @param body
     * @param req
     * @param res
     */
    create: function(model, req, res) {

        model.create(req.body, function(err, item) {

            if (err) {
                res.send(err);
            }
            res.json(item);

        });
    },

    /**
     *
     * @param model
     * @param id
     * @param req
     * @param res
     */
    update: function(model, id, req, res) {

        model.findOneAndUpdate({'_id' : id }, req.body, function (err, item) {

            if (err) {
                res.send(err);
            }
            res.json(item);
        });
    },

    /**
     *
     * @param model
     * @param id
     * @param req
     * @param res
     */
    delete: function(model, id, req, res) {

        model.remove({ _id : id }, function(err) {

            if (err) {
                res.send(err);
            }

            model.find(function(err, items) {
                if (err) {
                    res.send(err)
                }
                res.json(items);
            });
        });
    }

};