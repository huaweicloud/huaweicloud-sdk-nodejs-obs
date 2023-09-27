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
