/**
 * This sample demonstrates how to delete objects under specified bucket 
 * from OBS using the OBS SDK for Nodejs.
 */

'use strict';
 
var ObsClient;
try{
	ObsClient = require('esdk-obs-nodejs');
}catch(e){
	try{
		ObsClient = require('./lib/obs');
	}catch(e){
		ObsClient = require('../lib/obs');//sample env
	}
}


/*
 * Initialize a obs client instance with your account for accessing OBS
 */
var obs = new ObsClient({
	access_key_id: '*** Provide your Access Key ***',
	secret_access_key: '*** Provide your Secret Key ***',
	server : 'https://your-endpoint'
});

var bucketName = 'my-obs-bucket-demo';

/*
 * Create bucket 
 */
obs.createBucket({
	Bucket : bucketName
}).then((result) => {
	if(result.CommonMsg.Status < 300){
		console.log('Create bucket for demo\n');
		
		var events = require('events');
		var eventEmitter = new events.EventEmitter();
		var keys = [];
		
		 /*
         * Batch put objects into the bucket
         */
		var content = 'Thank you for using Object Storage Servic';
		var keyPrefix = 'MyObjectKey';
		var finishedCount = 0;
		
		for(let i=0;i<100;i++){
			let key = keyPrefix + i;
			obs.putObject({
				Bucket : bucketName,
				Key : key,
				Body : content
			}).then((result) => {
				finishedCount++;
				if(result.CommonMsg.Status < 300){
					console.log('Succeed to put object' + key);
					keys.push({Key:key});
				}
				if(finishedCount === 100){
					console.log('\n');
					eventEmitter.emit('Batch put objects finished');
				}
			});
		}
		
		
		/*
         * Delete all objects uploaded recently under the bucket
         */
		eventEmitter.on('Batch put objects finished', () => {
			console.log('Deleting all objects\n');
			obs.deleteObjects({
				Bucket: bucketName,
				Quiet:false,
				Objects: keys
			}).then((result)=> {
				if(result.CommonMsg.Status < 300){
					console.log('Deleteds:');
					for(let i=0;i<result.InterfaceResult.Deleteds.length;i++){
						console.log('Deleted[' + i + ']:');
						console.log('Key-->'+result.InterfaceResult.Deleteds[i]['Key']);
						console.log('VersionId-->' + result.InterfaceResult.Deleteds[i]['VersionId']);
						console.log('DeleteMarker-->' + result.InterfaceResult.Deleteds[i]['DeleteMarker']);
						console.log('DeleteMarkerVersionId-->' + result.InterfaceResult.Deleteds[i]['DeleteMarkerVersionId']);
					}
					console.log('\n');
					console.log('Errors:');
					for(let i=0;i<result.InterfaceResult.Errors.length;i++){
						console.log('Error[' + i + ']:');
						console.log('Key-->' + result.InterfaceResult.Errors[i]['Key']);
						console.log('VersionId-->' + result.InterfaceResult.Errors[i]['VersionId']);
						console.log('Code-->' + result.InterfaceResult.Errors[i]['Code']);
						console.log('Message-->' + result.InterfaceResult.Errors[i]['Message']);
					}
				}
			});
		});
	}
});


var process = require('process');
process.on('beforeExit', (code) => {
	obs.close();
});

