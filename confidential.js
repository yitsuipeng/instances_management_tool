require('dotenv').config();
var AWS = require("aws-sdk");

let region_config = {
    "Frankfurt" : {"region": "eu-central-1", "image": "ami-00e02f611eea84791", "num" : 250, "accountStart": 1},
    "London" :    {"region": "eu-west-2", "image": "ami-0db258616cb630020", "num" : 250, "accountStart": 251},
    "Singapore" : {"region": "ap-southeast-1", "image": "ami-0329de054d3895094", "num" : 250, "accountStart": 501},
    "Oregan" :    {"region": "us-west-2", "image": "ami-0a351792fc458f824", "num" : 250, "accountStart": 751},
    // "Tokyo" :     {"region": "ap-northeast-1", "image": "ami-0cfebddce2d549b06", "num" : 150, "accountStart": 701},
    // "Ohio" :      {"region": "us-east-2", "image": "ami-02d819858fec5b068", "num" : 150, "accountStart": 851},
    // "California" : {"region": "us-west-1", "image": "ami-0f96f0ea1428fcc3c", "num" : 150, "accountStart": 701}
}; 
// eu-central-1 Frankfurt 75    ami-0adfd97eb0bdd7162     from 1
// eu-west-2 London 75          ami-01b47061d22f852cd     from 151
// ap-southeast-1 Singapore 150 ami-082bd37c61cf725a6     from 301
// us-west-2 Oregan 200         ami-05fa548e3fe6490f2     from 451

var tagName = 'batch3'
var city = "Frankfurt"
var region = region_config[city]['region']
var ImageId = region_config[city]['image']
var num = region_config[city]['num']
var accountStart = region_config[city]['accountStart']

var filter = {
  Filters: [
      {
          Name: "tag:Batch", 
          Values: [tagName]
      }
  ]
};

AWS.config.update({
    region: region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
      console.log("Region:", AWS.config.region);
    }
  });

//t2.xlarge
//g4ad.xlarge
var instanceParams = {
    ImageId: ImageId, 
    InstanceType: 't2.xlarge',
    KeyName: 'testing',
    MinCount: num,
    MaxCount: num,
    IamInstanceProfile: {
        Arn: 'arn:aws:iam::909632374904:instance-profile/vpn_ssm'
      },
    TagSpecifications: [
        {
            ResourceType: "instance", 
            Tags: [
                    {
                        Key: "Batch", 
                        Value: tagName
                    }
                ]
        }
    ]
};

module.exports = { AWS, num, tagName, filter, accountStart, instanceParams, region, region_config}