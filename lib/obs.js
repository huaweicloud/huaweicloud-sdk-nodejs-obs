
'use strict';

const Utils = require('./utils');
const LogUtil = require('./log');
const enums = require('./enums');

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
	'setBucketReplication',
	'deleteBucketReplication',
	'getBucketReplication',
	'getObject',
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
	'getBucketStoragePolicy'
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
		callback('createBucket is not allowed in customdomain mode', null);
		return;
	}
	this.exec('CreateBucket', param, callback);
};

ObsClient.prototype.listBuckets = function(param, callback){
	if(this.util && this.util.isCname){
		callback('listBuckets is not allowed in customdomain mode', null);
		return;
	}
	this.exec('ListBuckets', param, callback);
};

ObsClient.prototype.putObject = function(param, callback){
	
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of eigther a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'PutObject', err);
		}
		callback(err, null);
		return;
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


ObsClient.prototype.appendObject = function(param, callback){
	
	if(('Body' in param) && ('SourceFile' in param)){
		let err = 'the input body and sourcefile exist at same time,please specify one of eigther a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'PutObject', err);
		}
		callback(err, null);
		return;
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
			result.InterfaceResult.RestoreStatus = result.CommonMsg.Status === 200 ? 'AVALIABLE' : 'INPROGRESS';
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
		let err = 'the input body and sourcefile exist at same time,please specify one of eigther a string or file to be send!';
		if(this.log.isLevelEnabled('error')){
			this.log.runLog('error', 'UploadPart', err);
		}
		callback(err, null);
		return;
	}
	this.exec('UploadPart', param, callback);
};


ObsClient.prototype.uploadFile = function(param, callback){
	param = param || {};
	var _log = this.log;
	var obsClient = this;
	var funcName = 'uploadFile';
	var start = new Date().getTime();
	callback = callback || function(){};
	var _callback = function(code, message, result){
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
	
	var bucket = param.Bucket;
	if(!bucket){
		_callback('InvalidArgument','Bucket is a required element!');
		return;
	}
	bucket = String(bucket);
	
	var key = param.Key;
	if(!key){
		_callback('InvalidArgument', 'Key is a required element!');
		return;
	}
	key = String(key);
	
	var uploadFile = param.UploadFile;
	if(!uploadFile){
		_callback('InvalidArgument', 'UploadFile is a required element!');
		return;
	}
	var fs = require('fs');
	uploadFile = String(uploadFile); 
	
	if(!fs.existsSync(uploadFile)){
		_callback('InvalidArgument', 'UploadFile does not exist!');
		return;
	}
	var fstat = fs.statSync(uploadFile);
	if(!fstat.isFile()){
		_callback('InvalidArgument', 'UploadFile is not a file!');
		return;
	}
	
	var fileSize = fstat.size;
	
	var enableCheckpoint = Boolean(param.EnableCheckpoint);
	var checkpointFile = null;
	var enableCheckSum = false;
	
	var taskNum = parseInt(param.TaskNum) || 20;
	
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
		enableCheckSum = Boolean(param.EnableCheckSum); 
	}
	if(_log.isLevelEnabled('debug')){
		_log.runLog('debug', funcName, 'Begin to uploadFile to OBS from file:' + uploadFile);
	}
	
	var events = require('events');
	var eventEmitter = new events.EventEmitter();
	
	var calculateUploadCheckpointMD5 = function(uploadCheckpoint){
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
		return obsClient.util.bufMD5(Buffer.from(data.join(''), 'utf8'));
	};
	
	var writeCheckpointFileSync = function(checkpointFile, uploadCheckpoint){
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
	
	var abortRequest = function(uploadCheckpoint, checkpointFile, code, message){
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
	
	var transResultToError = function(result){
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
		var startToUploadFile = function(uploadId){
			let finishedCount = 0;
			let hasError = false;
			let isAbort = false;
			let completedRequest = function(){
				if(finishedCount === uploadCheckpoint.partCount){
					if(!hasError){
						let parts = [];
						for(let partNumber in uploadCheckpoint.partsMeta){
							parts.push({
								PartNumber : partNumber,
								ETag : uploadCheckpoint.partsMeta[partNumber].etag
							});
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
			
			eventEmitter.on('doUpload', function(currentGroupIndex, groupCount, taskNum){
				let start = (currentGroupIndex - 1) * taskNum;
				let end = (currentGroupIndex === groupCount) ? uploadCheckpoint.partCount : currentGroupIndex * taskNum;
				let finishedCountGroup = 0;
				while(start<end){
					if(isAbort){
						return;
					}
					let partNumber = start + 1;
					if(uploadCheckpoint.partsMeta[partNumber] && uploadCheckpoint.partsMeta[partNumber].isCompleted){
						finishedCount++;
						finishedCountGroup++;
						let _taskNum = (currentGroupIndex === groupCount) ? (uploadCheckpoint.partCount - (currentGroupIndex - 1) * taskNum) : taskNum;
						if(finishedCountGroup === _taskNum && finishedCount < uploadCheckpoint.partCount){
							eventEmitter.emit('doUpload', currentGroupIndex + 1, groupCount, taskNum);
						}
						completedRequest();
					}else{
						let offset = start * uploadCheckpoint.partSize;
						let currPartSize = (start + 1 === uploadCheckpoint.partCount) ? uploadCheckpoint.uploadFileStat.fileSize - offset : uploadCheckpoint.partSize;
						obsClient.uploadPart({
							Bucket : uploadCheckpoint.bucketName,
							Key: uploadCheckpoint.objectKey,
							PartNumber: partNumber,
							UploadId : uploadId,
							SourceFile: uploadCheckpoint.uploadFile,
							Offset : offset,
							PartSize : currPartSize,
							SseC : uploadCheckpoint.sseC,
							SseCKey : uploadCheckpoint.sseCKey
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
							if(checkpointFile && !writeCheckpointFileSync(checkpointFile, uploadCheckpoint)){
								return;
							}
							finishedCount++;
							finishedCountGroup++;
							let _taskNum = (currentGroupIndex === groupCount) ? (uploadCheckpoint.partCount - (currentGroupIndex - 1) * taskNum) : taskNum;
							if(finishedCountGroup === _taskNum && finishedCount < uploadCheckpoint.partCount){
								eventEmitter.emit('doUpload', currentGroupIndex + 1, groupCount, taskNum);
							}
							completedRequest();
						});
					}
					start++;
				}
			});
			
			let groupCount = (uploadCheckpoint.partCount % taskNum === 0) ? (uploadCheckpoint.partCount / taskNum) : (Math.floor(uploadCheckpoint.partCount / taskNum) + 1);
			eventEmitter.emit('doUpload', 1, groupCount, taskNum);
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
				SseCKey : uploadCheckpoint.sseCKey
			}, function(err, result){
				if(err){
					if(checkpointFile){
						fs.unlink(checkpointFile, function(){});
					}
					_callback('InitateMultipartUploadFailed',err);
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
	
	var uploadCheckpoint;
	var partSize = parseInt(param.PartSize);
	var partCount;
	if(fileSize === 0){
		partSize = 0;
		partCount = 1;
	}else{
		partSize = isNaN(partSize) ? 5 * 1024 * 1024 : (partSize < 5 * 1024 * 1024 ? 5 * 1024 * 1024 : (partSize > 5 * 1024 * 1024 * 1024 ? 5 * 1024 * 1024 * 1024 : partSize));
		partCount = Math.floor(fileSize / partSize);
		if(fileSize % partSize !== 0){
			partCount++;
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

ObsClient.prototype.downloadFile = function(param, callback){
	param = param || {};
	var _log = this.log;
	var obsClient = this;
	var funcName = 'downloadFile';
	var start = new Date().getTime();
	callback = callback || function(){};
	var _callback = function(code, message, result){
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
	
	if(_log.isLevelEnabled('info')){
		_log.runLog('info', funcName, 'enter ' + funcName + '...' );
	}
	
	var bucket = param.Bucket;
	if(!bucket){
		_callback('InvalidArgument','Bucket is a required element!');
		return;
	}
	bucket = String(bucket);
	
	var key = param.Key;
	if(!key){
		_callback('InvalidArgument', 'Key is a required element!');
		return;
	}
	key = String(key);
	
	var pathLib = require('path');
	
	var downloadFile;
	if(!param.DownloadFile){
		downloadFile = require('process').cwd() + pathLib.sep + key;
		if(_log.isLevelEnabled('info')){
			_log.runLog('info', funcName, 'DownloadFile is not set, will put file to path:' + downloadFile);
		}
	}else{
		downloadFile = String(param.DownloadFile);
	}
	var downloadTempFile = downloadFile + '.temp';
	var fs = require('fs');
	
	var taskNum = parseInt(param.TaskNum) || 20;
	
	obsClient.getObjectMetadata({
		Bucket : bucket,
		Key : key,
		VersionId : param.VersionId,
	}, function(err, result){
		
		let enableCheckpoint = Boolean(param.EnableCheckpoint);
		let checkpointFile = null;
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
		if(enableCheckpoint){
			checkpointFile = param.CheckpointFile;
			checkpointFile = (checkpointFile && checkpointFile !== '') ? String(checkpointFile) : downloadFile + '.download_record';
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
			_callback('GetObjectSizeError', err);
			return;
		}
		
		if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
			fs.unlink(downloadTempFile, function(){});
			if(checkpointFile){
				fs.unlink(checkpointFile, function(){});
			}
			_callback(result);
			return;
		}
		
		let objectSize = parseInt(result.InterfaceResult.ContentLength);
		
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
				for(let key in downloadCheckpoint.partsMeta){
					data.push(String(key));
					let partMeta = downloadCheckpoint.partsMeta[key];
					if(partMeta){
						data.push(String(partMeta.startPos));
						data.push(String(partMeta.endPos));
						data.push(String(partMeta.isCompleted));
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
					downloadCheckpoint.tempFileStatus.fileSize = tempFileStat.size;
					downloadCheckpoint.tempFileStatus.lastModified = tempFileStat.mtime.toUTCString();
				}
				fs.writeFileSync(checkpointFile, JSON.stringify(downloadCheckpoint));
				return true;
			}catch(e){
				fs.unlink(checkpointFile, function(){});
				fs.unlink(downloadTempFile, function(){});
				_callback('WriteCheckpointFileError', e);
				if(_log.isLevelEnabled('warn')){
					_log.runLog('warn', funcName, 'Write checkpoint file failed');
				}
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
			if(_log.isLevelEnabled('debug')){
				_log.runLog('debug', funcName, 'Begin to downloadFile from OBS to:' + downloadFile);
			}
			
			fs.open(downloadTempFile, 'a', function(err, fd){
				if(err){
					if(checkpointFile){
						fs.unlink(checkpointFile, function(){});
					}
					_callback('OpenDownloadTempFileError',err);
					return;
				}
				let finishedCount = 0;
				let hasError = false;
				let isAbort = false;
				
				let completedDownload = function(result){
					if(finishedCount === downloadCheckpoint.partCount){
						try{
							fs.closeSync(fd);
						}catch(e){
							if(_log.isLevelEnabled('debug')){
								_log.runLog('debug', funcName, 'Close temp file error :' + e);
							}
						}
						if(!hasError){
							fs.rename(downloadTempFile, downloadFile, function(err){
								if(err){
									if(checkpointFile){
										if(!writeCheckpointFileSync(checkpointFile, downloadCheckpoint)){
											return;
										}
										_callback('IncompletedDownload','DownloadFile finished but rename temp file error, you can retry with the same parameters, err:' + err);
									}else{
										fs.unlink(downloadTempFile, function(){});
										_callback('DownloadFileFailed','DownloadFile finished but rename temp file error');
									}
									return;
								}
								if(checkpointFile){
									fs.unlink(checkpointFile, function(){});
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
								fs.unlink(downloadTempFile, function(){});
								_callback('DownloadFileFailed','DownloadFile finished with error');
							}
						}
					}
				};
				
				eventEmitter.on('doDownload', function(currentGroupIndex, groupCount, taskNum){
					let start = (currentGroupIndex - 1) * taskNum;
					let end = (currentGroupIndex === groupCount) ? downloadCheckpoint.partCount : currentGroupIndex * taskNum;
					let finishedCountGroup = 0;
					while(start < end){
						if(isAbort){
							return;
						}
						let i = start + 1;
						if(downloadCheckpoint.partsMeta[i] && downloadCheckpoint.partsMeta[i].isCompleted){
							finishedCount++;
							finishedCountGroup++;
							let _taskNum = (currentGroupIndex === groupCount) ? (downloadCheckpoint.partCount - (currentGroupIndex - 1) * taskNum) : taskNum;
							if(finishedCountGroup === _taskNum && finishedCount < downloadCheckpoint.partCount){
								eventEmitter.emit('doDownload', currentGroupIndex + 1, groupCount, taskNum);
							}
							completedDownload();
						}else{
							let startPos = (i-1) * downloadCheckpoint.partSize;
							let endPos = (i === downloadCheckpoint.partCount) ? (downloadCheckpoint.objectStatus.objectSize-1) : (i * downloadCheckpoint.partSize - 1);
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
								SseCKey : downloadCheckpoint.sseCKey
							}, function(err, result) {
								if(isAbort){
									return;
								}
								let partMeta = {startPos : startPos, endPos : endPos};
								if(err || result.CommonMsg.Status >= 500){
									partMeta.isCompleted = false;
									hasError = true;
									downloadCheckpoint.partsMeta[i] = partMeta;
									downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
									if(checkpointFile && !writeCheckpointFileSync(checkpointFile, downloadCheckpoint)){
										return;
									}
									finishedCount++;
									finishedCountGroup++;
									let _taskNum = (currentGroupIndex === groupCount) ? (downloadCheckpoint.partCount - (currentGroupIndex - 1) * taskNum) : taskNum;
									if(finishedCountGroup === _taskNum && finishedCount < downloadCheckpoint.partCount){
										eventEmitter.emit('doDownload', currentGroupIndex + 1, groupCount, taskNum);
									}
									completedDownload();
								}else if(result.CommonMsg.Status >= 300 && result.CommonMsg.Status < 500){
									isAbort = true;
									try{
										fs.closeSync(fd);
									}catch(e){
										if(_log.isLevelEnabled('debug')){
											_log.runLog('debug', funcName, 'Close temp file error :' + e);
										}
									}
									if(checkpointFile){
										fs.unlink(checkpointFile, function(){});
									}
									fs.unlink(downloadTempFile, function(){});
									_callback(result);
									return;
								}else{
									let _startPos = startPos;
									result.InterfaceResult.Content.on('data', function(data){
										fs.write(fd, data, 0, data.length, _startPos, function(err){
											if(err && partMeta.isCompleted === undefined){
												partMeta.isCompleted = false;
												hasError = true;
												downloadCheckpoint.partsMeta[i] = partMeta;
												downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
												if(checkpointFile && !writeCheckpointFileSync(checkpointFile, downloadCheckpoint)){
													return;
												}
												finishedCount++;
												finishedCountGroup++;
												let _taskNum = (currentGroupIndex === groupCount) ? (downloadCheckpoint.partCount - (currentGroupIndex - 1) * taskNum) : taskNum;
												if(finishedCountGroup === _taskNum && finishedCount < downloadCheckpoint.partCount){
													eventEmitter.emit('doDownload', currentGroupIndex + 1, groupCount, taskNum);
												}
												completedDownload();
												return;
											}
										});
										_startPos += data.length;
									}).on('error', function(){
										if(partMeta.isCompleted === undefined){
											partMeta.isCompleted = false;
											hasError = true;
											downloadCheckpoint.partsMeta[i] = partMeta;
											downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
											if(checkpointFile && !writeCheckpointFileSync(checkpointFile, downloadCheckpoint)){
												return;
											}
											finishedCount++;
											finishedCountGroup++;
											let _taskNum = (currentGroupIndex === groupCount) ? (downloadCheckpoint.partCount - (currentGroupIndex - 1) * taskNum) : taskNum;
											if(finishedCountGroup === _taskNum && finishedCount < downloadCheckpoint.partCount){
												eventEmitter.emit('doDownload', currentGroupIndex + 1, groupCount, taskNum);
											}
											completedDownload();
										}
									}).on('end',function(){
										if(partMeta.isCompleted === undefined){
											partMeta.isCompleted = true;
											downloadCheckpoint.partsMeta[i] = partMeta;
											downloadCheckpoint.md5 = calculateDownloadCheckpointMD5(downloadCheckpoint);
											if(checkpointFile && !writeCheckpointFileSync(checkpointFile, downloadCheckpoint)){
												return;
											}
											finishedCount++;
											finishedCountGroup++;
											let _taskNum = (currentGroupIndex === groupCount) ? (downloadCheckpoint.partCount - (currentGroupIndex - 1) * taskNum) : taskNum;
											if(finishedCountGroup === _taskNum && finishedCount < downloadCheckpoint.partCount){
												eventEmitter.emit('doDownload', currentGroupIndex + 1, groupCount, taskNum);
											}
											delete result.InterfaceResult.Content;
											completedDownload(result);
										}
									});
								}
							});
						}
						start++;
					}
					
				});
				let groupCount = (downloadCheckpoint.partCount % taskNum === 0) ? (downloadCheckpoint.partCount / taskNum) : (Math.floor(downloadCheckpoint.partCount / taskNum) + 1);
				eventEmitter.emit('doDownload', 1, groupCount, taskNum);
			});

		});
		
		let downloadCheckpoint;
		let partSize = parseInt(param.PartSize);
		partSize = isNaN(partSize) ? 5 * 1024 * 1024 : (partSize > 0 ? partSize : 5 * 1024 * 1024);
		let partCount = objectSize % partSize === 0 ? Math.floor(objectSize / partSize) : Math.floor(objectSize / partSize) + 1;
		if(_log.isLevelEnabled('debug')){
			_log.runLog('debug', funcName, 'Total parts count ' + partCount);
		}
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
		
		if(checkpointFile){
			if(!fs.existsSync(checkpointFile)){// call downloadFile first time
				if(fs.existsSync(downloadTempFile)){
					try{
						fs.unlinkSync(downloadTempFile);
					}catch(e){
						_callback('DeleteTempFileError', e);
						return;
					}
				}
				fs.writeFile(checkpointFile, JSON.stringify(downloadCheckpoint), function(err){
					if(err){
						_callback('WriteCheckpointFileError',err);
						return;
					}
					eventEmitter.emit('start to downloadFile', downloadCheckpoint);
				});
			}else{
				fs.readFile(checkpointFile, function(err, data){
					if(err){
						fs.unlink(checkpointFile, function(){});
						fs.unlink(downloadTempFile, function(){});
						_callback('ReadCheckpointFileError',err);
						return;
					}
					try{
						downloadCheckpoint = JSON.parse(data);
					}catch(e){
						fs.unlink(checkpointFile, function(){});
						fs.unlink(downloadTempFile, function(){});
						_callback('ParseCheckpointFileError', e);
						return;
					}
					// check if temp file is valid
					let verifyTempFileStatus = function(tempFileStatus){
						if(!tempFileStatus){
							return true;
						}
						if(!fs.existsSync(downloadTempFile)){
							return false;
						}
						return true;
						// Do not verify the tempFileStatus so as to support program crash situation
//						let fstat = fs.statSync(downloadTempFile);
//						return tempFileStatus.fileSize === fstat.size && tempFileStatus.lastModified === fstat.mtime.toUTCString();
					};
					//verify
					if(!downloadCheckpoint || downloadCheckpoint.bucketName !== bucket || downloadCheckpoint.objectKey !== key || downloadCheckpoint.downloadFile !== downloadFile || 
							!downloadCheckpoint.objectStatus || downloadCheckpoint.objectStatus.objectSize !== objectSize || downloadCheckpoint.objectStatus.lastModified !== objestStat.InterfaceResult.LastModified ||
							downloadCheckpoint.objectStatus.etag !== objestStat.InterfaceResult.ETag || !verifyTempFileStatus(downloadCheckpoint.tempFileStatus) || downloadCheckpoint.md5 !== calculateDownloadCheckpointMD5(downloadCheckpoint)){
						fs.unlink(checkpointFile, function(){});
						fs.unlink(downloadTempFile, function(){});
						_callback('CheckpointFileError', 'CheckpointFile is invalid!');
						return;
					}
					eventEmitter.emit('start to downloadFile', downloadCheckpoint);
				});
			}
		}else{
			if(fs.existsSync(downloadTempFile)){
				try{
					fs.unlinkSync(downloadTempFile);
				}catch(e){
					_callback('DeleteTempFileError', e);
					return;
				}
			}
			eventEmitter.emit('start to downloadFile', downloadCheckpoint);
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
					reject(err);
					return;
				}
				resolve(result);
			});
		});
	};
}

try{
	if(Promise){
		for(let key in ObsClient.prototype){
			let current = ObsClient.prototype[key];
			ObsClient.prototype[key] = createPromise(current);
		}
	}
}catch(e){
	console.log(e);
}

ObsClient.prototype.close = function(){
	if(this.util){
		this.util.close();
		delete this.util;
	}
};

ObsClient.prototype.exec = function(funcName, param, callback){
	var _log = this.log;
	if(_log.isLevelEnabled('info')){
		_log.runLog('info', funcName, 'enter ' + funcName + '...' );
	}
	var start = new Date().getTime();
	param = param || {};
	var _callback = function(err, msg){
		if(_callback.$called){
			return;
		}
		_callback.$called = true;
		if(_log.isLevelEnabled('info')){
			_log.runLog('info', funcName, 'ObsClient cost ' +  (new Date().getTime() - start) + ' ms');
		}
		callback(err, msg);
	};
	this.util.exec(funcName, param , _callback);
};

ObsClient.prototype.initLog = function(param){
	param = param || {};
	this.log.initLog(param.file_full_path, param.max_log_size, param.backups, param.level, param.log_to_console, param.name);
	if(this.log.isLevelEnabled('warn')){
		var msg = ['[OBS SDK Version=' + this.util.obsSdkVersion];
		if(this.util.server){
			let port = this.util.port ? ':' + this.util.port : '';
			msg.push('Endpoint=' + (this.util.is_secure? 'https' : 'http') + '://' + this.util.server + port);
		}
		msg.push('Access Mode=' + (this.util.path_style ? 'Path' : 'Virtual Hosting') + ']');
		this.log.runLog('warn', 'init', msg.join('];['));
	}
};

ObsClient.prototype.factory = function(param){
	this.log = new LogUtil();
	this.util = new Utils(this.log);
	param = param || {};
	this.util.initFactory(param.access_key_id, param.secret_access_key, param.is_secure,
			param.server, param.path_style, param.signature, param.region, param.port, param.max_retry_count, 
			param.timeout, param.ssl_verify, param.long_conn_param, param.security_token, param.is_signature_negotiation, param.is_cname);
};

ObsClient.prototype.refresh = function(access_key_id, secret_access_key, security_token){
	this.util.refresh(access_key_id, secret_access_key, security_token);
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
	ObsClient.prototype[capitalize(key)] = ObsClient.prototype[key];
}

for(let key in ObsClient.prototype){
	let index = key.indexOf('Configuration');
	if(index > 0 && index + 'Configuration'.length === key.length){
		ObsClient.prototype[key.slice(0, index)] = ObsClient.prototype[key];
	}
}

module.exports = ObsClient;

