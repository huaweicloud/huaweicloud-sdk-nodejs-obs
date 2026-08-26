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
 * This sample demonstrates how to download an object 
 * from OBS in different ways using the OBS SDK for Nodejs.
 */

'use strict';
const os = require('os');
const path = require('path');
const fs = require('fs');
const { mkdirsSync, createSampleFileSync } = require('./utils');
 
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


const pathLib = require('path');
const sampleFilePath = path.join(os.tmpdir(), 'test.txt');

const bucketName = 'my-obs-bucket-demo';
const objectKey = 'my-obs-object-key-demo';


/*
 * Create bucket 
 */
obs.createBucket({
	Bucket : bucketName
}).then((result) => {
	if(result.CommonMsg.Status < 300){
		console.log('Create bucket for demo\n');
		 /*
         * Upload an object to your bucket
         */
		return obs.putObject({
			Bucket: bucketName,
			Key: objectKey,
			SourceFile : createSampleFileSync(sampleFilePath)
		});
	}
}).then((result) => {
	if(result && result.CommonMsg.Status < 300){
		console.log('Uploading a new object to OBS from a file finished.\n');
		
		/*
         * Download the object as a String
         */
		obs.getObject({
			Bucket: bucketName,
			Key: objectKey,
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Get object content');
				console.log('\tContent-->\n' + result.InterfaceResult.Content);
				console.log('\n');
			}
		});
		
		const localFilePath = path.join(os.tmpdir(), objectKey);
		/*
         * Download the object to a file
         */
		obs.getObject({
			Bucket: bucketName,
			Key: objectKey,
			SaveAsFile: localFilePath
		}).then((result) => {
			console.log('Download the object to a file finished.\n');
		});
	}
}).catch((err) => { console.error(err); });

let isDeleteObjectFinished = false; 
process.on('beforeExit', async () => {
	if(fs.existsSync(sampleFilePath)){
		fs.unlinkSync(sampleFilePath);
	}
	if(!isDeleteObjectFinished){
		/*
		 * Delete object
		 */
		obs.deleteObject({
			Bucket: bucketName,
			Key: objectKey
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Delete object ' + objectKey +  ' finished.\n');
			}
			obs.close();
		}).catch((err) => { console.error(err); });
		isDeleteObjectFinished = true;
	}
});