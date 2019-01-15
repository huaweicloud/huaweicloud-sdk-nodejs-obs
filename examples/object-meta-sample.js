/**
 * This sample demonstrates how to set/get self-defined metadata for object
 * on OBS using the OBS SDK for Nodejs.
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
var objectKey = 'my-obs-object-key-demo';

/*
 * Create bucket 
 */
obs.createBucket({
	Bucket : bucketName
}).then((result) => {
	if(result.CommonMsg.Status < 300){
		console.log('Create bucket for demo\n');
		/*
		 * Create object 
		 */
		return obs.putObject({
			Bucket: bucketName,
			Key: objectKey,
			ContentType : 'text/plain', // Setting object mime type
			Body : 'Hello OBS',
			Metadata : {'meta1' : 'value1', 'meta2' : 'value2'} // Setting self-defined metadata
		});
	}
}).then((result) => {
	if(result && result.CommonMsg.Status < 300){
		console.log('Create object ' + objectKey + ' successfully!\n');
		 /*
         * Get object metadata
         */
		return obs.getObjectMetadata({
			Bucket: bucketName,
			Key: objectKey
		});
	}
}).then((result) => {
	if(result && result.CommonMsg.Status < 300){
		console.log('Getting object metadata:');
		console.log('ContentType-->' + result.InterfaceResult.ContentType);
		console.log('Metadata-->' + JSON.stringify(result.InterfaceResult.Metadata));
	}
	/*
	 * Delete object 
	 */
	obs.deleteObject({Bucket: bucketName, Key: objectKey});
});


var process = require('process');
process.on('beforeExit', (code) => {
	obs.close();
});