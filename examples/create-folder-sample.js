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
 * This sample demonstrates how to create an empty folder under 
 * specified bucket to OBS using the OBS SDK for Nodejs.
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
		
        /*
         * Way 1:
         */
		var keySuffixWithSlash1 = 'MyObjectKey1/';
		obs.putObject({
			Bucket : bucketName,
			Key : keySuffixWithSlash1
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Create an empty folder ' + keySuffixWithSlash1 + ' finished.\n');
				/*
	             * Verify whether the size of the empty folder is zero 
	             */
				return obs.getObjectMetadata({
					Bucket : bucketName,
					Key : keySuffixWithSlash1
				});
			}
		}).then((result) => {
			if(result && result.CommonMsg.Status < 300){
				console.log('Size of the empty folder ' + keySuffixWithSlash1 + ' is ' + result.InterfaceResult.ContentLength);
			}
		});
		
        /*
         * Way 2:
         */
		var keySuffixWithSlash2 = 'MyObjectKey2/';
		obs.putObject({
			Bucket : bucketName,
			Key : keySuffixWithSlash2,
			Body : ''
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Create an empty folder ' + keySuffixWithSlash2 + ' finished.\n');
				/*
	             * Verify whether the size of the empty folder is zero 
	             */
				return obs.getObjectMetadata({
					Bucket : bucketName,
					Key : keySuffixWithSlash1
				});
			}
		}).then((result) => {
			if(result && result.CommonMsg.Status < 300){
				console.log('Size of the empty folder ' + keySuffixWithSlash2 + ' is ' + result.InterfaceResult.ContentLength);
			}
		});
		
	}
});


var process = require('process');
process.on('beforeExit', (code) => {
	obs.close();
});

