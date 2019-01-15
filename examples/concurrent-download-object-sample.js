/**
 * This sample demonstrates how to download an object concurrently 
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

var bucketName = 'my-obs-bucket-demo';
var objectKey = 'my-obs-object-key-demo';
var localFilePath = '/temp/' + objectKey;

var pathLib = require('path');
var sampleFilePath = '/temp/test.txt';

function mkdirsSync(dirname){
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirsSync(pathLib.dirname(dirname))){
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function createSampleFile(sampleFilePath){
	if(!fs.existsSync(sampleFilePath)){
		mkdirsSync(pathLib.dirname(sampleFilePath));
		var fd = fs.openSync(sampleFilePath, 'w');
		if(fd){
			for(let i=0;i < 1000000;i++){
				fs.writeSync(fd, String(Math.random()) + '\n');
				fs.writeSync(fd, String(Math.random()) + '\n');
				fs.writeSync(fd, String(Math.random()) + '\n');
				fs.writeSync(fd, String(Math.random()) + '\n');
			}
			fs.closeSync(fd);
		}
	}
	return sampleFilePath;
}


var fd = fs.openSync(localFilePath, 'w');

/*
 * Create bucket 
 */
obs.createBucket({
	Bucket : bucketName
}).then((result) => {
	if(result.CommonMsg.Status < 300){
		console.log('Create bucket for demo\n');
		 /*
         * Upload an object to your source bucket
         */
		obs.putObject({
			Bucket : bucketName,
			Key : objectKey,
			/*
			 * Create a sample file 
			 */
			SourceFile : createSampleFile(sampleFilePath)
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Upload a new object to OBS from a file finished\n');
				
				/*
	             * Get size of the object
	             */
				obs.getObjectMetadata({
					Bucket : bucketName,
					Key : objectKey
				}).then((result) => {
					if(result.CommonMsg.Status < 300){
						var objectSize = Number(result.InterfaceResult.ContentLength);
						console.log('Object size from metadata:' + objectSize + '\n');
						
						 /*
			             * Calculate how many blocks to be divided
			             */
						var blockSize = 5 * 1024 * 1024;// 5MB
						var blockCount = Math.floor(objectSize / blockSize);
						if(objectSize % blockSize !== 0){
							blockCount++;
						}
						console.log('Total blocks count ' + blockCount + ' \n');
						
						/*
			             * Download the object concurrently
			             */
						console.log('Start to download ' + objectKey + '\n');
						if(fd){
							var finishedCount = 0;
							for(let i=0;i<blockCount;){
								let startPos = i++ * blockSize;
								let endPos = (i === blockCount) ? (objectSize - 1) : (i * blockSize - 1);
								obs.getObject({
									Bucket: bucketName,
									Key: objectKey,
									Range: 'bytes=' + startPos + '-' + endPos,
									SaveAsStream : true
								}).then((result) => {
									if(result.CommonMsg.Status < 300){
										let _startPos = startPos;
										result.InterfaceResult.Content.on('data', (data) => {
											fs.write(fd, data, 0, data.length, _startPos, ()=>{
											});
											_startPos += data.length;
										}).on('end',() => {
											console.log('Block#' + i + ' done\n');
											if(++finishedCount === blockCount){
												obs.deleteObject({Bucket: bucketName, Key: objectKey});
											}
										});
									}
								});
							}
						}
					}
				});
			}
		});
	}
});


var process = require('process');
process.on('beforeExit', (code) => {
	fs.closeSync(fd);
	obs.close();
});
