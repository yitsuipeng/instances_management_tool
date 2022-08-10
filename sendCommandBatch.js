const { AWS, filter, accountStart } = require('./confidential')

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

let gpu_start_index = 0;

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'})

ec2.describeInstances(filter)
  .promise()
  .then((data) => {
      var instances = data.Reservations[0].Instances.map(ar => ar.InstanceId)
      console.log("find instance: ", instances);

      // let instances = ['i-08c8daaee40a1ee29']
      var ssm = new AWS.SSM();
      var params = [];

      instances.forEach((id, index) => {

        var no = pad(accountStart + index, 3);
        var no1 = pad(accountStart + index+150, 3);
        var no2 = pad(accountStart + index+300, 3);

          var bat = '"timeout /t 10 \n' +
            'start C:\\Users\\Administrator\\Desktop\\UNIVERSE\\UNIVERSE.exe `"{`"Email`":`"ptest' + no + '@viewsonic.com`",`"Password`":`"Uvs12345`",`"RoomPrefix`":`"pTestRoom`"}`"\n' +
            'timeout /t 3 \n' +
            'start C:\\Users\\Administrator\\Desktop\\UNIVERSE\\UNIVERSE.exe `"{`"Email`":`"ptest' + no1 + '@viewsonic.com`",`"Password`":`"Uvs12345`",`"RoomPrefix`":`"pTestRoom`"}`"\n' +
            'timeout /t 3 \n' +
            'start C:\\Users\\Administrator\\Desktop\\UNIVERSE\\UNIVERSE.exe `"{`"Email`":`"ptest' + no2 + '@viewsonic.com`",`"Password`":`"Uvs12345`",`"RoomPrefix`":`"pTestRoom`"}`""'; 
          
            var command = 'Set-Content C:\\Users\\Administrator\\Desktop\\UNIVERSE\\1.bat ' + bat;

          console.log(command)

          var param = {
            DocumentName: "AWS-RunPowerShellScript",
            InstanceIds: [id],
            MaxConcurrency: String(200),
            Parameters: {
              'commands': [
                command
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

          }, i * 100)
      }

          // var commandPromise = ssm.sendCommand(params, function(err, data) {
          //   if (err) console.log(err, err.stack);
          //   else     console.log('Instance success: '+id);          
          // })

      // Promise.all(commands).then(values => {
      //     console.log("Response size: " + values.length);
          
      //   });

  }).catch(
      function(err) {
      console.error(err, err.stack);
  });