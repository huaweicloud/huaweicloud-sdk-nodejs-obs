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
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.closeSync(fd);
		}
	}
	return sampleFilePath;
}

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
		
		var localFilePath = '/temp/' + objectKey;
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
});

var isDeleteObjectFinished = false; 
var process = require('process');
process.on('beforeExit', (code) => {
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
		});
		isDeleteObjectFinished = true;
	}
});