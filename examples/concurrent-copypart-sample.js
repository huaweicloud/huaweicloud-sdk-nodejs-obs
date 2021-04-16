/**
 * Copyright 2019 Huawei Technologies Co.,Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 *
 */

/**
 * This sample demonstrates how to multipart upload an object concurrently by copy mode 
 * to OBS using the OBS SDK for Nodejs.
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
var sourceBucketName = bucketName;
var sourceObjectKey = 'my-obs-object-key-demo';
var objectKey = sourceObjectKey + '-back';

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

function createSampleFileSync(sampleFilePath){
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
			Bucket : sourceBucketName,
			Key : sourceObjectKey,
			/*
			 * Create a sample file 
			 */
			SourceFile : createSampleFileSync(sampleFilePath)
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Upload a new object to OBS from a file finished\n');
	            /*
	             * Claim a upload id firstly
	             */
				obs.initiateMultipartUpload({
					Bucket : bucketName,
					Key : objectKey
				}).then((result) => {
					if(result.CommonMsg.Status < 300){
						var uploadId = result.InterfaceResult.UploadId;
						console.log('Claim a new upload id ' + uploadId + '\n');
						var partSize = 5 * 1024 * 1024;// 5MB
						obs.getObjectMetadata({
							Bucket : sourceBucketName,
							Key : sourceObjectKey
						}).then((result) => {
							if(result.CommonMsg.Status < 300){
								var objectSize = Number(result.InterfaceResult.ContentLength);
								var partCount = objectSize % partSize === 0 ? Math.floor(objectSize / partSize) : Math.floor(objectSize / partSize) + 1;
								console.log('Total parts count ' + partCount  + '\n'); 
								
								var events = require('events');
								var eventEmitter = new events.EventEmitter();
								var parts = [];
								/*
					             * Upload multiparts by copy mode
					             */
								console.log('Begin to upload multiparts to OBS by copy mode\n');
								for(let i=0;i<partCount;i++){
									let rangeStart = i * partSize;
									let rangeEnd = (i + 1) === partCount ? objectSize -1 : rangeStart + partSize - 1;
									let partNumber = i + 1;
									obs.copyPart({
										Bucket: bucketName,
										Key: objectKey,
										PartNumber : partNumber,
										UploadId : uploadId,
										CopySource: sourceBucketName + '/' + sourceObjectKey,
										CopySourceRange : 'bytes=' + rangeStart + '-' + rangeEnd
									}).then((result) => {
										if(result.CommonMsg.Status < 300){
											parts.push({PartNumber : partNumber, ETag : result.InterfaceResult.ETag});
											if(parts.length === partCount){
												/*
												 * Sort parts order by partNumber asc
												 */
												var _parts = parts.sort((a, b) => {
													if(a.PartNumber >= b.PartNumber){
														return 1;
													}
													return -1;
												});
												eventEmitter.emit('copy part finished', _parts);
											}
										}else{
											throw new Error(result.CommonMsg.Code);
										}
									});
								}
								
								/*
								 * Waiting for all parts finished
								 */
								eventEmitter.on('copy part finished', (parts) => {
									console.log('Succeed to complete multiparts into an object named ' + objectKey);
									
									/*
									 * View all parts uploaded recently
									 */
									obs.listParts({
										Bucket: bucketName,
										Key: objectKey,
										UploadId: uploadId
									}).then((result) => {
										if(result.CommonMsg.Status < 300){
											console.log('Listing all parts:');
											for(let i=0;i<result.InterfaceResult.Parts.length;i++){
												console.log('\tPart['+(i+1)+']:');
												console.log('\tPartNumber-->' + result.InterfaceResult.Parts[i]['PartNumber']);
												console.log('\tETag-->' + result.InterfaceResult.Parts[i]['ETag']);
												console.log('\tSize-->' + result.InterfaceResult.Parts[i]['Size']);
											}
											console.log('\n');
											/*
											 * Complete to upload multiparts
											 */
											obs.completeMultipartUpload({
												Bucket: bucketName,
												Key: objectKey,
												UploadId: uploadId,
												Parts: parts
											}).then((result) => {
												if(result.CommonMsg.Status < 300){
													console.log('Complete to upload multiparts finished.\n');
												}
											});
										}
									});
								});
							}
						});
					}
				});
				
			}
		});
	}
});

var process = require('process');
process.on('beforeExit', (code) => {
	obs.close();
});

