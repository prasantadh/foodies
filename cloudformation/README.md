# cloudformation files

## Requirements
1. There are a few sections that you will need to fill up yourselves in the template file.
2. Browse over to `~/.aws` which has the configuration files for your account. You might have to
adjust the setting as per your preferences. This template has been tested on us-east-1 with
root privileges on the account. Please be sure to be on the us-east-1. A different region
might not support cloudformation or other sub-services that cloudformation tries to bring up.
The error will usually show up as `Internal Error`.
3. For the codepipeline to successfully work, you will also need an aws secret with name
`GITHUB_ACCESS`, key `GITHUB_ACCESS_TOKEN` and the value you get from github. This requirement
can be removed once the repository is public.


## Usage

```bash
# deploy the stack
aws cloudformation deploy --template-file template.yaml --stack-name foodies --capabilities CAPABILITY_NAMED_IAM

# delete the stack
aws delete-stack --stack-name foodies
```

Notes: 

1. In case of some failures, you might have to delete the stack before you can fix 

## Manual Steps
As of now, the public read for buckets have not been figured out.
You can use the bucket policy attached here 
https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html
to get access to the website which is a one time process.

We will eventually use cloudfront for this step, which should remove
the need for using this policy on the bucket.
