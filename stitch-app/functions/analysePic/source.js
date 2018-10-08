exports = function(changeEvent) {
  const aws = context.services.get('AWS');
  const mongodb = context.services.get("mongodb-atlas");
  const insertedPic = changeEvent.fullDocument;
  
  const args = {
    Image: {
      S3Object: {
        Bucket: insertedPic.s3.bucket,
        Name: insertedPic.s3.key
      }
    },
    MaxLabels: 10,
    MinConfidence: 75.0
  };
  
  return aws.rekognition()
    .DetectLabels(args)
    .then(result => {
      return mongodb
        .db('data')
        .collection('picstream')
        .updateOne({_id: insertedPic._id}, {$set: {tags: result.Labels}});
    });
  
};
