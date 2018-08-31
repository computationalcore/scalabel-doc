
Install dependency

```
pip install sphinx
```

Build the documentation

```
make html
```

Sync to S3 (The scalabel team will do this periodically)
```
aws s3 sync _build/html s3://www.scalabel.ai/doc --acl public-read
```
