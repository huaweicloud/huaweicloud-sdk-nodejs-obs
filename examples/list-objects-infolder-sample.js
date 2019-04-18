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
 * This sample demonstrates how to list objects under a specified folder of a bucket 
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
		var folderPrefix = 'src';
		var subFolderPrefix = 'test';
		
		var folderFinishedCount = 0;
		/*
         * First prepare folders and sub folders
         */
		for(let i=0;i<5;i++){
			let key = folderPrefix + i + '/';
			obs.putObject({
				Bucket: bucketName,
				Key : key
			}).then((result) => {
				folderFinishedCount++;
				if(result.CommonMsg.Status < 300){
					keys.push({Key: key});
					for(let j=0;j<3;j++){
						let subKey = key + subFolderPrefix + j + '/';
						obs.putObject({
							Bucket: bucketName,
							Key : subKey
						}).then((result) => {
							folderFinishedCount++;
							if(result.CommonMsg.Status < 300){
								keys.push({Key: subKey});
							}
							if(folderFinishedCount === 3 * 5){
								eventEmitter.emit('Create folder finished');
							}
						});
					}
				}
			});
		}
		
		var objectFinishedCount = 0;
		eventEmitter.on('Create folder finished', () => {
			/*
	         * Insert 2 objects in each folder
	         */
			obs.listObjects({
				Bucket: bucketName
			}).then((result) => {
				var length = 0;
				if(result.CommonMsg.Status < 300){
					length += result.InterfaceResult.Contents.length;
					for(let j=0;j<result.InterfaceResult.Contents.length;j++){
						for(let i=0;i<2;i++){
							let objectKey = result.InterfaceResult.Contents[j]['Key'] + keyPrefix + i;
							obs.putObject({
								Bucket: bucketName,
								Key : objectKey
							}).then((result) => {
								objectFinishedCount ++;
								if(result.CommonMsg.Status < 300){
									keys.push({Key: objectKey});
								}
								if(objectFinishedCount === length * 2 + 2){
									eventEmitter.emit('Create object finished');
								}
							});
						}
					}
				}
				
				/*
				 * Insert 2 objects in root path
				 */
				for(let i=0;i<2;i++){
					let objectKey = keyPrefix + i;
					obs.putObject({
						Bucket: bucketName,
						Key : objectKey
					}).then((result) => {
						objectFinishedCount ++;
						if(result.CommonMsg.Status < 300){
							keys.push({Key: objectKey});
						}
						if(objectFinishedCount === length * 2 + 2){
							eventEmitter.emit('Create object finished');
						}
					});
				}
				
			});
			
		});

		
		eventEmitter.on('Create object finished', ()=>{
			/*
             * List all objects in folder src0/
             */
			obs.listObjects({
				Bucket: bucketName,
				Prefix: 'src0/'
			}).then((result) => {
				if(result.CommonMsg.Status < 300){
					console.log('List all objects in folder src0/ \n');
					for(let j=0;j<result.InterfaceResult.Contents.length;j++){
						console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
						console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
					}
					console.log('\n');
				}
				
				/*
	             * List all objects in sub folder src0/test0/
	             */
				obs.listObjects({
					Bucket: bucketName,
					Prefix: 'src0/test0/'
				}).then((result) => {
					if(result.CommonMsg.Status < 300){
						console.log('List all objects in folder src0/test0/ \n');
						for(let j=0;j<result.InterfaceResult.Contents.length;j++){
							console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
							console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
						}
						console.log('\n');
					}
					
					/*
		             * List all objects group by folder
		             */
					console.log('List all objects group by folder');
					obs.listObjects({
						Bucket: bucketName,
						Delimiter: '/'
					}).then((result) => {
						if(result.CommonMsg.Status < 300){
							console.log('Root path:');
							for(let j=0;j<result.InterfaceResult.Contents.length;j++){
								console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
								console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
							}
							console.log('\n');
							
							var listObjectsByPrefix = function(commonPrefixes){
								for(let i=0;i<commonPrefixes.length;i++){
									obs.listObjects({
										Bucket: bucketName,
										Delimiter: '/',
										Prefix: commonPrefixes[i]['Prefix']
									}).then((result)=>{
										if(result.CommonMsg.Status < 300){
											console.log('Folder ' + commonPrefixes[i]['Prefix'] + ':');
											for(let j=0;j<result.InterfaceResult.Contents.length;j++){
												console.log('\tKey-->' + result.InterfaceResult.Contents[j]['Key']);
												console.log('\tETag-->' + result.InterfaceResult.Contents[j]['ETag']);
											}
											console.log('\n');
											if(result.InterfaceResult.CommonPrefixes && result.InterfaceResult.CommonPrefixes.length > 0){
												listObjectsByPrefix(result.InterfaceResult.CommonPrefixes);
											}
										}
									});
								}
							};
							
							listObjectsByPrefix(result.InterfaceResult.CommonPrefixes);
							
						}
					});
					
				});
				
			});
		});

	}
});


var process = require('process');
var deleteObjectsFinished = false;
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