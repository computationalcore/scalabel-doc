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

Launch Server
~~~~~~~~~~~~~~

You can either set up the tool with the provided docker image or build the tool by yourself.

Once you have the tool set up, you can open ``http://localhost:8686`` to
create your annotation project.

Setup
~~~~~

1. Checkout the code

   ::

       git clone git@github.com:ucbdrive/scalabel.git
       cd scalabel

2. Create a directory to store the server data:

   ::

       mkdir ../data

   Or, for Windows users:

   ::

       mkdir ..\data

3. Compile the Javascript code

  First install the dependencies

  ::
  
     npm install

  Build the production code

  ::

     npx webpack --config webpack.config.js --mode=production

4. Launch server. There are two options, either (i) to build with Docker
   or (ii) to build by yourself.

   1. Build and run a Docker image from the Dockerfile.

      Build by yourself

      ::

          docker build . -t 'scalabel/server'

      After getting the docker image, you can run the server

      ::

          docker run -it -v `pwd`/../data:/data -p 8686:8686 scalabel/server

   2. Build the server by yourself.

      1. Install GoLang. Refer to the `instruction
         page <https://golang.org/doc/install>`__ for details.
      2. Install GoLang dependency

         ::

             go get github.com/aws/aws-sdk-go github.com/mitchellh/mapstructure gopkg.in/yaml.v2 github.com/satori/go.uuid

      3. Compile the server

         ::

             go build -i -o $GOPATH/bin/scalabel ./server/go

         For Windows users, use

         ::

             go build -i -o %GOPATH%\bin\scalabel.exe .\server\go

      Note that you may choose your own path for the server executable.
      We use $GOPATH/bin/scalabel as it conforms to golang best
      practice, but if your GOPATH is not configured, this will not
      work.

      4. Specify basic configurations (e.g. the port to start the
         server, the data directory to store the image annotations, etc)
         in your own ``config.yml``. Refer to
         ``app/config/default_config.yml`` for the default
         configurations.
      5. Launch the server by running

         ::

             $GOPATH/bin/scalabel --config app/config/default_config.yml

         For Windows users, run:

         ::

             %GOPATH%\bin\scalabel.exe --config app\config\default_config.yml

      If you used a different server path when compiling, make sure to
      use the correct path here.

5. Access the server through the specifed port (we use ``8686`` as the
   default port specified in the ``config.yml``)

   ::

       http://localhost:8686
