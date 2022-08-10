const { AWS, filter, accountStart } = require('./confidential')

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'})

ec2.describeInstances(filter)
  .promise()
  .then((data) => {
      var instances = data.Reservations[0].Instances.map(ar => ar.InstanceId)
      console.log("find instance: ", instances);

      var ssm = new AWS.SSM();
      var params = [];

      instances.forEach((id, index) => {

          var no = pad(accountStart + index, 3);

          var param = {
            DocumentName: "AWS-RunPowerShellScript",
            InstanceIds: [id],
            MaxConcurrency: String(200),
            Parameters: {
              'commands': [
                'Set-Content C:\\Users\\Administrator\\Desktop\\UNIVERSE\\1.bat "start C:\\Users\\Administrator\\Desktop\\UNIVERSE\\UNIVERSE.exe `"{`"Email`":`"ptest' + no + '@viewsonic.com`",`"Password`":`"Uvs12345`",`"RoomPrefix`":`"pTestRoom`"}`""'
              ]
            }
          };

          params.push(param)
      })
      
      console.log("instance length: ", instances.length);

      for(let i = 0; i < params.length; i++) {
          setTimeout(function() {
              var instanceNo = pad(accountStart + i, 3)
              console.log("Send: " + instanceNo)

              ssm.sendCommand(params[i], function(err, data) {
                  if (err) console.log(err, err.stack);
                  else     console.log('Command success: ' + instanceNo);          
              })

              var tagParam = {
                  Resources: [params[i].InstanceIds[0]], 
                  Tags: [{Key: "Name", Value: String(instanceNo)}]
              };

              ec2.createTags(tagParam, function(err, data) {
                  if (err) console.log(err, err.stack); 
                  else     console.log('Instance name success: ' + instanceNo);
              });

          }, i * 300)
      }

  }).catch(
      function(err) {
      console.error(err, err.stack);
  });