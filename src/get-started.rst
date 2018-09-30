Launch Server
~~~~~~~~~~~~~~

You can either set up the tool with the provided docker image or build the tool by yourself.

Once you have the tool set up, you can open ``http://localhost:8686`` to
create your annotation project.


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

   (i). Build and run a Docker image from the Dockerfile.

      Build by yourself

      ::

          docker build . -t 'scalabel/server'

      After getting the docker image, you can run the server

      ::

          docker run -it -v `pwd`/../data:/data -p 8686:8686 scalabel/server

   (ii). Build the server by yourself.

      a. Install GoLang. Refer to the `instruction
         page <https://golang.org/doc/install>`__ for details.
      b. Install GoLang dependency

         ::

             go get github.com/aws/aws-sdk-go github.com/mitchellh/mapstructure gopkg.in/yaml.v2 github.com/satori/go.uuid

      c. Compile the server

         ::

             go build -i -o $GOPATH/bin/scalabel ./server/go

         For Windows users, use

         ::

             go build -i -o %GOPATH%\bin\scalabel.exe .\server\go

      Note that you may choose your own path for the server executable.
      We use $GOPATH/bin/scalabel as it conforms to golang best
      practice, but if your GOPATH is not configured, this will not
      work.

      d. Specify basic configurations (e.g. the port to start the
         server, the data directory to store the image annotations, etc)
         in your own ``config.yml``. Refer to
         ``app/config/default_config.yml`` for the default
         configurations.
      e. Launch the server by running

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
