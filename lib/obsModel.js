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


const owner = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'Owner',
	'parameters' : {
		'ID' : {
			'sentAs' : 'ID',
		}
	}
};

const initiator = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'Initiator',
	'parameters' : {
		'ID' : {
			'sentAs' : 'ID',
		},
	},
};
const commonPrefixes = {
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'CommonPrefixes',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'Prefix' : {
				'sentAs' : 'Prefix',
			},
			'MTime': {
				'sentAs': 'MTime',
			},
			'InodeNo': {
				'sentAs': 'InodeNo',
			}
		}
	}
};

const grants = {
	'type' : 'array',
	'location' : 'xml',
	'wrapper' : 'AccessControlList',
	'sentAs' : 'Grant',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'Grantee' : {
				'type' : 'object',
				'sentAs' : 'Grantee',
				'parameters' : {
					'Type' : {
						'type' : 'ignore',
					},
					'ID' : {
						'sentAs' : 'ID',
						'notAllowEmpty' : true,
					},
					'URI' : {
						'sentAs' :  'Canned',
						'type' : 'adapter',
						'notAllowEmpty' : true,
					}
				},
			},
			'Permission' : {
				'sentAs' : 'Permission',
			},
			'Delivered' :{
				'sentAs' : 'Delivered',
			}
		},
	},
};

const grantsV2 = {
	'type' : 'array',
	'location' : 'xml',
	'wrapper' : 'AccessControlList',
	'sentAs' : 'Grant',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'Grantee' : {
				'data' : {
					'xsiNamespace' : 'http://www.w3.org/2001/XMLSchema-instance',
					'xsiType' : 'Type',
				},
				'type' : 'object',
				'sentAs' : 'Grantee',
				'parameters' : {
					'Type' : {
						'type' : 'ignore',
					},
					'ID' : {
						'sentAs' : 'ID',
						'notAllowEmpty' : true,
					},
					'Name' : {
						'sentAs' : 'DisplayName',
						'notAllowEmpty' : true,
					},
					'URI' : {
						'sentAs' :  'URI',
						'type' : 'adapter',
						'notAllowEmpty' : true,
					}
				},
			},
			'Permission' : {
				'sentAs' : 'Permission',
			},
		},
	},
};

const loggingEnabled = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'LoggingEnabled',
	'parameters' : {
		'TargetBucket' : {
			'sentAs' : 'TargetBucket',
		},
		'TargetPrefix' : {
			'sentAs' : 'TargetPrefix',
		},
		'TargetGrants' : {
			'type' : 'array',
			'wrapper' : 'TargetGrants',
			'sentAs' : 'Grant',
			'items' : {
				'type' : 'object',
				'parameters' : {
					'Grantee' : {
						'type' : 'object',
						'sentAs' : 'Grantee',
						'parameters' : {
							'Type' : {
								'type' : 'ignore',
							},
							'ID' : {
								'sentAs' : 'ID',
							},
							'URI' : {
								'sentAs' :  'Canned',
								'type' : 'adapter'
							}
						},
					},
					'Permission' : {
						'sentAs' : 'Permission',
					},
				},
			},
		},
	},
};

const rules = {
	'required' : true,
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'Rule',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'ID' : {
				'sentAs' : 'ID',
			},
			'Prefix' : {
				'sentAs' : 'Prefix',
			},
			'Status' : {
				'sentAs' : 'Status',
			},
			'Transitions' : {
				'type' : 'array',
				'sentAs' : 'Transition',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'StorageClass' :{
							'sentAs' : 'StorageClass',
							'type' : 'adapter'
						},
						'Date' : {
							'sentAs' : 'Date',
						},
						'Days' : {
							'type' : 'number',
							'sentAs' : 'Days'
						}
					}
				}
			},
			'Expiration' : {
				'type' : 'object',
				'sentAs' : 'Expiration',
				'parameters' : {
					'Date' : {
						'sentAs' : 'Date',
					},
					'Days' : {
						'type' : 'number',
						'sentAs' : 'Days'
					},
				},
			},
			'NoncurrentVersionTransitions' :{
				'type' : 'array',
				'sentAs' : 'NoncurrentVersionTransition',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'StorageClass' :{
							'sentAs' : 'StorageClass',
							'type' : 'adapter'
						},
						'NoncurrentDays' : {
							'type' : 'number',
							'sentAs' : 'NoncurrentDays'
						}
					}
				}
			},
			'NoncurrentVersionExpiration' : {
				'type' : 'object',
				'sentAs' : 'NoncurrentVersionExpiration',
				'parameters' : {
					'NoncurrentDays' : {
						'type' : 'number',
						'sentAs' : 'NoncurrentDays',
					},
				},
			}
		},
	},
};

const redirectAllRequestsTo = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'RedirectAllRequestsTo',
	'parameters' : {
		'HostName' : {
			'sentAs' : 'HostName',
		},
		'Protocol' : {
			'sentAs' : 'Protocol',
		},
	}
};

const routingRules = {
	'type' : 'array',
	'wrapper' : 'RoutingRules',
	'location' : 'xml',
	'sentAs' : 'RoutingRule',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'Condition' : {
				'type' : 'object',
				'sentAs' : 'Condition',
				'parameters' : {
					'HttpErrorCodeReturnedEquals' : {
						'sentAs' : 'HttpErrorCodeReturnedEquals',
					},
					'KeyPrefixEquals' : {
						'sentAs' : 'KeyPrefixEquals',
					},
				},
			},
			'Redirect' : {
				'type' : 'object',
				'sentAs' : 'Redirect',
				'parameters' : {
					'HostName' : {
						'sentAs' : 'HostName',
					},
					'HttpRedirectCode' : {
						'sentAs' : 'HttpRedirectCode',
					},
					'Protocol' : {
						'sentAs' : 'Protocol',
					},
					'ReplaceKeyPrefixWith' : {
						'sentAs' : 'ReplaceKeyPrefixWith',
					},
					'ReplaceKeyWith' : {
						'sentAs' : 'ReplaceKeyWith',
					}
				}
			},
		},
	},
};

const indexDocument = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'IndexDocument',
	'parameters' : {
		'Suffix' : {
			'sentAs' : 'Suffix',
		},
	}
};

const errorDocument = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'ErrorDocument',
	'parameters' : {
		'Key' : {
			'sentAs' : 'Key',
		},
	}
};

const corsRule = {
	'required' : true,
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'CORSRule',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'ID' : {
				'sentAs' : 'ID',
			},
			'AllowedMethod' : {
				'type' : 'array',
				'sentAs' : 'AllowedMethod',
				'items' : {
					'type' : 'string',
				},
			},
			'AllowedOrigin' : {
				'type' : 'array',
				'sentAs' : 'AllowedOrigin',
				'items' : {
					'type' : 'string',
				},
			},
			'AllowedHeader' : {
				'type' : 'array',
				'sentAs' : 'AllowedHeader',
				'items' : {
					'type' : 'string',
				},
			},
			'MaxAgeSeconds' : {
				'type' : 'number',
				'sentAs' : 'MaxAgeSeconds',
			},
			'ExposeHeader' : {
				'type' : 'array',
				'sentAs' : 'ExposeHeader',
				'items' : {
					'type' : 'string',
				},
			},
		},
	},
};

const functionGraphConfiguration = {
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'FunctionGraphConfiguration',
	'items' : {
		'type' : 'object',
		'location' : 'xml',
		'parameters' : {
			'ID' : {
				'sentAs' : 'Id'
			},
			'Filter' : {
				'type' : 'object',
				'parameters' : {
					'FilterRules' : {
						'wrapper' : 'Object',
						'type' : 'array',
						'sentAs' : 'FilterRule',
						'items' : {
							'type' : 'object',
							'parameters' : {
								'Name' : {},
								'Value' : {}
							}
						}
					}
				}
			},
			'FunctionGraph' : {},
	
			'Event' : {
				'type' : 'array',
				'items' : {
					'type' : 'adapter',
				}
			}
		}
	}	
};

const topicConfiguration = {
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'TopicConfiguration',
	'items' : {
		'type' : 'object',
		'location' : 'xml',
		'parameters' : {
			'ID' : {
				'sentAs' : 'Id'
			},
			'Filter' : {
				'type' : 'object',
				'parameters' : {
					'FilterRules' : {
						'wrapper' : 'Object',
						'type' : 'array',
						'sentAs' : 'FilterRule',
						'items' : {
							'type' : 'object',
							'parameters' : {
								'Name' : {},
								'Value' : {}
							}
						}
					}
				}
			},
			'Topic' : {},
	
			'Event' : {
				'type' : 'array',
				'items' : {
					'type' : 'adapter',
				}
			}
		}
	}
};

const tagSet = {
	'required' : true,
	'type' : 'array',
	'location' : 'xml',
	'wrapper' : 'TagSet',
	'sentAs' : 'Tag',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'Key' : {
				'sentAs' : 'Key',
			},
			'Value' : {
				'sentAs' : 'Value',
			}
		}
	}
};

const replicationRules = {
	'required' : true,
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'Rule',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'ID' : {
				'sentAs' : 'ID',
			},
			'Prefix' : {
				'sentAs' : 'Prefix',
			},
			'Status' : {
				'sentAs' : 'Status',
			},
			'Destination' :{
				'type' : 'object',
				'sentAs' : 'Destination',
				'parameters' :{
					'Bucket' : {
						'sentAs' : 'Bucket',
						'type' : 'adapter'
					},
					'StorageClass' :{
						'sentAs' : 'StorageClass',
						'type' : 'adapter'
					}
				}
			}
		},
	}
};

const bucketEncryptionRule = {
	'type': 'object',
	'location': 'xml',
	'sentAs': 'Rule',
	'parameters': {
		'ApplyServerSideEncryptionByDefault': {
			'type': 'object',
			'sentAs': 'ApplyServerSideEncryptionByDefault',
			'parameters': {
				'SSEAlgorithm': {
					'sentAs': 'SSEAlgorithm'
				},
				'KMSMasterKeyID': {
					'sentAs': 'KMSMasterKeyID'
				}
			}
		}
	}
};

const operations = {
	'CreateBucket' : {
		'httpMethod' : 'PUT',
		'data' : {
			'xmlRoot' : 'CreateBucketConfiguration',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Location' : {
				'location' : 'xml',
				'sentAs' : 'Location' 
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			
			'GrantWrite' : {
				'location' : 'header',
				'sentAs' : 'grant-write',
				'withPrefix' : true,
			},
			
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			
			'GrantReadDelivered' : {
				'location' : 'header',
				'sentAs' : 'grant-read-delivered',
				'withPrefix' : true,
			},
			
			'GrantFullControlDelivered' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control-delivered',
				'withPrefix' : true,
			},

			'AzRedundancy': {
				'location': 'header',
				'sentAs': 'x-obs-az-redundancy'
			},
			'MultiEnterprise': {
				'location': 'header',
				'sentAs': 'epid',
				'withPrefix': true
			},
			'FileInterface':{
				'location' : 'header',
				'sentAs' : 'fs-file-interface',
				'withPrefix': true
			},
		}
	},
	
	'ListBuckets' : {
		'httpMethod' : 'GET',
		'parameters' : {
			'BucketType': {
				'location': 'header',
				'sentAs': 'bucket-type',
				'withPrefix': true
			}
		}
	},

	'ListBucketsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListAllMyBucketsResult',
		},
		'parameters' : {
			'Owner' : {
				'type' : 'object',
				'location' : 'xml',
				'sentAs' : 'Owner',
				'parameters' : {
					'ID' : {
						'sentAs' : 'ID',
					},
				},

			},
			'Buckets' : {
				'type' : 'array',
				'location' : 'xml',
				'wrapper' : 'Buckets',
				'sentAs' : 'Bucket',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'BucketName' : {
							'sentAs' : 'Name',
						},
						'CreationDate' : {
							'sentAs' : 'CreationDate'
						},
						'Location' : {
							'sentAs' : 'Location'
						}
					},
				},
			},
		},
	},
	
	'HeadBucket' : {
		'httpMethod' : 'HEAD',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	
	'HeadApiVersion' : {
		'httpMethod' : 'HEAD',
		'urlPath' : 'apiversion',
		'parameters' : {
			'Bucket' : {
				'location' : 'uri',
			},
		},
	},
	
	'HeadApiVersionOutput' : {
		'parameters' : {
			'ApiVersion' : {
				'location' : 'header',
				'sentAs' : 'x-obs-api'
			},
		}
	},


	'GetBucketMetadata' : {
		'httpMethod' : 'HEAD',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},

			'Origin' : {
				'location' : 'header',
				'sentAs' : 'Origin'
			},

			'RequestHeader' : {
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers'
			}
		},
	},

	'GetBucketMetadataOutput' : {
		'parameters' : {
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true
			},
			'StorageClassObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-storage-class',
			},
			'StorageClassV2' : {
				'location' : 'header',
				'sentAs' : 'x-default-storage-class',
			},
			'ObsVersion' : {
				'location' : 'header',
				'sentAs' : 'version',
				'withPrefix' : true
			},
			'ObsVersionObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version',
			},
			'ObsVersionV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version',
			},
			'FsInterface': {
				'location': 'header',
				'sentAs': 'fs-file-interface',
				'withPrefix': true
			},
			'FsInterfaceObs': {
				'location': 'header',
				'sentAs': 'x-obs-fs-file-interface',
			},
			'FsInterfaceV2': {
				'location': 'header',
				'sentAs': 'x-amz-fs-file-interface',
			},
			'Location' : {
				'location' : 'header',
				'sentAs' : 'bucket-location',
				'withPrefix' : true
			},
			'LocationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-bucket-location',
			},
			'LocationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-bucket-region',
			},
			'AzRedundancy': {
				'location': 'header',
				'sentAs': 'x-obs-az-redundancy'
			},
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin'
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age'
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers'
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods'
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers'
			},
			'MultiEnterprise': {
				'location': 'header',
				'sentAs': 'epid',
				'withPrefix' : true
			},
			'MultiEnterpriseObs': {
				'location': 'header',
				'sentAs': 'x-obs-epid',
			},
			'MultiEnterpriseV2': {
				'location': 'header',
				'sentAs': 'x-amz-epid',
			},
			'ErrorCode': {
				'location': 'header',
				'sentAs': 'x-obs-error-code'
			},
			'ErrorMessage': {
				'location': 'header',
				'sentAs': 'x-obs-error-message'
			}
		}
	},

	'DeleteBucket' : {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'ListObjects' : {
		'httpMethod' : 'GET',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Prefix' : {
				'location' : 'urlPath',
				'sentAs' : 'prefix',
			},
			'Marker' : {
				'location' : 'urlPath',
				'sentAs' : 'marker',
			},
			'MaxKeys' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'max-keys',
			},
			'Delimiter' : {
				'location' : 'urlPath',
				'sentAs' : 'delimiter',
			},
			'AccessKeyId': {
				'location': 'urlPath',
				'sentAs': 'AccessKeyId'
			},
			'Signature': {
				'location': 'urlPath',
				'sentAs': 'Signature'
			},
			'Policy': {
				'location': 'urlPath',
				'sentAs': 'Policy'
			},
			'SecurityToken': {
				'location': 'urlPath',
				'sentAs': 'x-obs-security-token'
			},
			'FsClient': {
				'location': 'header',
				'sentAs': 'x-hws-fs-client'
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},

	'ListObjectsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListBucketResult',
		},
		'parameters' : {
			'Location' : {
				'location' : 'header',
				'sentAs' : 'bucket-location',
				'withPrefix' : true
			},
			'LocationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-bucket-location',
			},
			'LocationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-bucket-region',
			},
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Name',
			},
			'Delimiter' : {
				'location' : 'xml',
				'sentAs' : 'Delimiter',
			},
			'IsTruncated' : {
				'location' : 'xml',
				'sentAs' : 'IsTruncated',
			},
			'Prefix' : {
				'location' : 'xml',
				'sentAs' : 'Prefix',
			},
			'Marker' : {
				'location' : 'xml',
				'sentAs' : 'Marker',
			},
			'NextMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextMarker',
			},
			'MaxKeys' : {
				'location' : 'xml',
				'sentAs' : 'MaxKeys',
			},
			'Contents' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Contents',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'LastModified' : {
							'sentAs' : 'LastModified',
						},
						'ETag' : {
							'sentAs' : 'ETag',
						},
						'Size' : {
							'sentAs' : 'Size',
						},
						'Type' :{
							'sentAs' : 'Type'
						},
						'StorageClass' : {
							'sentAs' : 'StorageClass',
						},
						'Owner' : owner
					},
				},

			},
			'CommonPrefixes' : commonPrefixes
		},
	},

	'ListVersions' : {
		'httpMethod' : 'GET',
		'urlPath' : 'versions',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Prefix' : {
				'location' : 'urlPath',
				'sentAs' : 'prefix',
			},
			'KeyMarker' : {
				'location' : 'urlPath',
				'sentAs' : 'key-marker',
			},
			'MaxKeys' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'max-keys',
			},
			'Delimiter' : {
				'location' : 'urlPath',
				'sentAs' : 'delimiter',
			},
			'VersionIdMarker' : {
				'location' : 'urlPath',
				'sentAs' : 'version-id-marker',
			},
		},
	},
	'ListVersionsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListVersionsResult',
		},
		'parameters' : {
			'Location' : {
				'location' : 'header',
				'sentAs' : 'bucket-location',
				'withPrefix' : true
			},
			'LocationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-bucket-location',
			},
			'LocationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-bucket-region',
			},
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Name',
			},
			'Prefix' : {
				'location' : 'xml',
				'sentAs' : 'Prefix',
			},
			'Delimiter' : {
				'location' : 'xml',
				'sentAs' : 'Delimiter',
			},
			'KeyMarker' : {
				'location' : 'xml',
				'sentAs' : 'KeyMarker',
			},
			'VersionIdMarker' : {
				'location' : 'xml',
				'sentAs' : 'VersionIdMarker',
			},
			'NextKeyMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextKeyMarker',
			},
			'NextVersionIdMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextVersionIdMarker',
			},
			'MaxKeys' : {
				'location' : 'xml',
				'sentAs' : 'MaxKeys',
			},
			'IsTruncated' : {
				'location' : 'xml',
				'sentAs' : 'IsTruncated',
			},
			'Versions' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Version',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'VersionId' : {
							'sentAs' : 'VersionId',
						},
						'IsLatest' : {
							'sentAs' : 'IsLatest',
						},
						'LastModified' : {
							'sentAs' : 'LastModified',
						},
						'ETag' : {
							'sentAs' : 'ETag',
						},
						'Size' : {
							'sentAs' : 'Size',
						},
						'Type' :{
							'sentAs' : 'Type'
						},
						'Owner' : owner,
						'StorageClass' : {
							'sentAs' : 'StorageClass',
						}
					}
				},
			},
			'DeleteMarkers' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'DeleteMarker',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'VersionId' : {
							'sentAs' : 'VersionId',
						},
						'IsLatest' : {
							'sentAs' : 'IsLatest',
						},
						'LastModified' : {
							'sentAs' : 'LastModified',
						},
						'Owner' : owner
					}
				},
			},
			'CommonPrefixes' : commonPrefixes
		},
	},

	'GetBucketLocation' : {
		'httpMethod' : 'GET',
		'urlPath' : 'location',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	
	'GetBucketLocationOutput' : {
		'data' : {
			'type' : 'xml'
		},
		'parameters' : {
			'Location' : {
				'location' : 'xml',
				'sentAs' : 'Location'
			},
		},
	},

	'GetBucketStorageInfo' : {
		'httpMethod' : 'GET',
		'urlPath' : 'storageinfo',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketStorageInfoOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'GetBucketStorageInfoResult',
		},
		'parameters' : {
			'Size' : {
				'location' : 'xml',
				'sentAs' : 'Size',
			},
			'ObjectNumber' : {
				'location' : 'xml',
				'sentAs' : 'ObjectNumber',
			},
		},
	},

	'SetBucketQuota' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'quota',
		'data' : {
			'xmlRoot' : 'Quota',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'StorageQuota' : {
				'required' : true,
				'location' : 'xml',
				'sentAs' : 'StorageQuota',
			},
		},
	},

	'GetBucketQuota' : {
		'httpMethod' : 'GET',
		'urlPath' : 'quota',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},

		},
	},
	'GetBucketQuotaOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'Quota',
		},
		'parameters' : {
			'StorageQuota' : {
				'location' : 'xml',
				'sentAs' : 'StorageQuota',
			},
		},
	},
	
	'SetBucketAcl' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'acl',
		'data' : {
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Owner' : owner,
			'Grants' : grants
		},
	},
	
	'GetBucketAcl' : {
		'httpMethod' : 'GET',
		'urlPath' : 'acl',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketAclOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'Owner' : owner,
			'Grants' : grants,
			'GrantsV2': grantsV2,
		}
	},
	
	'SetBucketLoggingConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'logging',
		'data' : {
			'xmlRoot' : 'BucketLoggingStatus',
			'xmlAllowEmpty' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency',
			},
			'LoggingEnabled' : loggingEnabled,
		},
	},

	'GetBucketLoggingConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'logging',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketLoggingConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'BucketLoggingStatus',
		},
		'parameters' : {
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency'
			},
			'LoggingEnabled' : loggingEnabled,
		},
	},

	'SetBucketPolicy' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'policy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Policy' : {
				'required' : true,
				'location' : 'body',
			},
		},
	},
	
	'GetBucketPolicy' : {
		'httpMethod' : 'GET',
		'urlPath' : 'policy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketPolicyOutput' : {
		'data' : {
			'type' : 'body',
		},
		'parameters' : {
			'Policy' : {
				'location' : 'body',
			},
		},
	},
	'DeleteBucketPolicy' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'policy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketLifecycleConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'lifecycle',
		'data' : {
			'xmlRoot' : 'LifecycleConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Rules' : rules
		},
	},

	'GetBucketLifecycleConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'lifecycle',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketLifecycleConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'LifecycleConfiguration',
		},
		'parameters' : {
			'Rules' : rules
		},
	},
	
	'DeleteBucketLifecycleConfiguration' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'lifecycle',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketWebsiteConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'website',
		'data' : {
			'xmlRoot' : 'WebsiteConfiguration',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'RedirectAllRequestsTo' : redirectAllRequestsTo,
			'IndexDocument' : indexDocument,
			'ErrorDocument' : errorDocument,
			'RoutingRules' : routingRules
		},
	},
	
	'GetBucketWebsiteConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'website',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketWebsiteConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'WebsiteConfiguration',
		},
		'parameters' : {
			'RedirectAllRequestsTo' : redirectAllRequestsTo,
			'IndexDocument' : indexDocument,
			'ErrorDocument' : errorDocument,
			'RoutingRules' : routingRules,
		},
	},
	'DeleteBucketWebsiteConfiguration' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'website',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketVersioningConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'versioning',
		'data' : {
			'xmlRoot' : 'VersioningConfiguration',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionStatus' : {
				'required' : true,
				'location' : 'xml',
				'sentAs' : 'Status',
			},
		},
	},
	
	'GetBucketVersioningConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'versioning',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketVersioningConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'VersioningConfiguration',
		},
		'parameters' : {
			'VersionStatus' : {
				'location' : 'xml',
				'sentAs' : 'Status',
			},
		},
	},

	'SetBucketCors' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'cors',
		'data' : {
			'xmlRoot' : 'CORSConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'CorsRules' : corsRule
		},
	},
	'GetBucketCors' : {
		'httpMethod' : 'GET',
		'urlPath' : 'cors',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketCorsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CORSConfiguration',
		},
		'parameters' : {
			'CorsRules' : corsRule
		},
	},
	'DeleteBucketCors' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'cors',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketNotification' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'notification',
		'data' : {
			'xmlRoot' : 'NotificationConfiguration',
			'xmlAllowEmpty' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'TopicConfigurations' : topicConfiguration,
			'FunctionGraphConfigurations' : functionGraphConfiguration,
		}
	},


	'GetBucketNotification' : {
		'httpMethod' : 'GET',
		'urlPath' : 'notification',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketNotificationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'NotificationConfiguration',
		},
		'parameters' : {
			'TopicConfigurations' : topicConfiguration,
			'FunctionGraphConfigurations' : functionGraphConfiguration,
		},
	},

	'OptionsBucket' : {
		'httpMethod' : 'OPTIONS',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Origin' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'Origin',
			},
			'AccessControlRequestMethods' : {
				'required' : true,
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Method',
				'items' : {
					'type' : 'string',
				},
			},
			'AccessControlRequestHeaders' : {
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers',
				'items' : {
					'type' : 'string',
				},
			},
		},
	},
	'OptionsBucketOutput' : {
		'parameters' : {
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin',
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers',
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods',
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers',
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age',
			},
		},
	},

	'SetBucketTagging' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'tagging',
		'data' : {
			'xmlRoot' : 'Tagging',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Tags' : tagSet
		}
	},

	'GetBucketTagging' : {
		'httpMethod' : 'GET',
		'urlPath' : 'tagging',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketTaggingOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'Tagging',
		},
		'parameters' : {
			'Tags' : tagSet
		}
	},

	'DeleteBucketTagging' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'tagging',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'SetBucketStoragePolicy' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'storageClass',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'StorageClass' :{
				'required' : true,
				'location' : 'xml',
				'type' : 'adapter',
				'sentAs' : 'StorageClass'
			}
		}
	},
	
	'GetBucketStoragePolicy' :{
		'httpMethod' : 'GET',
		'urlPath' : 'storageClass',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},
	
	'GetBucketStoragePolicyOutput' :{
		'data' : {
			'type' : 'xml',
		},
		'parameters' : {
			'StorageClass' : {
				'location' : 'xml',
				'type' : 'string',
				'sentAs' : 'StorageClass'
			}
		}
	},

	'SetBucketReplication' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'replication',
		'data' : {
			'xmlRoot' : 'ReplicationConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency'
			},
			'Rules' : replicationRules
		}
	},

	'GetBucketReplication' : {
		'httpMethod' : 'GET',
		'urlPath' : 'replication',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketReplicationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ReplicationConfiguration',
		},
		'parameters' : {
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency'
			},
			'Rules' : replicationRules
		}
	},

	'DeleteBucketReplication' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'replication',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketRequesterPayment': {
		'httpMethod': 'GET',
		'urlPath': 'requestPayment',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			}
		}
	},
	'GetBucketRequesterPaymentOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'RequestPaymentConfiguration'
		},
		'parameters' : {
			'Payer' : {
				'location': 'xml',
				'sentAs': 'Payer',
			}
		}
	},
	'SetBucketRequesterPayment': {
		'httpMethod' : 'PUT',
		'urlPath': 'requestPayment',
		'data' : {
			'xmlRoot' : 'RequestPaymentConfiguration'
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Payer' : {
				'location': 'xml',
				'sentAs': 'Payer'
			}
		}
	},
	'SetBucketRequesterPaymentOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'RequestPaymentConfiguration'
		},
		'parameters' : {
			'Payer' : {
				'location': 'xml',
				'sentAs': 'Payer',
			}
		}
	},
	
	'PutObject' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'ContentMD5' : {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'Offset' : {
				'type' : 'plain'
			},
			
			'ProgressCallback' :{
				'type' : 'plain'
			},
			
			'ContentLength' :{
				'location' : 'header',
				'sentAs' : 'Content-Length',
				'type' : 'plain'
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true,
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true,
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires',
				'type' : 'number',
				'withPrefix' : true,
			},
			'SuccessActionRedirect':{
				'location' : 'header',
				'sentAs' : 'success-action-redirect'
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true,
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true,
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true,
			},
			'Body' : {
				'location' : 'body',
			},
			'SourceFile' : {
				'type' : 'srcFile',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'PutObjectOutput' : {
		'parameters' : {
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true,
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
			'StorageClass' :{
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
			},
			'StorageClassObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-storage-class',
			},
			'StorageClassV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-storage-class',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption',
			},
			'SseKmsV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption',
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true,
			},
			'SseKmsKeyObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-kms-key-id',
			},
			'SseKmsKeyV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-kms-key-id',
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true,
			},
			'SseCObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-algorithm',
			},
			'SseCV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-algorithm',
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true,
			},
			'SseCKeyMd5Obs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-key-MD5',
			},
			'SseCKeyMd5V2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-key-MD5',
			}
		},
	},

	'RenameObject': {
		'httpMethod': 'POST',
		'urlPath': 'rename',
		'parameters': {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'Name': {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'name',
			}
		}
	},

	'ModifyObject': {
		'httpMethod': 'PUT',
		'urlPath': 'modify',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'Position' : {
				'location' : 'urlPath',
				'sentAs' : 'position',
				'type' : 'number'
			},
			'ContentMD5' : {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'Offset' : {
				'type' : 'plain'
			},

			'ProgressCallback' :{
				'type' : 'plain'
			},

			'ContentLength' :{
				'location' : 'header',
				'sentAs' : 'Content-Length',
				'type' : 'plain'
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true,
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true,
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires',
				'type' : 'number',
				'withPrefix' : true,
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true,
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true,
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true,
			},
			'Body' : {
				'location' : 'body',
			},
			'SourceFile' : {
				'type' : 'srcFile',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},

	'ModifyObjectOutput': {
		'parameters' : {
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true,
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
			'StorageClass' :{
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
			},
			'StorageClassObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-storage-class',
			},
			'StorageClassV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-storage-class',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption',
			},
			'SseKmsV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption',
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true,
			},
			'SseKmsKeyObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-kms-key-id',
			},
			'SseKmsKeyV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-kms-key-id',
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true,
			},
			'SseCObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-algorithm',
			},
			'SseCV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-algorithm',
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true,
			},
			'SseCKeyMd5Obs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-key-MD5',
			},
			'SseCKeyMd5V2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-key-MD5',
			}
		},
	},

	'AppendObject' : {
		'httpMethod' : 'POST',
		'urlPath' : 'append',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'Position' : {
				'location' : 'urlPath',
				'sentAs' : 'position',
				'type' : 'number'
			},
			'ContentMD5' : {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'Offset' : {
				'type' : 'plain'
			},
			
			'ProgressCallback' :{
				'type' : 'plain'
			},
			
			'ContentLength' :{
				'location' : 'header',
				'sentAs' : 'Content-Length',
				'type' : 'plain'
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true,
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true,
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires',
				'type' : 'number',
				'withPrefix' : true,
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true,
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true,
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true,
			},
			'Body' : {
				'location' : 'body',
			},
			'SourceFile' : {
				'type' : 'srcFile',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'AppendObjectOutput' : {
		'parameters' : {
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'NextPosition' : {
				'location' : 'header',
				'sentAs' : 'next-append-position',
				'withPrefix' : true,
			},
			'NextPositionObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-next-append-position',
			},
			'NextPositionV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-next-append-position',
			},
			'StorageClass' :{
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
			},
			'StorageClassObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-storage-class',
				'type' : 'adapter',
			},
			'StorageClassV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-storage-class',
				'type' : 'adapter',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true,
			},
			'SseKmsKeyObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-kms-key-id',
			},
			'SseKmsKeyV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-kms-key-id',
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true,
			},
			'SseCObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-algorithm',
			},
			'SseCV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-algorithm',
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true,
			},
			'SseCKeyMd5Obs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-key-MD5',
			},
			'SseCKeyMd5V2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-key-MD5',
			}
		},
	},
	
	'GetObject' : {
		'httpMethod' : 'GET',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'AccessKeyId': {
				'location': 'urlPath',
			},
			'Signature': {
				'location': 'urlPath'
			},
			'Policy': {
				'location': 'urlPath'
			},
			'SecurityToken': {
				'location': 'urlPath',
				'sentAs': 'x-obs-security-token'
			},
			'ResponseCacheControl' : {
				'location' : 'urlPath',
				'sentAs' : 'response-cache-control',
			},
			'ResponseContentDisposition' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-disposition',
			},
			'ResponseContentEncoding' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-encoding',
			},
			'ResponseContentLanguage' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-language',
			},
			'ResponseContentType' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-type',
			},
			'ResponseExpires' : {
				'location' : 'urlPath',
				'sentAs' : 'response-expires',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'ImageProcess' : {
				'location' : 'urlPath',
				'sentAs' : 'x-image-process',
			},
			'IfMatch' : {
				'location' : 'header',
				'sentAs' : 'If-Match',
			},
			'IfModifiedSince' : {
				'location' : 'header',
				'sentAs' : 'If-Modified-Since',
			},
			'IfNoneMatch' : {
				'location' : 'header',
				'sentAs' : 'If-None-Match',
			},
			'IfUnmodifiedSince' : {
				'location' : 'header',
				'sentAs' : 'If-Unmodified-Since',
			},
			'Range' : {
				'location' : 'header',
				'sentAs' : 'Range',
			},
			'Origin' :{
				'location' : 'header',
				'sentAs' : 'Origin'
			},
			'RequestHeader' : {
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers'
			},
			'SaveAsFile' : {
				'type' : 'dstFile',
			},
			'SaveAsStream' : {
				'type' : 'plain'
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		}
	},
	'GetObjectOutput' : {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'Content' : {
				'location' : 'body',
			},
			'Expiration' : {
				'location' : 'header',
				'sentAs' : 'expiration',
				'withPrefix' : true
			},
			'ExpirationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-expiration',
			},
			'ExpirationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-expiration',
			},
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'CacheControl' : {
				'location' : 'header',
				'sentAs' : 'Cache-Control',
			},
			'ContentDisposition' : {
				'location' : 'header',
				'sentAs' : 'Content-Disposition',
			},
			'ContentEncoding' : {
				'location' : 'header',
				'sentAs' : 'Content-Encoding',
			},
			'ContentLanguage' : {
				'location' : 'header',
				'sentAs' : 'Content-Language',
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type',
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'Expires',
			},
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
			'ContentLength' : {
				'location' : 'header',
				'sentAs' : 'Content-Length',
			},
			'DeleteMarker' : {
				'location' : 'header',
				'sentAs' : 'delete-marker',
				'withPrefix' : true
			},
			'DeleteMarkerObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-delete-marker',
			},
			'DeleteMarkerV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-delete-marker',
			},
			'LastModified' : {
				'location' : 'header',
				'sentAs' : 'Last-Modified',
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true
			},
			'WebsiteRedirectLocationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-website-redirect-location',
			},
			'WebsiteRedirectLocationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-website-redirect-location',
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true	
			},
			'StorageClassObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-storage-class',
			},
			'StorageClassV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-storage-class',
			},
			'Restore' : {
				'location' : 'header',
				'sentAs' : 'restore',
				'withPrefix' : true
			},
			'RestoreObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-restore',
			},
			'RestoreV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-restore',
			},
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin'
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age'
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers'
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods'
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers'
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseKmsKeyObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-kms-key-id',
			},
			'SseKmsKeyV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-kms-key-id',
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-algorithm',
			},
			'SseCV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-algorithm',
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			},
			'SseCKeyMd5Obs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-key-MD5',
			},
			'SseCKeyMd5V2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-key-MD5',
			},
			'Metadata' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'meta-',
				'withPrefix' : true
			},
			'MetadataObs' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'x-obs-meta-',
			},
			'MetadataV2' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'x-amz-meta-',
			}
		},
	},
	'CopyObject' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'CopySource' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'copy-source',
				'withPrefix' : true,
				'skipEncoding' : true
			},
			'CopySourceIfMatch' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-match',
				'withPrefix' : true
			},
			'CopySourceIfModifiedSince' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-modified-since',
				'withPrefix' : true
			},
			'CopySourceIfNoneMatch' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-none-match',
				'withPrefix' : true
			},
			'CopySourceIfUnmodifiedSince' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-unmodified-since',
				'withPrefix' : true
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'ContentEncoding' : {
				'location' : 'header',
				'sentAs' : 'content-encoding'
			},
			'ContentLanguage' : {
				'location' : 'header',
				'sentAs' : 'content-language'
			},
			'ContentDisposition' : {
				'location' : 'header',
				'sentAs' : 'content-disposition'
			},
			'CacheControl' : {
				'location' : 'header',
				'sentAs' : 'cache-control'
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires'
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true
			},
			'MetadataDirective' : {
				'location' : 'header',
				'sentAs' : 'metadata-directive',
				'withPrefix' : true
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true
			},
			'SuccessActionRedirect':{
				'location' : 'header',
				'sentAs' : 'success-action-redirect'
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'CopySourceSseC' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'CopySourceSseCKey' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'CopyObjectOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CopyObjectResult',
		},
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
			'CopySourceVersionId' : {
				'location' : 'header',
				'sentAs' : 'copy-source-version-id',
				'withPrefix' : true
			},
			'CopySourceVersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-copy-source-version-id',
			},
			'CopySourceVersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-copy-source-version-id',
			},
			'ETag' : {
				'location' : 'xml',
				'sentAs' : 'ETag',
			},
			'LastModified' : {
				'location' : 'xml',
				'sentAs' : 'LastModified',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseKmsKeyObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-kms-key-id',
			},
			'SseKmsKeyV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-kms-key-id',
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-algorithm',
			},
			'SseCV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-algorithm',
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			},
			'SseCKeyMd5Obs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-key-MD5',
			},
			'SseCKeyMd5V2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-key-MD5',
			}
		},
	},

	'RestoreObject' : {
		'httpMethod' : 'POST',
		'urlPath' : 'restore',
		'data' : {
			'xmlRoot' : 'RestoreRequest',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'Days' : {
				'location' : 'xml',
				'sentAs' : 'Days'
			},
			'Tier' : {
				'wrapper' : 'RestoreJob',
				'location' : 'xml',
				'sentAs' : 'Tier',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		}
	},

	'GetObjectMetadata' : {
		'httpMethod' : 'HEAD',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'Origin' : {
				'location' : 'header',
				'sentAs' : 'Origin'
			},
			'RequestHeader' : {
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers'
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	
	'GetObjectMetadataOutput' : {
		'parameters' : {
			'Expiration' : {
				'location' : 'header',
				'sentAs' : 'expiration',
				'withPrefix' : true
			},
			'ExpirationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-expiration',
			},
			'ExpirationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-expiration',
			},
			'LastModified' : {
				'location' : 'header',
				'sentAs' : 'Last-Modified',
			},
			'ContentLength' : {
				'location' : 'header',
				'sentAs' : 'Content-Length',
			},
			'ContentType' :{
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'CacheControl': {
				'location': 'header',
				'sentAs': 'Cache-Control'
			},
			'ContentDisposition': {
				'location': 'header',
				'sentAs': 'Content-Disposition'
			},
			'ContentLanguage': {
				'location': 'header',
				'sentAs': 'Content-Language'
			},
			'ContentEncoding': {
				'location': 'header',
				'sentAs': 'Content-Encoding'
			},
			'Expires': {
				'location': 'header',
				'sentAs': 'Expires'
			},
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true
			},
			'WebsiteRedirectLocationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-website-redirect-location',
			},
			'WebsiteRedirectLocationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-website-redirect-location',
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true
			},
			'StorageClassObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-storage-class',
			},
			'StorageClassV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-storage-class',
			},
			'Restore' : {
				'location' : 'header',
				'sentAs' : 'restore',
				'withPrefix' : true
			},
			'RestoreObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-restore',
			},
			'RestoreV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-restore',
			},
			'ObjectType' :{
				'location' : 'header',
				'sentAs' : 'object-type',
				'withPrefix' : true
			},
			'ObjectTypeObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-object-type',
			},
			'ObjectTypeV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-object-type',
			},
			'NextPosition' :{
				'location' : 'header',
				'sentAs' : 'next-append-position',
				'withPrefix' : true
			},
			'NextPositionObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-next-append-position',
			},
			'NextPositionV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-next-append-position',
			},
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin'
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age'
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers'
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods'
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers'
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption',
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCObs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-algorithm',
			},
			'SseCV2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-algorithm',
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			},
			'SseCKeyMd5Obs' :{
				'location' : 'header',
				'sentAs' : 'x-obs-server-side-encryption-customer-key-MD5',
			},
			'SseCKeyMd5V2' :{
				'location' : 'header',
				'sentAs' : 'x-amz-server-side-encryption-customer-key-MD5',
			},
			'Metadata' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'meta-',
				'withPrefix' : true
			},
			'MetadataObs' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'x-obs-meta-',
			},
			'MetadataV2' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'x-amz-meta-',
			}
		},
	},
	
    'SetObjectMetadata': {
        'httpMethod': 'PUT',
        'urlPath': 'metadata',
        'parameters': {
            'Bucket': {
                'required': true,
                'location': 'uri'
            },
            'Key': {
                'required': true,
                'location': 'uri'
            },
            'VersionId': {
                'location': 'urlPath',
                'sentAs': 'versionId'
            },
            'Origin': {
                'location': 'header',
                'sentAs': 'Origin'
            },
            'RequestHeader': {
                'location': 'header',
                'sentAs': 'Access-Control-Request-Headers'
            },
            'CacheControl': {
                'location': 'header',
                'sentAs': 'Cache-Control'
            },
            'ContentDisposition': {
                'location': 'header',
                'sentAs': 'Content-Disposition'
            },
            'ContentLanguage': {
                'location': 'header',
                'sentAs': 'Content-Language'
            },
            'ContentEncoding': {
            	'location': 'header', 
            	'sentAs': 'Content-Encoding'
            },
            'ContentType': {
                'location': 'header',
                'sentAs': 'Content-Type'
            },
            'Expires': {
                'location': 'header',
                'sentAs': 'Expires'
            },
            'Metadata': {
            	'type' : 'object',
            	'location': 'header', 
            	'sentAs': 'meta-',
                'withPrefix': true
            },
            'MetadataDirective' : {
				'location' : 'header',
				'sentAs' : 'metadata-directive',
				'withPrefix' : true
			},
            'StorageClass': {
                'location': 'header',
                'sentAs': 'storage-class',
                'withPrefix': true,
                'type' : 'adapter',
            },
            'WebsiteRedirectLocation': {
                'location': 'header',
                'sentAs': 'website-redirect-location',
                'withPrefix': true
            },
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
        }
    },
    'SetObjectMetadataOutput': {
        'parameters': {
            'Expires': {
                'location': 'header',
                'sentAs': 'Expires'
            },
			'ContentEncoding': {
				'location': 'header',
				'sentAs': 'Content-Encoding'
			},
            'ContentType': {
                'location': 'header',
                'sentAs': 'Content-Type'
            },
            'ContentLanguage': {
                'location': 'header',
                'sentAs': 'Content-Language'
            },
            'CacheControl': {
                'location': 'header',
                'sentAs': 'Cache-Control'
            },
            'ContentDisposition': {
                'location': 'header',
                'sentAs': 'Content-Disposition'
            },
            'WebsiteRedirectLocation': {
                'location': 'header',
                'sentAs': 'website-redirect-location',
                'withPrefix': true
            },
			'WebsiteRedirectLocationObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-website-redirect-location',
			},
			'WebsiteRedirectLocationV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-website-redirect-location',
			},
            'StorageClass': {
                'location': 'header',
                'sentAs': 'storage-class',
                'withPrefix': true
            },
			'StorageClassObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-storage-class',
			},
			'StorageClassV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-storage-class',
			},
            'Metadata': {
                'location': 'header',
                'type': 'object',
                'sentAs': 'meta-',
                'withPrefix': true
            },
			'MetadataObs' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'x-obs-meta-',
			},
			'MetadataV2' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'x-amz-meta-',
			},
			'MetadataDirective': {
				'location' : 'header',
				'sentAs' : 'metadata-directive',
				'withPrefix' : true
			}
        }
    },

	'SetObjectAcl' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'acl',
		'data' : {
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Delivered' :{
				'location' : 'xml',
				'sentAs' : 'Delivered'
			},
			'Owner' : owner,
			'Grants' : grants,
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'SetObjectAclOutput' : {
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
		},
	},
	'GetObjectAcl' : {
		'httpMethod' : 'GET',
		'urlPath' : 'acl',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'GetObjectAclOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
			'Delivered' :{
				'location' : 'xml',
				'sentAs' : 'Delivered'
			},
			'Owner' : owner,
			'Grants' : grants
		},
	},
	'DeleteObject' : {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'DeleteObjectOutput' : {
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'VersionIdObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-version-id',
			},
			'VersionIdV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-version-id',
			},
			'DeleteMarker' : {
				'location' : 'header',
				'sentAs' : 'delete-marker',
				'withPrefix' : true
			},
			'DeleteMarkerObs' : {
				'location' : 'header',
				'sentAs' : 'x-obs-delete-marker',
			},
			'DeleteMarkerV2' : {
				'location' : 'header',
				'sentAs' : 'x-amz-delete-marker',
			},
		},
	},
	'DeleteObjects' : {
		'httpMethod' : 'POST',
		'urlPath' : 'delete',
		'data' : {
			'xmlRoot' : 'Delete',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Quiet' : {
				'location' : 'xml',
				'sentAs' : 'Quiet',
			},
			'Objects' : {
				'required' : true,
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Object',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'VersionId' : {
							'sentAs' : 'VersionId',
						},
					},
				},
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'DeleteObjectsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'DeleteResult',
		},
		'parameters' : {
			'Deleteds' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Deleted',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'VersionId' : {
							'sentAs' : 'VersionId',
						},
						'DeleteMarker' : {
							'sentAs' : 'DeleteMarker',
						},
						'DeleteMarkerVersionId' : {
							'sentAs' : 'DeleteMarkerVersionId',
						},
					}
				},
			},
			'Errors' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Error',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'VersionId' : {
							'sentAs' : 'VersionId',
						},
						'Code' : {
							'sentAs' : 'Code',
						},
						'Message' : {
							'sentAs' : 'Message',
						},
					}
				},
			},
		},
	},
	
	'InitiateMultipartUpload' : {
		'httpMethod' : 'POST',
		'urlPath' : 'uploads',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter',
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires',
				'type' : 'number',
				'withPrefix' : true
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'InitiateMultipartUploadOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'InitiateMultipartUploadResult',
		},
		'parameters' : {
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'Key' : {
				'location' : 'xml',
				'sentAs' : 'Key',
			},
			'UploadId' : {
				'location' : 'xml',
				'sentAs' : 'UploadId',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			}
		},
	},
	'ListMultipartUploads' : {
		'httpMethod' : 'GET',
		'urlPath' : 'uploads',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Delimiter' : {
				'location' : 'urlPath',
				'sentAs' : 'delimiter',
			},
			'KeyMarker' : {
				'location' : 'urlPath',
				'sentAs' : 'key-marker',
			},
			'MaxUploads' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'max-uploads',
			},
			'Prefix' : {
				'location' : 'urlPath',
				'sentAs' : 'prefix',
			},
			'UploadIdMarker' : {
				'location' : 'urlPath',
				'sentAs' : 'upload-id-marker',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'ListMultipartUploadsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListMultipartUploadsResult',
		},
		'parameters' : {
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'KeyMarker' : {
				'location' : 'xml',
				'sentAs' : 'KeyMarker',
			},
			'UploadIdMarker' : {
				'location' : 'xml',
				'sentAs' : 'UploadIdMarker',
			},
			'NextKeyMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextKeyMarker',
			},
			'Prefix' : {
				'location' : 'xml',
				'sentAs' : 'Prefix',
			},
			'Delimiter' : {
				'location' : 'xml',
				'sentAs' : 'Delimiter',
			},
			'NextUploadIdMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextUploadIdMarker',
			},
			'MaxUploads' : {
				'location' : 'xml',
				'sentAs' : 'MaxUploads',
			},
			'IsTruncated' : {
				'location' : 'xml',
				'sentAs' : 'IsTruncated',
			},
			'Uploads' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Upload',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'UploadId' : {
							'sentAs' : 'UploadId',
						},
						'Key' : {
							'sentAs' : 'Key',
						},
						'Initiated' : {
							'sentAs' : 'Initiated',
						},
						'StorageClass' : {
							'sentAs' : 'StorageClass',
						},
						'Owner' : owner,
						'Initiator' : initiator
					},
				},
			},
			'CommonPrefixes' : commonPrefixes
		},
	},
	'UploadPart' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'PartNumber' : {
				'required' : true,
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'partNumber',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'ContentMD5' : {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			},
			'Body' : {
				'location' : 'body',
			},
			'SourceFile' : {
				'type' : 'srcFile',
			},
			'Offset' : {
				'type' : 'plain'
			},
			'PartSize' : {
				'type' : 'plain'
			},
			'ProgressCallback' :{
				'type' : 'plain'
			},
			
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'UploadPartOutput' : {
		'parameters' : {
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			}
		},
	},
	'ListParts' : {
		'httpMethod' : 'GET',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'MaxParts' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'max-parts',
			},
			'PartNumberMarker' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'part-number-marker',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'ListPartsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListPartsResult',
		},
		'parameters' : {
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'Key' : {
				'location' : 'xml',
				'sentAs' : 'Key',
			},
			'UploadId' : {
				'location' : 'xml',
				'sentAs' : 'UploadId',
			},
			'PartNumberMarker' : {
				'location' : 'xml',
				'sentAs' : 'PartNumberMarker',
			},
			'NextPartNumberMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextPartNumberMarker',
			},
			'MaxParts' : {
				'location' : 'xml',
				'sentAs' : 'MaxParts',
			},
			'IsTruncated' : {
				'location' : 'xml',
				'sentAs' : 'IsTruncated',
			},
			'StorageClass' : {
				'location' : 'xml',
				'sentAs' : 'StorageClass',
			},
			'Initiator':initiator,
			'Owner' : owner,
			'Parts' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Part',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'PartNumber' : {
							'sentAs' : 'PartNumber',
						},
						'LastModified' : {
							'sentAs' : 'LastModified',
						},
						'ETag' : {
							'sentAs' : 'ETag',
						},
						'Size' : {
							'sentAs' : 'Size',
						},
					},
				},
			}
		},
	},
	'CopyPart' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'PartNumber' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'partNumber',
				'type' : 'number',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'CopySource' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'copy-source',
				'skipEncoding' : true,
				'withPrefix' : true
			},
			'CopySourceRange' : {
				'location' : 'header',
				'sentAs' : 'copy-source-range',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'CopySourceSseC' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'CopySourceSseCKey' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'CopyPartOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CopyPartResult',
		},
		'parameters' : {
			'LastModified' : {
				'location' : 'xml',
				'sentAs' : 'LastModified',
			},
			'ETag' : {
				'location' : 'xml',
				'sentAs' : 'ETag',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			}
		},
	},
	'AbortMultipartUpload' : {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	
	'CompleteMultipartUpload' : {
		'httpMethod' : 'POST',
		'data' : {
			'xmlRoot' : 'CompleteMultipartUpload',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'Parts' : {
				'required' : true,
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Part',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'PartNumber' : {
							'sentAs' : 'PartNumber',
						},
						'ETag' : {
							'sentAs' : 'ETag',
						},
					},
				},
			},
			'RequestPayer': {
				'location': 'header',
				'sentAs': 'request-payer',
				'withPrefix': true
			}
		},
	},
	'CompleteMultipartUploadOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CompleteMultipartUploadResult',
		},
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'Location' : {
				'location' : 'xml',
				'sentAs' : 'Location',
			},
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'Key' : {
				'location' : 'xml',
				'sentAs' : 'Key',
			},
			'ETag' : {
				'location' : 'xml',
				'sentAs' : 'ETag',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			}
		},
	},

	'OptionsObject' : {
		'httpMethod' : 'OPTIONS',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'Origin' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'Origin',
			},
			'AccessControlRequestMethods' : {
				'required' : true,
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Method',
				'items' : {
					'type' : 'string',
				},
			},
			'AccessControlRequestHeaders' : {
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers',
				'items' : {
					'type' : 'string',
				},
			},
		},
	},
	'OptionsObjectOutput' : {
		'parameters' : {
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin',
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers',
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods',
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers',
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age',
			},
		},
	},

	'GetBucketDirectColdAccess': {
		'httpMethod': 'GET',
		'urlPath': 'directcoldaccess',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			}
		}
	},

	'GetBucketDirectColdAccessOutput': {
		'data': {
			'type': 'xml',
			'xmlRoot': 'DirectColdAccessConfiguration'
		},
		'parameters': {
			'Status': {
				'location': 'xml',
				'sentAs': 'Status'
			}
		}
	},

	'SetBucketDirectColdAccess': {
		'httpMethod': 'PUT',
		'urlPath': 'directcoldaccess',
		'data': {
			'xmlRoot': 'DirectColdAccessConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Status': {
				'required': true,
				'location': 'xml',
				'sentAs': 'Status'
			}
		}
	},

	'SetBucketDirectColdAccessOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'DirectColdAccessConfiguration'
		},
		'parameters' : {
			'Status': {
				'location': 'xml',
				'sentAs': 'Status'
			}
		}
	},

	'DeleteBucketDirectColdAccess': {
		'httpMethod': 'DELETE',
		'urlPath': 'directcoldaccess',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			}
		}
	},

	'DeleteBucketDirectColdAccessOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'DirectColdAccessConfiguration'
		},
		'parameters' : {
			'Status': {
				'location': 'xml',
				'sentAs': 'Status'
			}
		}
	},

	'GetBucketEncryption' : {
		'httpMethod' : 'GET',
		'urlPath' : 'encryption',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},
	'GetBucketEncryptionOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Rule' : {
				'type': 'object',
				'location': 'xml',
				'sentAs': 'Rule',

				'parameters': {
					'ApplyServerSideEncryptionByDefault': {
						'type': 'object',
						'sentAs': 'ApplyServerSideEncryptionByDefault',
						'parameters': {
							'SSEAlgorithm': {
								'sentAs': 'SSEAlgorithm'
							},
							'KMSMasterKeyID': {
								'sentAs': 'KMSMasterKeyID'
							}
						}
					}
				}
			}
		}
	},
	'SetBucketEncryption': {
		'httpMethod' : 'PUT',
		'urlPath' : 'encryption',
		'data' : {
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Rule' : bucketEncryptionRule
		}
	},
	'SetBucketEncryptionOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Rule' : bucketEncryptionRule
		}
	},
	'DeleteBucketEncryption': {
		'httpMethod': 'DELETE',
		'urlPath': 'encryption',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			}
		}
	},
	'DeleteBucketEncryptionOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Rule' : bucketEncryptionRule
		}
	}
};


module.exports = operations;