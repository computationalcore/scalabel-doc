
Install dependency

```
pip install sphinx
```

Build the documentation

```
make html
```

Sync to S3
```
aws s3 sync _build/html s3://www.scalabel.ai/doc
```
