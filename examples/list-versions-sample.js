/**
 * 
 * This sample demonstrates how to list versions under specified bucket
 * from OBS using the OBS SDK for Node.js.
 * 
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
         * Enable bucket versioning
         */
		obs.setBucketVersioningConfiguration({
			Bucket : bucketName,
			VersionStatus : 'Enabled'
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Enable bucket versioning finished.\n');
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
							for(let j=0;j<3;j++){
								let subKey = key + subFolderPrefix + j + '/';
								obs.putObject({
									Bucket: bucketName,
									Key : subKey
								}).then((result) => {
									folderFinishedCount++;
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
								if(objectFinishedCount === length * 2 + 2){
									eventEmitter.emit('Create object finished');
								}
							});
						}
						
					});
				});
				
				eventEmitter.on('Create object finished', ()=>{
					/*
		             * List versions using default parameters, will return up to 1000 objects
		             */
					obs.listVersions({
						Bucket : bucketName
					}).then((result) => {
						if(result.CommonMsg.Status < 300){
							console.log('List versions using default parameters:');
							console.log('Versions:');
							for(let j=0;j<result.InterfaceResult.Versions.length;j++){
								console.log('Version[' + j +  ']:');
								console.log('Key-->' + result.InterfaceResult.Versions[j]['Key']);
								console.log('VersionId-->' + result.InterfaceResult.Versions[j]['VersionId']);
							}
							console.log('DeleteMarkers:');
							for(let i=0;i<result.InterfaceResult.DeleteMarkers.length;i++){
								console.log('DeleteMarker[' + i +  ']:');
								console.log('Key-->' + result.InterfaceResult.DeleteMarkers[i]['Key']);
								console.log('VersionId-->' + result.InterfaceResult.DeleteMarkers[i]['VersionId']);
							}
							console.log('\n');
						}
						
						/*
			             * List all the versions in way of pagination
			             */
						function listAll(nextKeyMarker,nextVersionIdMarker, pageSize, pageIndex){
							obs.listVersions({
								Bucket: bucketName,
								MaxKeys: pageSize,
								KeyMarker: nextKeyMarker,
								VersionIdMarker: nextVersionIdMarker
							}).then((result) => {
								if(result.CommonMsg.Status < 300){
									console.log('Page:' + pageIndex);
									console.log('Versions:');
									for(let j=0;j<result.InterfaceResult.Versions.length;j++){
										console.log('Version[' + j +  ']:');
										console.log('Key-->' + result.InterfaceResult.Versions[j]['Key']);
										console.log('VersionId-->' + result.InterfaceResult.Versions[j]['VersionId']);
									}
									console.log('DeleteMarkers:');
									for(let i=0;i<result.InterfaceResult.DeleteMarkers.length;i++){
										console.log('DeleteMarker[' + i +  ']:');
										console.log('Key-->' + result.InterfaceResult.DeleteMarkers[i]['Key']);
										console.log('VersionId-->' + result.InterfaceResult.DeleteMarkers[i]['VersionId']);
									}
									console.log('\n');
									if(result.InterfaceResult.IsTruncated === 'true'){
										listAll(result.InterfaceResult.NextKeyMarker, result.InterfaceResult.NextVersionIdMarker,pageSize, pageIndex + 1);
									}else{
										eventEmitter.emit('List all in way of pagination finished');
									}
								}
							});
						}
						console.log('List all the versions in way of pagination:');
						listAll(null, null, 10, 1);
						
					});
				});
				
				eventEmitter.on('List all in way of pagination finished', () => {
					console.log('List all versions group by folder');
					obs.listVersions({
						Bucket: bucketName,
						Delimiter: '/'
					}).then((result) => {
						if(result.CommonMsg.Status < 300){
							console.log('Root path:');
							console.log('Versions:');
							for(let j=0;j<result.InterfaceResult.Versions.length;j++){
								console.log('Version[' + j +  ']:');
								console.log('Key-->' + result.InterfaceResult.Versions[j]['Key']);
								console.log('VersionId-->' + result.InterfaceResult.Versions[j]['VersionId']);
							}
							console.log('DeleteMarkers:');
							for(let i=0;i<result.InterfaceResult.DeleteMarkers.length;i++){
								console.log('DeleteMarker[' + i +  ']:');
								console.log('Key-->' + result.InterfaceResult.DeleteMarkers[i]['Key']);
								console.log('VersionId-->' + result.InterfaceResult.DeleteMarkers[i]['VersionId']);
							}
							console.log('\n');
							
							
							var listVersionsByPrefix = function(commonPrefixes){
								for(let i=0;i<commonPrefixes.length;i++){
									obs.listVersions({
										Bucket: bucketName,
										Delimiter: '/',
										Prefix: commonPrefixes[i]['Prefix']
									}).then((result)=>{
										if(result.CommonMsg.Status < 300){
											console.log('Folder ' + commonPrefixes[i]['Prefix'] + ':');
											console.log('Versions:');
											for(let j=0;j<result.InterfaceResult.Versions.length;j++){
												console.log('Version[' + j +  ']:');
												console.log('Key-->' + result.InterfaceResult.Versions[j]['Key']);
												console.log('VersionId-->' + result.InterfaceResult.Versions[j]['VersionId']);
											}
											console.log('DeleteMarkers:');
											for(let i=0;i<result.InterfaceResult.DeleteMarkers.length;i++){
												console.log('DeleteMarker[' + i +  ']:');
												console.log('Key-->' + result.InterfaceResult.DeleteMarkers[i]['Key']);
												console.log('VersionId-->' + result.InterfaceResult.DeleteMarkers[i]['VersionId']);
											}
											console.log('\n');
											if(result.InterfaceResult.CommonPrefixes && result.InterfaceResult.CommonPrefixes.length > 0){
												listVersionsByPrefix(result.InterfaceResult.CommonPrefixes);
											}
										}
									});
								}
							};
							
							listVersionsByPrefix(result.InterfaceResult.CommonPrefixes);
						}
					});
				});
				
			}
		});
		
	}
});


var process = require('process');
var deleteVersionsFinished = false;
process.on('beforeExit', (code) => {
	if(!deleteVersionsFinished){
		
		obs.listVersions({
			Bucket: bucketName
		}).then((result)=>{
			if(result.CommonMsg.Status < 300){
				var keys = [];
				for(let j=0;j<result.InterfaceResult.Versions.length;j++){
					keys.push({Key:result.InterfaceResult.Versions[j]['Key'], VersionId: result.InterfaceResult.Versions[j]['VersionId']});
				}
				for(let i=0;i<result.InterfaceResult.DeleteMarkers;i++){
					keys.push({Key:result.InterfaceResult.DeleteMarkers[i]['Key'], VersionId: result.InterfaceResult.DeleteMarkers[i]['VersionId']});
				}
				obs.deleteObjects({
					Bucket: bucketName,
					Objects: keys
				}).then((result)=>{
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
			}
		});
		
		deleteVersionsFinished = true;
	}
});


