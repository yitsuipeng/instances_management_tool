const { AWS, filter } = require('./confidential')

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'})

ec2.describeInstances(filter)
    .promise()
    .then((data) => {
        var instances = data.Reservations[0].Instances.map(ar => ar.InstanceId)
        console.log("instance number: ", instances.length);
        var stopParam = {InstanceIds:instances}
        
        ec2.stopInstances(stopParam).promise()
            .then((data) => console.log("Success: " + data.length))
            .catch((err)=> console.log("Error: "+err))
    })
    .catch(
        function(err) {
        console.error(err, err.stack);
    });