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
 * This sample demonstrates how to list objects under specified bucket 
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
var keys = [];

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
		var content = 'Hello OBS';
		var keyPrefix = 'MyObjectKey';
		var finishedCount = 0;
		/*
         * First insert 100 objects for demo
         */
		for(let i=0;i<100;i++){
			let key = keyPrefix + i;
			obs.putObject({
				Bucket: bucketName,
				Key: key,
				Body: content
			}).then((result) => {
				if(result.CommonMsg.Status < 300){
					keys.push({Key: key});
				}
				if(++finishedCount === 100){
					eventEmitter.emit('Insert finished');
				}
			});
		}
		
		eventEmitter.on('Insert finished', ()=>{
			console.log('Put '+ keys.length + ' objects completed.');
			/*
             * List objects using default parameters, will return up to 1000 objects
             */
			obs.listObjects({
				Bucket: bucketName
			}).then((result) => {
				if(result.CommonMsg.Status < 300){
					console.log('List objects using default parameters:\n');
					for(let j=0;j<result.InterfaceResult.Contents.length;j++){
						console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
						console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
					}
					console.log('\n');
				}
				
				/*
	             * List the first 10 objects 
	             */
				obs.listObjects({
					Bucket: bucketName,
					MaxKeys : 10
				}).then((result) => {
					if(result.CommonMsg.Status < 300){
						console.log('List the first 10 objects :\n');
						for(let j=0;j<result.InterfaceResult.Contents.length;j++){
							console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
							console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
						}
						console.log('\n');
						var theSecond10ObjectsMarker = result.InterfaceResult.NextMarker;
						/*
			             * List the second 10 objects using marker 
			             */
						obs.listObjects({
							Bucket: bucketName,
							MaxKeys : 10,
							Marker : theSecond10ObjectsMarker
						}).then((result) => {
							if(result.CommonMsg.Status < 300){
								console.log('List the second 10 objects using marker:\n');
								for(let j=0;j<result.InterfaceResult.Contents.length;j++){
									console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
									console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
								}
								console.log('\n');
							}
							
							/*
				             * List objects with prefix and max keys
				             */
							obs.listObjects({
								Bucket: bucketName,
								MaxKeys: 5,
								Prefix: keyPrefix + '2'
							}).then((result) => {
								if(result.CommonMsg.Status < 300){
									console.log('List objects with prefix and max keys:\n');
									for(let j=0;j<result.InterfaceResult.Contents.length;j++){
										console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
										console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
									}
									console.log('\n');
								}
								
								/*
					             * List all the objects in way of pagination
					             */
								
								function listAll(nextMarker, pageSize, pageIndex){
									obs.listObjects({
										Bucket: bucketName,
										MaxKeys: pageSize,
										Marker:nextMarker
									}).then((result) => {
										if(result.CommonMsg.Status < 300){
											console.log('Page:' + pageIndex + '\n');
											for(let j=0;j<result.InterfaceResult.Contents.length;j++){
												console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
												console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
											}
											console.log('\n');
											if(result.InterfaceResult.IsTruncated === 'true'){
												listAll(result.InterfaceResult.NextMarker, pageSize, pageIndex + 1);
											}
										}
									});
								}
								
								listAll(null, 10, 1);
								
							});
						});
					}
				});
				
			});
			
		});
		
	}
});


var deleteObjectsFinished = false;

var process = require('process');
process.on('beforeExit', (code) => {
	if(!deleteObjectsFinished){
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
			obs.close();
		});
		deleteObjectsFinished = true;
	}
});