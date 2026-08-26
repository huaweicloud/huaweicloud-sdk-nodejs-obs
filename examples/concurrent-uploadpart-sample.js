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
 * This sample demonstrates how to multipart upload an object concurrently 
 * from OBS using the OBS SDK for Nodejs.
 */

'use strict';
const os = require('os');
const path = require('path');
 const fs = require('fs');
const { mkdirsSync, createLargeSampleFileSync } = require('./utils');
 
let ObsClient;
try{
	ObsClient = require('esdk-obs-nodejs');
}catch(e){
	ObsClient = require('./lib/obs');
}


/*
 * Initialize a obs client instance with your account for accessing OBS
 */
const obs = new ObsClient({
	access_key_id: '*** Provide your Access Key ***',
	secret_access_key: '*** Provide your Secret Key ***',
	server : 'https://your-endpoint'
});

const bucketName = 'my-obs-bucket-demo';
const objectKey = 'my-obs-object-key-demo';

const pathLib = require('path');
const sampleFilePath = path.join(os.tmpdir(), 'test.txt');


/*
 * Create bucket 
 */
obs.createBucket({
	Bucket : bucketName
}).then((result) => {
	if(result.CommonMsg.Status < 300){
		console.log('Create bucket for demo\n');
		/*
         * Claim a upload id firstly
         */
		obs.initiateMultipartUpload({
			Bucket : bucketName,
			Key : objectKey
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				const uploadId = result.InterfaceResult.UploadId;
				console.log('Claim a new upload id ' + uploadId + '\n');
				
				const partSize = 5 * 1024 * 1024;
				/*
				 * Create a sample file 
				 */
				createLargeSampleFileSync(sampleFilePath);
				
				const fileLength = fs.lstatSync(sampleFilePath).size;
				const partCount = fileLength % partSize === 0 ? Math.floor(fileLength / partSize) :  Math.floor(fileLength / partSize) + 1;
				
				console.log('Total parts count ' + partCount  + '\n'); 
				
				const events = require('events');
				const eventEmitter = new events.EventEmitter();
				const parts = [];
				/*
	             * Upload multiparts to your bucket
	             */
				console.log('Begin to upload multiparts to OBS from a file\n');
				for(let i=0;i<partCount;i++){
					let offset = i * partSize;
					let currPartSize = (i + 1 === partCount) ? fileLength - offset : partSize;
					let partNumber = i + 1;
					obs.uploadPart({
						Bucket : bucketName,
						Key: objectKey,
						PartNumber: partNumber,
						UploadId : uploadId,
						SourceFile: sampleFilePath,
						Offset : offset,
						PartSize : currPartSize
					}).then((result) => {
						if(result.CommonMsg.Status < 300){
							parts.push({PartNumber : partNumber, ETag : result.InterfaceResult.ETag});
							if(parts.length === partCount){
								/*
								 * Sort parts order by partNumber asc
								 */
								parts.sort((a, b) => {
									if(a.PartNumber >= b.PartNumber){
										return 1;
									}
									return -1;
								});
								eventEmitter.emit('upload part finished', parts);
							}
						}else{
							throw new Error(result.CommonMsg.Code);
						}
					}).catch((err) => { console.error(err); });
				}
				
				/*
				 * Waiting for all parts finished
				 */
				eventEmitter.on('upload part finished', (parts) => {
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
}).catch((err) => { console.error(err); });

process.on('beforeExit', async () => {
	obs.close();
});