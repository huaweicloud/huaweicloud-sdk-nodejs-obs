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



exports.AclPrivate = 'private';
exports.AclPublicRead = 'public-read';
exports.AclPublicReadWrite = 'public-read-write';
exports.AclPublicReadDelivered = 'public-read-delivered';
exports.AclPublicReadWriteDelivered = 'public-read-write-delivered';
exports.AclAuthenticatedRead = 'authenticated-read';
exports.AclBucketOwnerRead = 'bucket-owner-read';
exports.AclBucketOwnerFullControl = 'bucket-owner-full-control';
exports.AclLogDeliveryWrite = 'log-delivery-write';

exports.StorageClassStandard = 'STANDARD';
exports.StorageClassWarm = 'WARM';
exports.StorageClassCold = 'COLD';

exports.PermissionRead = 'READ';
exports.PermissionWrite = 'WRITE';
exports.PermissionReadAcp = 'READ_ACP';
exports.PermissionWriteAcp = 'WRITE_ACP';
exports.PermissionFullControl = 'FULL_CONTROL';

exports.GroupAllUsers = 'AllUsers';
exports.GroupAuthenticatedUsers = 'AuthenticatedUsers';
exports.GroupLogDelivery = 'LogDelivery';

exports.RestoreTierExpedited = 'Expedited';
exports.RestoreTierStandard = 'Standard';
exports.RestoreTierBulk = 'Bulk';

exports.GranteeGroup = 'Group';
exports.GranteeUser = 'CanonicalUser';

exports.CopyMetadata = 'COPY';
exports.ReplaceMetadata = 'REPLACE';

exports.EventObjectCreatedAll = 'ObjectCreated:*';
exports.EventObjectCreatedPut = 'ObjectCreated:Put';
exports.EventObjectCreatedPost = 'ObjectCreated:Post';
exports.EventObjectCreatedCopy = 'ObjectCreated:Copy';
exports.EventObjectCreatedCompleteMultipartUpload = 'ObjectCreated:CompleteMultipartUpload';
exports.EventObjectRemovedAll = 'ObjectRemoved:*';
exports.EventObjectRemovedDelete = 'ObjectRemoved:Delete';
exports.EventObjectRemovedDeleteMarkerCreated = 'ObjectRemoved:DeleteMarkerCreated';

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

exports.KB = KB;
exports.MB = MB;
exports.GB = GB;

exports.MAX_UPLOAD_PART_COUNT = 10000;
exports.MAX_UPLOAD_PART_SIZE = 5 * GB;
exports.DEFAULT_UPLOAD_PART_SIZE = 5 * MB;
exports.MIN_UPLOAD_PART_SIZE = 100 * KB;

exports.MAX_DOWNLOAD_PART_SIZE = 5 * GB;
exports.DEFAULT_DOWNLOAD_PART_SIZE = 5 * MB;
exports.MIN_DOWNLOAD_PART_SIZE = 100 * KB;