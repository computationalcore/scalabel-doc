Data Preparation
----------------

Our tool supports both video and image annotations. We provide a script
at ``scripts/prepare_data.py`` to help you prepare data.

-  For the video data, we first split the video into frames at the
   specified frame rate (the default is 5fps) and then generate a yaml
   file containing the paths to the frames.

::

    python3 scripts/prepare_data.py -i <path_to_video> -t <output_directory> -f <fps>
    --s3 <s3_bucket_name/folder>

The flag ``--s3`` is optional. If you want to upload the output frames
and the frame list to your Amazon S3 bucket, you can specify the key to
the bucket.

We assume that the bucket is "public readable" so that the generated
links can be directly accessed by the tool.

Please refer to the
`doc <http://boto3.readthedocs.io/en/latest/guide/s3-example-creating-buckets.html>`__
to configure your S3 bucket.

-  For the image data, you need to specify the path to the folder that
   contains the images. If ``--s3`` is specified, the images will be
   uploaded to the S3 bucket as well as the yaml file that contains the
   urls to the images.

::

    python3 scripts/prepare_data.py -i <path_to_image_folder>  --s3 <s3_bucket_name/folder>

Once obtaining the ``image_list.yml``, we can proceed to create a new
annotation project.

Serving Data
~~~~~~~~~~~~

If you wish to serve your own data on the same domain as this server,
you may do so. This means the item\_list.yml you provide at project
creation may contain URLs to this server. Any files or directories you
place in "app/dist/" will be uploaded to the server with the prefix path
removed. For example, say that you place a directory "images" in
"app/dist/". If you are testing the server locally, you can specify in
your item list URLs such as "localhost:8686/images/image\_1.jpg".
