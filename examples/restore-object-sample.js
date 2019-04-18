/**
 * This sample demonstrates how to download an cold object 
 * from OBS using the OBS SDK for Nodejs.
 */

'use strict';
 var fs = require('fs');
 
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

var bucketName = 'my-obs-cold-bucket-demo';
var objectKey = 'my-obs-cold-object-key-demo';


/*
 * Create a cold bucket 
 */
obs.createBucket({
	Bucket : bucketName,
	StorageClass : obs.enums.StorageClassCold
}).then((result) => {
	if(result.CommonMsg.Status < 300){
		console.log('Create a new cold bucket for demo\n');
		/*
         * Create a cold object
         */
		return obs.putObject({
			Bucket : bucketName, 
			Key : objectKey,
			Body : 'Hello OBS'
		});
	}
}).then((result) => {
	if(result && result.CommonMsg.Status < 300){
		console.log('Create a new cold object for demo\n');
		console.log('Restore the cold object');
		return obs.restoreObject({
			Bucket: bucketName,
			Key : objectKey,
			Days : 1,
			Tier : obs.enums.RestoreTierExpedited
		});
	}
}).then((result) => {
	if(result && result.CommonMsg.Status < 300){
		/*
         * Wait 6 minute to get the object
         */
		setTimeout(()=>{
			 /*
             * Get the cold object
             */
			obs.getObject({
				Bucket : bucketName,
				Key : objectKey,
			}).then((result) => {
				if(result.CommonMsg.Status < 300){
					console.log('Get the cold object:');
					console.log('\tContent-->\n' + result.InterfaceResult.Content);
					console.log('\n');
					
					/*
		             * Delete the cold object
		             */
					return obs.deleteObject({
						Bucket : bucketName,
						Key : objectKey
					});
				}
			}).then((result) => {
				if(result && result.CommonMsg.Status < 300){
					console.log('Delete the cold object finished.\n');
				}
			});
		}, 6 * 60 * 1000);
	}
});

var process = require('process');
process.on('beforeExit', (code) => {
	obs.close();
});