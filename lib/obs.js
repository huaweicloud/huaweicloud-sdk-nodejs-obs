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

const util = require('util');
const Utils = require('./utils');
const LogUtil = require('./log');
const enums = require('./enums');
const {
	MAX_UPLOAD_PART_COUNT,

	MIN_UPLOAD_PART_SIZE,
	MAX_UPLOAD_PART_SIZE,
	DEFAULT_UPLOAD_PART_SIZE,

	MIN_DOWNLOAD_PART_SIZE,
	MAX_DOWNLOAD_PART_SIZE,
	DEFAULT_DOWNLOAD_PART_SIZE,
} = enums;
function ObsClient(param){
	this.factory(param);
}

function capitalize(key){
	return key.slice(0,1).toUpperCase() + key.slice(1);
}

const methods = [
    'headBucket',
    'getBucketMetadata',
    'deleteBucket',
    'setBucketQuota',
    'getBucketQuota',
    'getBucketStorageInfo',
    'setBucketPolicy',
    'getBucketPolicy',
    'deleteBucketPolicy',
    'setBucketVersioningConfiguration',
    'getBucketVersioningConfiguration',
    'getBucketLocation',
    'listVersions',
    'listObjects',
    'setBucketLifecycleConfiguration',
    'getBucketLifecycleConfiguration',
    'deleteBucketLifecycleConfiguration',
    'setBucketAcl',
    'getBucketAcl',
    'setBucketLoggingConfiguration',
    'getBucketLoggingConfiguration',
    'setBucketWebsiteConfiguration',
    'getBucketWebsiteConfiguration',
    'deleteBucketWebsiteConfiguration',
    'setBucketNotification',
    'getBucketNotification',
    'setBucketTagging',
    'deleteBucketTagging',
    'getBucketTagging',
    'setObjectTagging',
    'deleteObjectTagging',
    'getObjectTagging',
    'setBucketReplication',
    'deleteBucketReplication',
    'getBucketReplication',
    'getObject',
    'setObjectMetadata',
    'getObjectMetadata',
    'setObjectAcl',
    'getObjectAcl',
    'deleteObject',
    'deleteObjects',
    'listMultipartUploads',
    'listParts',
    'abortMultipartUpload',
    'completeMultipartUpload',
    'setBucketCors',
    'getBucketCors',
    'deleteBucketCors',
    'optionsBucket',
    'optionsObject',
    'setBucketStoragePolicy',
    'getBucketStoragePolicy',
    'getBucketEncryption',
    'setBucketEncryption',
    'deleteBucketEncryption',
    'getBucketDirectColdAccess',
    'setBucketDirectColdAccess',
    'deleteBucketDirectColdAccess',
    'renameObject',
    'getBucketRequesterPayment',
    'setBucketRequesterPayment',
    'putBucketPublicAccessBlock',
    'getBucketPublicAccessBlock',
    'deleteBucketPublicAccessBlock',
    'getBucketPolicyPublicStatus',
    'getBucketPublicStatus',
    'setBucketCustomDomain',
    'getBucketCustomDomain',
    'deleteBucketCustomDomain',
    'setBucketInventory',
    'getBucketInventory',
    'listBucketInventory',
    'deleteBucketInventory',
    'setObjectLockConfiguration',
    'getObjectLockConfiguration',
    'setObjectRetention',
    'setBucketMirrorBackToSource',
    'getBucketMirrorBackToSource',
    'deleteBucketMirrorBackToSource',
    'setBucketCompressPolicy',
    'getBucketCompressPolicy',
    'deleteBucketCompressPolicy',
    'truncateObject',
];

function createAction(method){
	return function(param, callback){
		this.exec(capitalize(method), param, callback);
	};
}

for(let i=0;i<methods.length;i++){
	let method = methods[i];
	ObsClient.prototype[method] = createAction(method);
}

ObsClient.prototype.createBucket = function(param, callback){
	if(this.util && this.util.isCname){
		return callback('createBucket is not allowed in customdomain mode', null);
	}
	this.exec('CreateBucket', param, callback);
};

ObsClient.prototype.listBuckets = function(param, callback){
	if(this.util && this.util.isCname){
		return callback('listBuckets is not allowed in customdomain mode', null);
	}
	this.exec('ListBuckets', param, callback);
};

ObsClient.prototype.putObject = function(param, callback){
	
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of either a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'PutObject', err);
		}
		return callback(new Error(err), null);
	}
	
	if(!('ContentType' in param)){
		if('Key' in param){
			param.ContentType = this.util.mimeTypes[param.Key.substring(param.Key.lastIndexOf('.') + 1)];
		}
		if(!param.ContentType && ('SourceFile' in param)){
			param.ContentType = this.util.mimeTypes[param.SourceFile.substring(param.SourceFile.lastIndexOf('.') + 1)];
		}
	}
	
	this.exec('PutObject', param, callback);
};

ObsClient.prototype.modifyObject = function(param, callback){

	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of either a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'ModifyObject', err);
		}
		return callback(new Error(err), null);
	}

	if(!('ContentType' in param)){
		if('Key' in param){
			param.ContentType = this.util.mimeTypes[param.Key.substring(param.Key.lastIndexOf('.') + 1)];
		}
		if(!param.ContentType && ('SourceFile' in param)){
			param.ContentType = this.util.mimeTypes[param.SourceFile.substring(param.SourceFile.lastIndexOf('.') + 1)];
		}
	}

	this.exec('ModifyObject', param, callback);
};

ObsClient.prototype.appendObject = function(param, callback){
	
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of either a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'PutObject', err);
		}
		return callback(new Error(err), null);
	}
	
	if(!('ContentType' in param)){
		if('Key' in param){
			param.ContentType = this.util.mimeTypes[param.Key.substring(param.Key.lastIndexOf('.') + 1)];
		}
		if(!param.ContentType && ('SourceFile' in param)){
			param.ContentType = this.util.mimeTypes[param.SourceFile.substring(param.SourceFile.lastIndexOf('.') + 1)];
		}
	}
	
	this.exec('AppendObject', param, callback);
};

ObsClient.prototype.copyObject = function(param, callback){
	let key = 'CopySource';
	if(key in param){
		let val = param[key];
		let index = val.lastIndexOf('?versionId=');
		if(index > 0){
			param[key] = this.util.encodeURIWithSafe(val.slice(0, index)) + val.slice(index);
		}else{
			param[key] = this.util.encodeURIWithSafe(val);
		}
	}
	this.exec('CopyObject', param, callback);
};

ObsClient.prototype.copyPart = function(param, callback){
	let key = 'CopySource';
	if(key in param){
		let val = param[key];
		let index = val.lastIndexOf('?versionId=');
		if(index > 0){
			param[key] = this.util.encodeURIWithSafe(val.slice(0, index)) + val.slice(index);
		}else{
			param[key] = this.util.encodeURIWithSafe(val);
		}
	}
	this.exec('CopyPart', param, callback);
};

ObsClient.prototype.restoreObject = function(param, callback){
	this.exec('RestoreObject', param, function(err, result){
		if(!err && result.InterfaceResult && result.CommonMsg.Status < 300){
			result.InterfaceResult.RestoreStatus = result.CommonMsg.Status === 200 ? 'AVAILABLE' : 'INPROGRESS';
		}
		callback(err, result);
	});
};

ObsClient.prototype.initiateMultipartUpload = function(param, callback){
	if(!('ContentType' in param) && 'Key' in param){
		param.ContentType = this.util.mimeTypes[param.Key.substring(param.Key.lastIndexOf('.') + 1)];
	}
	this.exec('InitiateMultipartUpload', param, callback);
};


ObsClient.prototype.uploadPart = function(param, callback){
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of either a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'UploadPart', err);
		}
		return callback(new Error(err), null);
	}
	this.exec('UploadPart', param, callback);
};


ObsClient.prototype.uploadFile = function(param, callback){
	param = param || {};
	let _log = this.log;
	let obsClient = this;
	let funcName = 'uploadFile';
	let start = new Date().getTime();
	// 接收参数
	let progressCallback = param.ProgressCallback || function(){};
	let resumeCallback = param.ResumeCallback || function(){};
	callback = callback || function(){};
	let _callback = function(code, message, result){
		if(_log.isLevelEnabled('info')){
			_log.runLog('info', funcName, 'ObsClient cost ' +  (new Date().getTime()-start) + ' ms');
		}
		if(typeof code === 'string'){
			if(message){
				code += ':' + String(message);
			}
			callback(code, result);
			return;
		}
		callback(code ? (code.CommonMsg.Code + ':' + code.CommonMsg.Message) : null, result);
	};
	
	if(_log.isLevelEnabled('info')){
		_log.runLog('info', funcName, 'enter ' + funcName + '...' );
	}

	let bucket = param.Bucket;
	if(!bucket){
		_callback('InvalidArgument','Bucket is a required element!');
		return;
	}
	bucket = String(bucket);

	let key = param.Key;
	if(!key){
		_callback('InvalidArgument', 'Key is a required element!');
		return;
	}
	key = String(key);

	let uploadFile = param.UploadFile;
	if(!uploadFile){
		_callback('InvalidArgument', 'UploadFile is a required element!');
		return;
	}
	let fs = require('fs');
	uploadFile = String(uploadFile); 
	
	if(!fs.existsSync(uploadFile)){
		_callback('InvalidArgument', 'UploadFile does not exist!');
		return;
	}
	let fstat = fs.statSync(uploadFile);
	if(!fstat.isFile()){
		_callback('InvalidArgument', 'UploadFile is not a file!');
		return;
	}
	
	let fileSize = fstat.size;
	
	let enableCheckpoint = param.EnableCheckpoint;
	let checkpointFile = null;
	let enableCheckSum = false;

	let taskNum = parseInt(param.TaskNum, 10) || 20;
	
	// 确保 HTTP Agent maxSockets >= taskNum，避免连接竞争
	let ensureAgentMaxSockets = function(taskNum){
		if(obsClient.util.httpAgent && obsClient.util.httpAgent.maxSockets !== undefined && obsClient.util.httpAgent.maxSockets < taskNum){
			obsClient.util.httpAgent.maxSockets = taskNum;
		}
		if(obsClient.util.httpsAgent && obsClient.util.httpsAgent.maxSockets !== undefined && obsClient.util.httpsAgent.maxSockets < taskNum){
			obsClient.util.httpsAgent.maxSockets = taskNum;
		}
	};
	ensureAgentMaxSockets(taskNum);
	
	if(enableCheckpoint){
		checkpointFile = param.CheckpointFile;
		checkpointFile = (checkpointFile && checkpointFile !== '') ? String(checkpointFile) : uploadFile + '.upload_record';
		let pathLib = require('path');
		let fileDir = pathLib.dirname(checkpointFile);
		if(!fs.existsSync(fileDir)){
			let mkdirsSync = function(dirname){
			    if(fs.existsSync(dirname)){
			        return true;
			    }else{
			        if(mkdirsSync(pathLib.dirname(dirname))){
			            fs.mkdirSync(dirname);
			            return true;
			        }
			    }
			};
			mkdirsSync(fileDir);
		}
		enableCheckSum = param.EnableCheckSum;
	}
	if(_log.isLevelEnabled('debug')){
		_log.runLog('debug', funcName, 'Begin to uploadFile to OBS from file:' + uploadFile);
	}
	
	let events = require('events');
	let eventEmitter = new events.EventEmitter();
	
	let calculateUploadCheckpointMD5 = function(uploadCheckpoint){
		let data = [];
		data.push(uploadCheckpoint.bucketName);
		data.push(uploadCheckpoint.objectKey);
		data.push(uploadCheckpoint.uploadFile);
		data.push(String(uploadCheckpoint.partSize));
		data.push(String(uploadCheckpoint.partCount));
		if(uploadCheckpoint.contentType){
			data.push(uploadCheckpoint.contentType);
		}
		if(uploadCheckpoint.acl){
			data.push(uploadCheckpoint.acl);
		}
		if(uploadCheckpoint.websiteRedirectLocation){
			data.push(uploadCheckpoint.websiteRedirectLocation);
		}
		if(uploadCheckpoint.sseKms){
			data.push(uploadCheckpoint.sseKms);
		}
		if(uploadCheckpoint.sseKmsKey){
			data.push(uploadCheckpoint.sseKmsKey);
		}
		if(uploadCheckpoint.sseC){
			data.push(uploadCheckpoint.sseC);
		}
		if(uploadCheckpoint.sseCKey){
			data.push(uploadCheckpoint.sseCKey);
		}
		if(uploadCheckpoint.metadata){
			data.push(JSON.stringify(uploadCheckpoint.metadata));
		}
		if(uploadCheckpoint.uploadId){
			data.push(uploadCheckpoint.uploadId);
		}
		if(uploadCheckpoint.partsMeta && (uploadCheckpoint.partsMeta instanceof Object)){
			for(let key in uploadCheckpoint.partsMeta){
				if ({}.hasOwnProperty.call(uploadCheckpoint.partsMeta, key)) {
					data.push(String(key));
					let partMeta = uploadCheckpoint.partsMeta[key];
					if(partMeta){
						data.push(String(partMeta.offset));
						data.push(String(partMeta.partSize));
						data.push(String(partMeta.isCompleted));
						data.push(String(partMeta.etag));
					}
				}
			}
		}
		return obsClient.util.bufMD5(Buffer.from(data.join(''), 'utf8'));
	};
	
	let writeCheckpointFileSync = function(checkpointFile, uploadCheckpoint){
		try{
			fs.writeFileSync(checkpointFile, JSON.stringify(uploadCheckpoint));
			return true;
		}catch(e){
			_callback('WriteCheckpointFileError', e);
			if(_log.isLevelEnabled('debug')){
				_log.runLog('debug', funcName, 'Write checkpoint file failed and abort upload, uploadId ' + uploadCheckpoint.uploadId);
			}
			if(uploadCheckpoint.uploadId){
				obsClient.abortMultipartUpload({
					Bucket:uploadCheckpoint.bucketName,
					Key:uploadCheckpoint.objectKey,
					UploadId:uploadCheckpoint.uploadId,
				},function(e, r){
					if(!e && (r.CommonMsg.Status < 300 || r.CommonMsg.Status === 404)){
						fs.unlink(checkpointFile, function(){});
					}
				});
			}else{
				fs.unlink(checkpointFile, function(){});
			}
			return false;
		}
	};
	
	let abortRequest = function(uploadCheckpoint, checkpointFile, code, message){
		if(uploadCheckpoint && uploadCheckpoint.uploadId){
			obsClient.abortMultipartUpload({
				Bucket:uploadCheckpoint.bucketName,
				Key:uploadCheckpoint.objectKey,
				UploadId:uploadCheckpoint.uploadId,
			},function(e, r){
				if(!e && (r.CommonMsg.Status < 300 || r.CommonMsg.Status === 404)){
					if(checkpointFile){
						fs.unlink(checkpointFile, function(){});
					}
				}
				_callback(code, message);
			});
		}else{
			if(checkpointFile){
				fs.unlink(checkpointFile, function(){});
			}
			_callback(code, message);
		}
	};
	
	let transResultToError = function(result){
		let ret = [];
		if(result && result.CommonMsg){
			ret.push('Status:' + result.CommonMsg.Status);
			ret.push('Code:' + result.CommonMsg.Code);
			ret.push('Message:' + result.CommonMsg.Message);
		}
		return ret.join(',');
	};
	
	eventEmitter.on('start to uploadFile', function(uploadCheckpoint){
		if(!uploadCheckpoint){
			uploadCheckpoint = {};
		}
		if(!uploadCheckpoint.partsMeta){
			uploadCheckpoint.partsMeta = {};
		}
		let startToUploadFile = function(uploadId){
			let finishedCount = 0;
			let hasError = false;
			let isAbort = false;
			let finishedBytes = 0;
			if(uploadCheckpoint.partsMeta){
				for(let i of Object.keys(uploadCheckpoint.partsMeta)){
					if(uploadCheckpoint.partsMeta[i].isCompleted){
						finishedBytes += uploadCheckpoint.partSize
					}
				}
			}
			let partsLoaded = {};
			let startTime = new Date().getTime();

			resumeCallback({
				cancel : function(){
					isAbort = true;
					if(checkpointFile){
						writeCheckpointFileSync(checkpointFile, uploadCheckpoint);
					}
					_callback('Upload suspened', 'The process of uploadFile is suspened, you can try again')
				},
				abort : function(){
					isAbort = true;
					abortRequest(uploadCheckpoint, checkpointFile, 'Upload isAbort', 'The process of uploadFile is isAbort');
				},
			});

			let progressCallbacks = function(partNumber, loaded){
				if(isAbort){
					return;
				}
				finishedBytes += loaded;
				if(partsLoaded[partNumber]){
					finishedBytes -= partsLoaded[partNumber];
				}
				partsLoaded[partNumber] = loaded;
				progressCallback(finishedBytes, uploadCheckpoint.uploadFileStat.fileSize, (new Date().getTime() - startTime) / 1000);
			}; 

			// 段进度
			let createProgressCallbackByPartNumber = function(partNumber){
				return function(loaded, total, cost){
					progressCallbacks(partNumber, loaded);
				};
			};
			let completedRequest = function(){
				if(finishedCount === uploadCheckpoint.partCount){
					if(!hasError){
						// 确保 checkpoint 落盘
						if(checkpointFile){
							writeCheckpointFileSync(checkpointFile, uploadCheckpoint);
						}
						let parts = [];
						for(let partNumber in uploadCheckpoint.partsMeta){
							if ({}.hasOwnProperty.call(uploadCheckpoint.partsMeta, partNumber)) {
								parts.push({
									PartNumber : partNumber,
									ETag : uploadCheckpoint.partsMeta[partNumber].etag
								});
							}
						}
						obsClient.completeMultipartUpload({
							Bucket: uploadCheckpoint.bucketName,
							Key : uploadCheckpoint.objectKey,
							UploadId : uploadId,
							Parts: parts
						}, function(err, result){
							if(err || result.CommonMsg.Status >= 500){ 
								if(checkpointFile){
									_callback('IncompletedUpload', err ? err : transResultToError(result));
								}else{
									abortRequest(uploadCheckpoint, checkpointFile, 'UploadFileFailed', err ? err : transResultToError(result));
								}
							}else if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
								abortRequest(uploadCheckpoint, checkpointFile, result.CommonMsg.Code, result.CommonMsg.Message);
							}else{
								if(checkpointFile){
									fs.unlink(checkpointFile, function(){});
								}
								_callback(null, null, result);
							}
						});
					}else{
						if(checkpointFile){
							_callback('IncompletedUpload','UploadFile finished with error, you can retry with the same parameters');
						}else{
							abortRequest(uploadCheckpoint, checkpointFile, 'UploadFileFailed', 'UploadFile finished with error!');
						}
					}
				}
			};
			
			let nextPartIndex = 0;
			let activeCount = 0;
			let checkpointDirty = false;
			let checkpointWriting = false;

			let getPartInfo = function(partIndex){
				let partNumber = partIndex + 1;
				let offset = partIndex * uploadCheckpoint.partSize;
				let currPartSize = (partNumber === uploadCheckpoint.partCount) ? uploadCheckpoint.uploadFileStat.fileSize - offset : uploadCheckpoint.partSize;
				return {partNumber: partNumber, offset: offset, partSize: currPartSize};
			};

			let flushCheckpoint = function(){
				if(!checkpointFile){
					return;
				}
				if(checkpointWriting){
					checkpointDirty = true;
					return;
				}
				checkpointWriting = true;
				checkpointDirty = false;
				let data = JSON.stringify(uploadCheckpoint);
				fs.writeFile(checkpointFile, data, function(err){
					checkpointWriting = false;
					if(err){
						_callback('WriteCheckpointFileError', err);
						if(_log.isLevelEnabled('debug')){
							_log.runLog('debug', funcName, 'Write checkpoint file failed and abort upload, uploadId ' + uploadId);
						}
						if(uploadCheckpoint.uploadId){
							obsClient.abortMultipartUpload({
								Bucket:uploadCheckpoint.bucketName,
								Key:uploadCheckpoint.objectKey,
								UploadId:uploadCheckpoint.uploadId,
							},function(e, r){
								if(!e && (r.CommonMsg.Status < 300 || r.CommonMsg.Status === 404)){
									fs.unlink(checkpointFile, function(){});
								}
							});
						}else{
							fs.unlink(checkpointFile, function(){});
						}
						return;
					}
					if(checkpointDirty){
						flushCheckpoint();
					}
				});
			};

			let scheduleNext = function(){
				if(isAbort){
					return;
				}
				while(activeCount < taskNum && nextPartIndex < uploadCheckpoint.partCount){
					if(isAbort){
						return;
					}
					uploadSinglePart(nextPartIndex);
					nextPartIndex++;
				}
			};

			let uploadSinglePart = function(partIndex){
				let partInfo = getPartInfo(partIndex);
				let partNumber = partInfo.partNumber;

				if(uploadCheckpoint.partsMeta[partNumber] && uploadCheckpoint.partsMeta[partNumber].isCompleted){
					finishedCount++;
					flushCheckpoint();
					completedRequest();
					return;
				}

				activeCount++;
				let offset = partInfo.offset;
				let currPartSize = partInfo.partSize;
				obsClient.uploadPart({
					Bucket : uploadCheckpoint.bucketName,
					Key: uploadCheckpoint.objectKey,
					PartNumber: partNumber,
					UploadId : uploadId,
					SourceFile: uploadCheckpoint.uploadFile,
					Offset : offset,
					PartSize : currPartSize,
					SseC : uploadCheckpoint.sseC,
					SseCKey : uploadCheckpoint.sseCKey,
					ProgressCallback : createProgressCallbackByPartNumber(partNumber),
				}, function(err, result) {
					if(isAbort){
						return;
					}
					let partMeta = {offset : offset, partSize : currPartSize};
					if(err || result.CommonMsg.Status >= 500){
						partMeta.isCompleted = false;
						hasError = true;
					}else if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
						isAbort = true;
						abortRequest(uploadCheckpoint, checkpointFile, result.CommonMsg.Code, result.CommonMsg.Message);
						return;
					}else{
						partMeta.etag = result.InterfaceResult.ETag;
						partMeta.isCompleted = true;
					}
					uploadCheckpoint.partsMeta[partNumber] = partMeta;
					if(_log.isLevelEnabled('debug')){
						_log.runLog('debug', funcName, 'Part ' + String(partNumber) + ' is finished, uploadId ' + uploadId);
					}
					uploadCheckpoint.md5 = calculateUploadCheckpointMD5(uploadCheckpoint);
					flushCheckpoint();
					finishedCount++;
					activeCount--;
					if(finishedCount === uploadCheckpoint.partCount){
						completedRequest();
					}else{
						scheduleNext();
					}
				});
			};

			scheduleNext();
		};
		
		let uploadId = uploadCheckpoint.uploadId;
		if(!uploadId){
			let contentType = uploadCheckpoint.contentType ? uploadCheckpoint.contentType : obsClient.util.mimeTypes[key.substring(key.lastIndexOf('.') + 1)];
			
			if(!contentType){
				contentType = obsClient.util.mimeTypes[uploadFile.substring(uploadFile.lastIndexOf('.') + 1)];
			}
			
			obsClient.initiateMultipartUpload({
				Bucket : uploadCheckpoint.bucketName,
				Key : uploadCheckpoint.objectKey,
				ACL : uploadCheckpoint.acl,
				Metadata : uploadCheckpoint.metadata,
				WebsiteRedirectLocation : uploadCheckpoint.websiteRedirectLocation,
				ContentType : contentType,
				SseKms : uploadCheckpoint.sseKms,
				SseKmsKey : uploadCheckpoint.sseKmsKey,
				SseC : uploadCheckpoint.sseC,
				SseCKey : uploadCheckpoint.sseCKey,
				Expires : uploadCheckpoint.expires
			}, function(err, result){
				if(err){
					if(checkpointFile){
						fs.unlink(checkpointFile, function(){});
					}
					_callback('InitiateMultipartUploadFailed',err);
					return;
				}
				if(result.CommonMsg.Status >= 300){
					if(checkpointFile){
						fs.unlink(checkpointFile, function(){});
					}
					_callback(result);
					return;
				}
				
				uploadId = result.InterfaceResult.UploadId;
				uploadCheckpoint.uploadId = uploadId;
				uploadCheckpoint.md5 = calculateUploadCheckpointMD5(uploadCheckpoint);
				if(_log.isLevelEnabled('debug')){
					_log.runLog('debug', funcName, 'Claim a new upload id ' + uploadId);
				}
				if(checkpointFile && !writeCheckpointFileSync(checkpointFile, uploadCheckpoint)){
					return;
				}
				startToUploadFile(uploadId);
			});
		}else{
			startToUploadFile(uploadId);
		}
	});
	
	let uploadCheckpoint;
	let partSize = parseInt(param.PartSize, 10);
	let partCount;
	if(fileSize === 0){
		partSize = 0;
		partCount = 1;
	}else{
		if (isNaN(partSize) || partSize < MIN_UPLOAD_PART_SIZE || partSize > MAX_UPLOAD_PART_SIZE) {
			partSize = DEFAULT_UPLOAD_PART_SIZE;
		}
		partCount = Math.floor(fileSize / partSize);
		if (partCount > MAX_UPLOAD_PART_COUNT) {
			partCount = MAX_UPLOAD_PART_COUNT;
			partSize = Math.ceil(fileSize / partCount);
		} else {
			if(fileSize % partSize !== 0){
				partCount++;
			}
		}
	}
	if(_log.isLevelEnabled('debug')){
		_log.runLog('debug', funcName, 'Total parts count ' + partCount);
	}
	uploadCheckpoint = {bucketName: bucket, objectKey: key, uploadFile : uploadFile, partSize : partSize, partCount : partCount};
	uploadCheckpoint.contentType = param.ContentType;
	uploadCheckpoint.acl = param.ACL;
	uploadCheckpoint.websiteRedirectLocation = param.WebsiteRedirectLocation;
	uploadCheckpoint.sseKms = param.SseKms;
	uploadCheckpoint.sseKmsKey = param.SseKmsKey;
	uploadCheckpoint.sseC = param.sseC;
	uploadCheckpoint.sseCKey = param.SseCKey;
	uploadCheckpoint.metadata = param.Metadata;
	uploadCheckpoint.expires = param.Expires;
	uploadCheckpoint.md5 = calculateUploadCheckpointMD5(uploadCheckpoint);
	uploadCheckpoint.uploadFileStat = {fileSize : fileSize, lastModified : fstat.mtime.toUTCString()};
	
	if(checkpointFile){
		if(!fs.existsSync(checkpointFile)){// call uploadFile first time
			eventEmitter.on('start to writeFile', function(){
				fs.writeFile(checkpointFile, JSON.stringify(uploadCheckpoint), function(err){
					if(err){
						_callback('WriteCheckpointFileError',err);
						return;
					}
					eventEmitter.emit('start to uploadFile', uploadCheckpoint);
				});
			});
			if(enableCheckSum){
				obsClient.util.fileMD5(uploadFile, function(err, checkSum){
					if(err){
						checkSum = '';
					}
					uploadCheckpoint.uploadFileStat.checkSum = checkSum;
					eventEmitter.emit('start to writeFile');
				});
			}else{
				eventEmitter.emit('start to writeFile');
			}
		}else{
			fs.readFile(checkpointFile, function(err, data){
				if(err){
					fs.unlink(checkpointFile, function(){});
					_callback('ReadCheckpointFileError',err);
					return;
				}
				try{
					uploadCheckpoint = JSON.parse(data);
				}catch(e){
					fs.unlink(checkpointFile, function(){});
					_callback('ParseCheckpointFileError', e);
					return;
				}
				if(!uploadCheckpoint || uploadCheckpoint.bucketName !== bucket || uploadCheckpoint.objectKey !== key || uploadCheckpoint.uploadFile !== uploadFile ||
						!uploadCheckpoint.uploadFileStat || uploadCheckpoint.uploadFileStat.fileSize !== fstat.size || uploadCheckpoint.uploadFileStat.lastModified !== fstat.mtime.toUTCString() ||
						uploadCheckpoint.md5 !== calculateUploadCheckpointMD5(uploadCheckpoint)){
					abortRequest(uploadCheckpoint, checkpointFile, 'CheckpointFileInvalid', 'CheckpointFile is invalid!');
					return;
				}
				
				if(uploadCheckpoint.uploadFileStat.checkSum){
					obsClient.util.fileMD5(uploadFile, function(err, checkSum){
						if(err || checkSum !== uploadCheckpoint.uploadFileStat.checkSum){
							abortRequest(uploadCheckpoint, checkpointFile, 'CheckpointFileInvalid','CheckpointFile is invalid!');
							return;
						}
						eventEmitter.emit('start to uploadFile', uploadCheckpoint);
					});
				}else{
					eventEmitter.emit('start to uploadFile', uploadCheckpoint);
				}
			});
		}
	}else{
		eventEmitter.emit('start to uploadFile', uploadCheckpoint);
	}
};

// 当指定了参数DownloadFile，将使用此值作为保存文件名，否则使用对象名作为保存文件名， 保存时将覆盖同名文件。 
// 另外，还将使用 保存文件名+".obsnodejssdk.tmp"后缀的形式 作为下载过程中的临时中间文件名，且也会覆盖同名文件。
// 另外，当开启了断点延续下载（EnableCheckpoint=true），还将使用 参数CheckpointFile（如果没有指定CheckpointFile将使用对象名）+".obsnodejssdk.chkpt"后缀的形式 作为保存历史下载情况和校验信息的文件名，且也会覆盖同名文件。
ObsClient.prototype.downloadFile = function(param, callback){
	param = param || {};
	let _log = this.log;
	let obsClient = this;
	let funcName = 'downloadFile';
	let start = new Date().getTime();
	let progressCallback = param.ProgressCallback || function(){};
	let resumeCallback = param.ResumeCallback || function(){};
	callback = callback || function(){};
	let _callback = function(code, message, result){
		if(_log.isLevelEnabled('info')){
			_log.runLog('info', funcName, 'ObsClient cost ' +  (new Date().getTime() - start) + ' ms');
		}
		if(typeof code === 'string'){
			if(message){
				code += ':' + String(message);
			}
			callback(code, result);
		}else{
			callback(code ? (code.CommonMsg.Code + ':' + code.CommonMsg.Message) : null, result);
		}
	};
	
	_log.runLog('debug', funcName, 'enter ' + funcName + '...' );

	let bucket = param.Bucket;
	if(!bucket){
		_log.runLog('error', funcName, 'Bucket is a required element!');
		_callback('InvalidArgument','Bucket is a required element!');
		return;
	}
	bucket = String(bucket);
	
	let key = param.Key;
	if(!key){
		_log.runLog('error', funcName, 'Key is a required element!');
		_callback('InvalidArgument', 'Key is a required element!');
		return;
	}
	key = String(key);
	
	let pathLib = require('path');
	
	let downloadFile;
	if(!param.DownloadFile){
		downloadFile = require('process').cwd() + pathLib.sep + key;
		_log.runLog('info', funcName, 'DownloadFile is not set, will put file to path:' + downloadFile + ", by default");
	}else{
		downloadFile = String(param.DownloadFile);
	}
	let tmpSuffix = ".obsnodejssdk.tmp";
	let chkSuffix = ".obsnodejssdk.chkpt";
	let downloadTempFile = downloadFile + tmpSuffix;
	let fs = require('fs');

	let taskNum = parseInt(param.TaskNum, 10) || 10;
	
	// 确保 HTTP Agent maxSockets >= taskNum，避免连接竞争
	let ensureAgentMaxSockets = function(taskNum){
		if(obsClient.util.httpAgent && obsClient.util.httpAgent.maxSockets !== undefined && obsClient.util.httpAgent.maxSockets < taskNum){
			obsClient.util.httpAgent.maxSockets = taskNum;
		}
		if(obsClient.util.httpsAgent && obsClient.util.httpsAgent.maxSockets !== undefined && obsClient.util.httpsAgent.maxSockets < taskNum){
			obsClient.util.httpsAgent.maxSockets = taskNum;
		}
	};
	ensureAgentMaxSockets(taskNum);
	
	let initWriteAndClose4DownloadTmpFile = function(tmpFileFd, tmpFile, tmpFileSize, callback) {
		let buffer = Buffer.from('1', 'utf8');
		let start = new Date().getTime();
		fs.write(tmpFileFd, buffer, 0, 1, tmpFileSize - 1, (werr)=>{
			_log.runLog('debug', 'prepareDownloadTempFile', ` prepare ${tmpFile} cost ` + (new Date().getTime() - start) + ' ms');
			if(werr){
				_log.runLog('error', 'prepareDownloadTempFile', `ftruncate temp file:${tmpFile} failed , and cost: ${(new Date().getTime() - start) / 1000}`);
				_log.runLog('error', 'prepareDownloadTempFile', `ftruncate temp file:${tmpFile} failed , err:${werr.stack}`);
				fs.unlinkSync(tmpFile);
				return callback(false, tmpFile);
			}
			fs.close(tmpFileFd, (err)=>{
				if(err){
					_log.runLog('error', 'prepareDownloadTempFile', `close fd failed, err:${err.stack}`);
					fs.unlinkSync(tmpFile);
					return callback(false, tmpFile);
				}
				return callback(true, tmpFile);
			});
		});
	}

	let initDownloadTmpFile = function(tmpFile, tmpFileSize, callback) {
		fs.open(tmpFile, 'w', (oerr, fd)=>{
			if(oerr){
				_log.runLog('error', 'prepareDownloadTempFile', `create temp download file ${tmpFile}  failed, error:${oerr.stack}`);
				_callback('InnerError',  `create temp download file ${tmpFile}  failed, error:${oerr.stack}`);
				return callback(false, tmpFile);
			}

			let start = new Date().getTime();
			fs.ftruncate(fd, tmpFileSize, (terr)=>{
				if(terr){
					// 例如fat、exfat文件系统，将导致fs.ftruncate()报错
					initWriteAndClose4DownloadTmpFile(fd, tmpFile, tmpFileSize, callback);
				}
				else {
					_log.runLog('debug', 'prepareDownloadTempFile', ` prepare ${tmpFile} cost ` + (new Date().getTime() - start) + ' ms');
					fs.close(fd, (err)=>{
						if(err){
							_log.runLog('error', 'prepareDownloadTempFile', `close fd failed, err:${err.stack}`);
							fs.unlinkSync(tmpFile);
							return callback(false, tmpFile);
						}
						return callback(true, tmpFile);
					});
				}	
			});
		});	
	}

	const prepareDownloadTempFile = util.promisify((tmpFile, tmpFileSize, callback) => {
		if(fs.existsSync(tmpFile)){
			try{
				fs.unlinkSync(tmpFile);
			}catch(e){
				_log.runLog('error', 'prepareDownloadTempFile',  `delete ${tmpFile} file failed , exception: ${e}`);
				_callback('DeleteTempFileError', `delete ${tmpFile} file failed , exception: ${e}`);
				return;
			}
		}

		initDownloadTmpFile(tmpFile, tmpFileSize, callback);
	});

	let mkdirsSync = function(dirname){
		if(fs.existsSync(dirname)){
			return true;
		}else{
			if(mkdirsSync(pathLib.dirname(dirname))){
				fs.mkdirSync(dirname);
				return true;
			}
		}
	};

	obsClient.getObjectMetadata({
		Bucket : bucket,
		Key : key,
		VersionId : param.VersionId,
		SseC: param.SseC,
		SseCKey: param.SseCKey,
	}, function(err, result){
		_log.runLog('debug', funcName, ` getObjectMetadata of ${key} cost ` + (new Date().getTime() - start) + ' ms');

		let enableCheckpoint = param.EnableCheckpoint;
		let checkpointFile = null;
		
		if(enableCheckpoint){
			checkpointFile = param.CheckpointFile;
			checkpointFile = (checkpointFile && checkpointFile !== '') ? String(checkpointFile) : downloadFile + chkSuffix;
			let checkPointFileDir = pathLib.dirname(checkpointFile);
			if(!fs.existsSync(checkPointFileDir)){
				mkdirsSync(checkPointFileDir);
			}
		}
		
		let tempFileDir = pathLib.dirname(downloadTempFile);
		if(!fs.existsSync(tempFileDir)){
			mkdirsSync(tempFileDir);
		}
		
		if(err || result.CommonMsg.Status >= 500){
			_log.runLog('warn', funcName,  'the peer server occur exception!');
			_callback('GetObjectSizeError', err);
			return;
		}
		
		if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
			_log.runLog('warn', funcName,  result.CommonMsg.Message);
			_callback(result);
			return;
		}
		
		let objectSize = parseInt(result.InterfaceResult.ContentLength, 10);
		
		if(objectSize === 0){
			fs.writeFileSync(downloadFile, Buffer.from(''));
			callback(null, result);
			return;
		}
		
		let objestStat = result;
		
		let events = require('events');
		let eventEmitter = new events.EventEmitter();
		
		let calculateDownloadCheckpointMD5 = function(downloadCheckpoint){
			let data = [];
			data.push(downloadCheckpoint.bucketName);
			data.push(downloadCheckpoint.objectKey);
			data.push(downloadCheckpoint.downloadFile);
			data.push(String(downloadCheckpoint.partSize));
			data.push(String(downloadCheckpoint.partCount));
			if(downloadCheckpoint.versionId){
				data.push(downloadCheckpoint.versionId);
			}
			if(downloadCheckpoint.ifMatch){
				data.push(downloadCheckpoint.ifMatch);
			}
			if(downloadCheckpoint.ifModifiedSince){
				data.push(downloadCheckpoint.ifModifiedSince);
			}
			if(downloadCheckpoint.ifNoneMatch){
				data.push(downloadCheckpoint.ifNoneMatch);
			}
			if(downloadCheckpoint.ifUnmodifiedSince){
				data.push(downloadCheckpoint.ifUnmodifiedSince);
			}
			if(downloadCheckpoint.sseC){
				data.push(downloadCheckpoint.sseC);
			}
			if(downloadCheckpoint.sseCKey){
				data.push(downloadCheckpoint.sseCKey);
			}
			if(downloadCheckpoint.partsMeta && (downloadCheckpoint.partsMeta instanceof Object)){
				// key是分段段号，且在partsMeta上最小编号是1。  
				for(let key in downloadCheckpoint.partsMeta){
					if ({}.hasOwnProperty.call(downloadCheckpoint.partsMeta, key)) {
						data.push(String(key));
						let partMeta = downloadCheckpoint.partsMeta[key];
						if(partMeta){
							data.push(String(partMeta.startPos));
							data.push(String(partMeta.endPos));
							data.push(String(partMeta.isCompleted));
						}
					}
				}
			}
			return obsClient.util.bufMD5(Buffer.from(data.join(''), 'utf8'));
		};
		
		let writeCheckpointFileSync = function(checkpointFile, downloadCheckpoint){
			try{
				if(fs.existsSync(downloadTempFile)){
					let tempFileStat = fs.statSync(downloadTempFile);
					if(!downloadCheckpoint.tempFileStatus){
						downloadCheckpoint.tempFileStatus = {};
					}
					downloadCheckpoint.tempFileStatus.fileName = downloadTempFile;
					downloadCheckpoint.tempFileStatus.fileSize = tempFileStat.size;
					downloadCheckpoint.tempFileStatus.lastModified = tempFileStat.mtime.toUTCString();
				}
				fs.writeFileSync(checkpointFile, JSON.stringify(downloadCheckpoint));
				return true;
			}catch(e){
				fs.unlink(checkpointFile, function(){});
				fs.unlink(downloadTempFile, function(){});
				_callback('WriteCheckpointFileError', e);
				_log.runLog('error', funcName, 'Write checkpoint file failed, err: ' + e);
				return false;
			}
		};
		
		eventEmitter.on('start to downloadFile', function(downloadCheckpoint){
			if(!downloadCheckpoint){
				downloadCheckpoint = {};
			}
			
			if(!downloadCheckpoint.partsMeta){
				downloadCheckpoint.partsMeta = {};
			}
			
			_log.runLog('debug', funcName, 'Begin to downloadFile from OBS to:' + downloadFile);
			
			let finishedCount = 0;
			let hasError = false;
			let isAbort = false;
			let finishedBytes = 0;
			if(downloadCheckpoint.partsMeta){
				for(let i of Object.keys(downloadCheckpoint.partsMeta)){
					if(downloadCheckpoint.partsMeta[i].isCompleted){
						finishedBytes += downloadCheckpoint.partSize
					}
				}
			}
			let partsLoaded = {};
			let startTime = new Date().getTime();

			resumeCallback({
				cancel : function(){
					isAbort = true;
					if(checkpointFile){
						writeCheckpointFileSync(checkpointFile, downloadCheckpoint);
					}
					_callback('Download suspened', 'The process of downloadFile is suspened, you can try again')
				}
			});

			let progressCallbacks = function(partNumber, loaded){
				if(isAbort){
					return;
				}
				finishedBytes += loaded;
				if(partsLoaded[partNumber]){
					finishedBytes -= partsLoaded[partNumber];
				}
				partsLoaded[partNumber] = loaded;
				progressCallback(finishedBytes, downloadCheckpoint.objectStatus.objectSize, (new Date().getTime() - startTime) / 1000);
			}; 

			// 段进度
			let createProgressCallbackByStartPart = function(partNumber){
				return function(loaded, total, cost){
					progressCallbacks(partNumber, loaded);
				};
			};
			let tryCompletedDownload = function(){
				if(finishedCount !== downloadCheckpoint.partCount){
					return;
				}

				_log.runLog('debug', funcName, ` getObject of ${key} cost ` + (new Date().getTime() - start) + ' ms');

				if(!hasError){
					// 确保 checkpoint 落盘
					if(checkpointFile){
						writeCheckpointFileSync(checkpointFile, downloadCheckpoint);
					}
					fs.rename(downloadTempFile, downloadFile, function(err){
						if(err){
							_log.runLog('error', 'completedDownload',  `DownloadFile finished but rename temp file error: ${err.stack}`);
							if(checkpointFile){
								if(!writeCheckpointFileSync(checkpointFile, downloadCheckpoint)){
									return;
								}
								_callback('IncompletedDownload',`you can retry with the same parameters, DownloadFile finished but rename temp file error: ${err.stack}`);
							}else{
								try { fs.unlinkSync(downloadTempFile); } catch(e) {}
								_callback('DownloadFileFailed', `DownloadFile finished but rename temp file error: ${err.stack}`);
							}
							return;
						}

						// rename成功后，删除checkpointFile
						if(checkpointFile){
							try { fs.unlinkSync(checkpointFile); } catch(e) {}
						}
						if(result && result.InterfaceResult){
							delete result.InterfaceResult.ContentLength;
						}
						_callback(null, null, result);
					});
				}else{	
					if(checkpointFile){
						if(!writeCheckpointFileSync(checkpointFile, downloadCheckpoint)){
							return;
						}
						_callback('IncompletedDownload','DownloadFile finished with error, you can retry with the same parameters');
					}else{
						try { fs.unlinkSync(downloadTempFile); } catch(e) {}
						_callback('DownloadFileFailed','DownloadFile finished with error');
					}
				}
			};
			
			let nextPartIndex = 0;
			let activeCount = 0;
			let checkpointDirty = false;
			let checkpointWriting = false;

			let getDownloadPartInfo = function(partIndex){
				let partNumber = partIndex + 1;
				let startPos = partIndex * downloadCheckpoint.partSize;
				let endPos = (partNumber === downloadCheckpoint.partCount) ? (downloadCheckpoint.objectStatus.objectSize - 1) : (partNumber * downloadCheckpoint.partSize - 1);
				return {partNumber: partNumber, startPos: startPos, endPos: endPos};
			};

			let flushDownloadCheckpoint = function(){
				if(!checkpointFile){
					return;
				}
				if(checkpointWriting){
					checkpointDirty = true;
					return;
				}
				checkpointWriting = true;
				checkpointDirty = false;
				fs.stat(downloadTempFile, function(statErr, stat){
					if(!statErr){
						if(!downloadCheckpoint.tempFileStatus){
							downloadCheckpoint.tempFileStatus = {};
						}
						downloadCheckpoint.tempFileStatus.fileName = downloadTempFile;
						downloadCheckpoint.tempFileStatus.fileSize = stat.size;
						downloadCheckpoint.tempFileStatus.lastModified = stat.mtime.toUTCString();
					}
					let data = JSON.stringify(downloadCheckpoint);
					fs.writeFile(checkpointFile, data, function(err){
						checkpointWriting = false;
						if(err){
							_callback('WriteCheckpointFileError', err);
							_log.runLog('error', funcName, 'Write checkpoint file failed, err: ' + err);
							return;
						}
						if(checkpointDirty){
							flushDownloadCheckpoint();
						}
					});
				});
			};

			let scheduleNextDownload = function(){
				if(isAbort){
					return;
				}
				while(activeCount < taskNum && nextPartIndex < downloadCheckpoint.partCount){
					if(isAbort){
						return;
					}
					downloadSinglePart(nextPartIndex);
					nextPartIndex++;
				}
			};

			let downloadSinglePart = function(partIndex){
				let partInfo = getDownloadPartInfo(partIndex);
				let partNumber = partInfo.partNumber;

				if(downloadCheckpoint.partsMeta[partNumber] && downloadCheckpoint.partsMeta[partNumber].isCompleted){
					finishedCount++;
					flushDownloadCheckpoint();
					tryCompletedDownload();
					return;
				}

				activeCount++;
				let startPos = partInfo.startPos;
				let endPos = partInfo.endPos;
				let partStartTime = new Date().getTime();

				obsClient.getObject({
					Bucket: downloadCheckpoint.bucketName,
					Key: downloadCheckpoint.objectKey,
					VersionId : downloadCheckpoint.versionId,
					Range: 'bytes=' + startPos + '-' + endPos,
					SaveAsStream : true,
					IfMatch : downloadCheckpoint.ifMatch,
					IfModifiedSince : downloadCheckpoint.ifModifiedSince,
					IfNoneMatch : downloadCheckpoint.ifNoneMatch,
					IfUnmodifiedSince : downloadCheckpoint.ifUnmodifiedSince,
					SseC : downloadCheckpoint.sseC,
					SseCKey : downloadCheckpoint.sseCKey,
					ProgressCallback : createProgressCallbackByStartPart(partNumber),
				}, function(err, result) {
					_log.runLog('debug', funcName, ` get part data, first to get the response, cost ` + (new Date().getTime() - partStartTime) + ' ms');

					let partMeta = {startPos : startPos, endPos : endPos};

					if(err || result.CommonMsg.Status >= 500){
						partMeta.isCompleted = false;
						hasError = true;
						downloadCheckpoint.partsMeta[partNumber] = partMeta;
						downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
						flushDownloadCheckpoint();
						finishedCount++;
						activeCount--;
						_callback('DownloadFileFailed','the peer server occur exception!');
						_log.runLog('warn', funcName, 'the peer server occur exception!');
						scheduleNextDownload();
						tryCompletedDownload();
					}else if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
						isAbort = true;
						_callback(result);
						_log.runLog('warn', funcName,  result.CommonMsg.Message);
						return;
					}else{
						// savePartIdata: pipe stream to temp file
						let stream;
						try{
							let res = result.InterfaceResult.Content;

							stream = fs.createWriteStream(downloadTempFile, {
								flags : 'r+',
								start : startPos,
								autoClose: true
							});
							stream.on('error', (streamErr) => {
								hasError = true;
								partMeta.isCompleted = false;
								downloadCheckpoint.partsMeta[partNumber] = partMeta;
								downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
								flushDownloadCheckpoint();
								finishedCount++;
								activeCount--;
								_log.runLog('warn', funcName, `write to downloadTempFile occur exception : ${streamErr.stack}`);
								_callback('DownloadFileFailed',`write to downloadTempFile occur exception : ${streamErr.stack}`);
								delete result.InterfaceResult.Content;
								scheduleNextDownload();
								tryCompletedDownload();
							});

							res.on('error', (resErr) => {
								hasError = true;
								try {
									stream.close();
								} catch (error) {
									_log.runLog('warn', funcName, 'close downloadTempFile stream failed!');
								}
								partMeta.isCompleted = false;
								downloadCheckpoint.partsMeta[partNumber] = partMeta;
								downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
								flushDownloadCheckpoint();
								finishedCount++;
								activeCount--;
								_log.runLog('warn', funcName, `getObject occur exception during the processing data time : ${resErr.stack}!`);
								_callback('DownloadFileFailed',`getObject occur exception during the processing data time : ${resErr.stack}!`);
								delete result.InterfaceResult.Content;
								scheduleNextDownload();
								tryCompletedDownload();
							}).on('end', () => {
								if (!res.complete) {
									hasError = true;
									partMeta.isCompleted = false;
									_log.runLog('warn', funcName, 'getObject occur exception that does not complete the data transmission!');
									_callback('DownloadFileFailed','getObject occur exception that does not complete the data transmission!');
									delete result.InterfaceResult.Content;
								}
								else {
									partMeta.isCompleted = true;
								}
								downloadCheckpoint.partsMeta[partNumber] = partMeta;
								downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
								flushDownloadCheckpoint();
								finishedCount++;
								activeCount--;
								scheduleNextDownload();
								tryCompletedDownload();
							});

							res.pipe(stream, {end: true});
						}catch(e){
							hasError = true;
							partMeta.isCompleted = false;
							downloadCheckpoint.partsMeta[partNumber] = partMeta;
							downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
							flushDownloadCheckpoint();
							finishedCount++;
							activeCount--;
							_log.runLog('warn', funcName, 'write to downloadTempFile occering execption:' + e);
							scheduleNextDownload();
							tryCompletedDownload();
						}
					}
				});
			};

			scheduleNextDownload();
		});
		
		let downloadCheckpoint;
		let _tmpDownloadCheckpoint;
		let partSize = parseInt(param.PartSize, 10);
		if (isNaN(partSize) || partSize < MIN_DOWNLOAD_PART_SIZE || partSize > MAX_DOWNLOAD_PART_SIZE) {
			partSize = DEFAULT_DOWNLOAD_PART_SIZE;
		}
		let partCount = objectSize % partSize === 0 ? Math.floor(objectSize / partSize) : Math.floor(objectSize / partSize) + 1;
		_log.runLog('debug', funcName, 'Total parts count ' + partCount);
		downloadCheckpoint = {bucketName: bucket, objectKey: key, downloadFile : downloadFile, partSize : partSize, partCount : partCount};
		downloadCheckpoint.versionId = param.VersionId;
		downloadCheckpoint.ifMatch = param.IfMatch;
		downloadCheckpoint.ifModifiedSince = param.IfModifiedSince;
		downloadCheckpoint.ifNoneMatch = param.IfNoneMatch;
		downloadCheckpoint.ifUnmodifiedSince = param.IfUnmodifiedSince;
		downloadCheckpoint.sseC = param.SseC;
		downloadCheckpoint.sseCKey = param.SseCKey;
		downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
		downloadCheckpoint.objectStatus = {objectSize : objectSize, lastModified : objestStat.InterfaceResult.LastModified, etag: objestStat.InterfaceResult.ETag};
		
		let tryContinueDownload_noChkFile = function() {
			fs.writeFile(checkpointFile, JSON.stringify(downloadCheckpoint), function(err){
				if(err){
					_log.runLog('error', funcName, `failed to write to checkpointFile: ${err.stack}`);
					_callback('WriteCheckpointFileError', `failed to write to checkpointFile: ${err.stack}`);
					return;
				}
				prepareDownloadTempFile(downloadTempFile, objectSize, (isPrepareSucceed, tmpFile) => {
					if(isPrepareSucceed){
						eventEmitter.emit('start to downloadFile', downloadCheckpoint);
					}
				}).catch((reason) => {
					_log.runLog('error', funcName, 'failed to download file: ' + key + ', reason: ' + reason);
				});
			});
		}

		let verifyDownloadTempFileStatus = function(tempFileStatusInChk){
			if(!tempFileStatusInChk || !tempFileStatusInChk.fileName || !tempFileStatusInChk.lastModified || !tempFileStatusInChk.fileSize){
				_log.runLog('warn',  'verifyTempFileStatus' , ' tempFileStatus infomation is not integrity.');
				return false;
			}

			if(!fs.existsSync(downloadTempFile)){
				_log.runLog('warn', 'verifyTempFileStatus',  downloadTempFile + ' does not exist.');
				return false;
			}

			let tempFileStat = fs.statSync(downloadTempFile);
			if( tempFileStatusInChk.fileName !== downloadTempFile 
				|| tempFileStatusInChk.lastModified !== tempFileStat.mtime.toUTCString() 
				|| tempFileStatusInChk.fileSize !==  tempFileStat.size){
				_log.runLog('warn',  'verifyTempFileStatus' , ' the tempFileStatus information in checkpointfile is not consistent.');
				return false;
			}

			return true;
		};

		let tryContinueDownload_hasChkFile = function() {
			fs.readFile(checkpointFile, function(err, data){
				_tmpDownloadCheckpoint = downloadCheckpoint;

				if(err){
					_log.runLog('error', funcName, `read checkpointFile occur error: ${err.stack}`);
					fs.unlink(checkpointFile, function(){});
					_callback('ReadCheckpointFileError', `read checkpointFile occur error: ${err.stack}`);
				}
				else {
					try{
						downloadCheckpoint = JSON.parse(data);
					}catch(e){
						_log.runLog('error', funcName, 'pasre checkpointFile data occur exception : ' + e);
						fs.unlink(checkpointFile, function(){});
						_callback('ParseCheckpointFileError', 'pasre checkpointFile data occur exception : ' + e);
						return;
					}
				}
				
				// verify : downloadTempFile  vs  checkpointfile
				if(!downloadCheckpoint || downloadCheckpoint.bucketName !== bucket || downloadCheckpoint.objectKey !== key || downloadCheckpoint.downloadFile !== downloadFile || 
						!downloadCheckpoint.objectStatus || downloadCheckpoint.objectStatus.objectSize !== objectSize || downloadCheckpoint.objectStatus.lastModified !== objestStat.InterfaceResult.LastModified || downloadCheckpoint.objectStatus.etag !== objestStat.InterfaceResult.ETag 
						|| !verifyDownloadTempFileStatus(downloadCheckpoint.tempFileStatus) || downloadCheckpoint.md5 !== calculateDownloadCheckpointMD5(downloadCheckpoint)){
					// 校验不通过，不使用延续下载，需执行prepareDownloadTempFile()
					fs.unlink(checkpointFile, function(){});
					_log.runLog('warn',  funcName , 'CheckpointFile is invalid!');

					downloadCheckpoint = _tmpDownloadCheckpoint;
					prepareDownloadTempFile(downloadTempFile, objectSize, (isPrepareSucceed, tmpFile) => {
						if(isPrepareSucceed){
							eventEmitter.emit('start to downloadFile', downloadCheckpoint);
						}
					}).catch((reason) => {
						_log.runLog('error', funcName, 'failed to download file: ' + key + ', reason: ' + reason);
					});
				}
				else {
					// 校验通过，使用断点延续下载，即不执行prepareDownloadTempFile()
					_log.runLog('debug',  funcName , 'CheckpointFile is valid!');
					eventEmitter.emit('start to downloadFile', downloadCheckpoint);
				}
				
			});
		}

		let tryContinueDownload = function() {
			if(!fs.existsSync(checkpointFile)){
				tryContinueDownload_noChkFile();
			}else{
				tryContinueDownload_hasChkFile();
			}
		}

		if(checkpointFile){
			// 启用l了断点续接下载
			tryContinueDownload();
		}else{
			// 没有启用断点续接下载
			prepareDownloadTempFile(downloadTempFile, objectSize, (isPrepareSucceed, tmpFile) => {
				if(isPrepareSucceed){
					eventEmitter.emit('start to downloadFile', downloadCheckpoint);
				}
			}).catch((reason) => {
				_log.runLog('error', funcName, 'failed to download file: ' + key + ', reason: ' + reason);
			});
		}
	});
};

function isFunction(obj){
	return Object.prototype.toString.call(obj) === '[object Function]';
}

function createPromise(current){
	return function(param, callback){
		if(isFunction(param)){
			current.call(this, null, param);
			return;
		}
		if(isFunction(callback)){
			current.call(this, param, callback);
			return;
		}
		
		let that = this;
		return new Promise(function(resolve, reject) {
			current.call(that, param, function(err, result){
				if(err){
					return reject(err);
				}
				resolve(result);
			});
		});
	};
}

if(isFunction(Promise)){
	for(let key in ObsClient.prototype){
		if ({}.hasOwnProperty.call(ObsClient.prototype, key)) {
			let current = ObsClient.prototype[key];
			ObsClient.prototype[key] = createPromise(current);
		}
	}
}

ObsClient.prototype.close = function(){
	if(this.util){
		this.util.close();
		delete this.util;
	}
};

ObsClient.prototype.refreshShadowClient = function () {
  if (this.util) {
    this.util.refreshShadowClient();
	}
};

ObsClient.prototype.exec = function(funcName, param, callback){
	let _log = this.log;
	if(_log.isLevelEnabled('info')){
		_log.runLog('info', funcName, 'enter ' + funcName + '...' );
	}
	let start = new Date().getTime();
	param = param || {};
	let _callback = function(err, msg){
		if(_callback.$called){
			return;
		}
		_callback.$called = true;
		if(_log.isLevelEnabled('info')){
			_log.runLog('info', funcName, 'ObsClient cost ' +  (new Date().getTime() - start) + ' ms');
		}
		
		if(err && !(err instanceof Error)){
			err = new Error(err);
		}
		callback(err, msg);
	};
	this.util.exec(funcName, param , _callback);
};

ObsClient.prototype.initLog = function(param){
	param = param || {};
	this.log.initLog(param.file_full_path, param.max_log_size, param.backups, param.level, param.log_to_console, param.name, param.logger);
	if(this.log.isLevelEnabled('warn')){
		let msg = ['[OBS SDK Version=' + this.util.obsSdkVersion];
		if(this.util.server){
			let port = this.util.port ? ':' + this.util.port : '';
			msg.push('Endpoint=' + (this.util.is_secure? 'https' : 'http') + '://' + this.util.server + port);
		}
		msg.push('Access Mode=' + (this.util.path_style ? 'Path' : 'Virtual Hosting') + ']');
		this.log.runLog('warn', 'init', msg.map(function(m) { return '[' + m + ']'; }).join(''));
	}
};

ObsClient.prototype.factory = function(param){
	this.log = new LogUtil();
	this.util = new Utils(this.log);
	param = param || {};
	this.util.initFactory(param.access_key_id, param.secret_access_key, param.is_secure,
			param.server, param.path_style, param.signature, param.region, param.port, param.max_retry_count,
			param.timeout, param.ssl_verify, param.long_conn_param, param.security_token, param.is_signature_negotiation, param.is_cname,
			param.max_connections, param.http_agent, param.https_agent, param.user_agent, param.third_http_lib, param.no_proxy_list,param.is_shadow_client, param.iam_domain, param.shadow_expires, param.verify_host_name);
};

ObsClient.prototype.refresh = function(access_key_id, secret_access_key, security_token,is_shadow_client){
	this.util.refresh(access_key_id, secret_access_key, security_token,is_shadow_client);
};

ObsClient.prototype.enums = enums;

ObsClient.prototype.createV2SignedUrlSync = function(param){
	return this.util.createV2SignedUrlSync(param);
};

ObsClient.prototype.createV4SignedUrlSync = function(param){
	return this.util.createV4SignedUrlSync(param);
};


ObsClient.prototype.createSignedUrlSync = function(param){
	return this.util.createSignedUrlSync(param);
};

ObsClient.prototype.createV4PostSignatureSync = function(param){
	return this.util.createV4PostSignatureSync(param);
};

ObsClient.prototype.createPostSignatureSync = function(param){
	return this.util.createPostSignatureSync(param);
};

for(let key in ObsClient.prototype){
	if ({}.hasOwnProperty.call(ObsClient.prototype, key)) {
		ObsClient.prototype[capitalize(key)] = ObsClient.prototype[key];
	}
}

for(let key in ObsClient.prototype){
	if ({}.hasOwnProperty.call(ObsClient.prototype, key)) {
		let index = key.indexOf('Configuration');
		if (index > 0 && index + 'Configuration'.length === key.length) {
			ObsClient.prototype[key.slice(0, index)] = ObsClient.prototype[key];
		}
	}
}

module.exports = ObsClient;

