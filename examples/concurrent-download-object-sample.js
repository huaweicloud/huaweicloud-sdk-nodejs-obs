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
 * This sample demonstrates how to download an object concurrently 
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
const localFilePath = path.join(os.tmpdir(), objectKey);

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
         * Upload an object to your source bucket
         */
		obs.putObject({
			Bucket : bucketName,
			Key : objectKey,
			/*
			 * Create a sample file 
			 */
			SourceFile : createLargeSampleFileSync(sampleFilePath)
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
						const objectSize = Number(result.InterfaceResult.ContentLength);
						console.log('Object size from metadata:' + objectSize + '\n');
						
						 /*
			             * Calculate how many blocks to be divided
			             */
						const blockSize = 5 * 1024 * 1024;// 5MB
						const blockCount = Math.floor(objectSize / blockSize);
						if(objectSize % blockSize !== 0){
							blockCount++;
						}
						console.log('Total blocks count ' + blockCount + ' \n');
						
						/*
			             * Download the object concurrently
			             */
						console.log('Start to download ' + objectKey + '\n');
						
						// Fix 18: Open file inside the function, not at module load time
						const fd = fs.openSync(localFilePath, 'w');
						if(fd){
							let finishedCount = 0;
							for(let i=0;i<blockCount;){
								const blockNumber = i; // Fix 17: Capture current block number before increment
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
											// Fix 19: Use synchronous write to avoid concurrent write issues
											fs.writeSync(fd, data, 0, data.length, _startPos);
											_startPos += data.length;
										}).on('end',() => {
											console.log('Block#' + blockNumber + ' done\n');
											if(++finishedCount === blockCount){
												fs.closeSync(fd);
												obs.deleteObject({Bucket: bucketName, Key: objectKey});
											}
										});
									}
								}).catch((err) => { console.error(err); });
							}
						}
					}
				}).catch((err) => { console.error(err); });
			}
		}).catch((err) => { console.error(err); });
	}
}).catch((err) => { console.error(err); });

process.on('beforeExit', async () => {
	obs.close();
});
