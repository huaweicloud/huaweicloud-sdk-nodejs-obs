/**
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

const operations = {

    'ListBuckets' : {
		'httpMethod' : 'GET',
		'parameters' : {
			'BucketType': {
				'location': 'header',
				'sentAs': 'bucket-type',
				'withPrefix': true
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
			'Marker' : {
				'location' : 'xml',
				'sentAs' : 'Marker',
			},
			'IsTruncated' : {
				'location' : 'xml',
				'sentAs' : 'IsTruncated',
			},
			'NextMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextMarker',
			},
			'MaxKeys' : {
				'location' : 'xml',
				'sentAs' : 'MaxKeys',
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
						},
						'BucketType' : {
							'sentAs' : 'BucketType'
						}
					},
				},
			},
		},
	},
}

module.exports = operations;
