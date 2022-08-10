const { AWS, instanceParams } = require('./confidential')

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'})
    .runInstances(instanceParams)
    .promise()
    .then((data) => {
        console.log("instance number: " + data.Instances.length);

    }).catch(
        function(err) {
        console.error(err, err.stack);
    });