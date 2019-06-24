Launch Server
~~~~~~~~~~~~~~

You can either set up the tool with the provided docker image or build the tool by yourself.

Once you have the tool set up, you can open ``http://localhost:8686`` to
create your annotation project.

1. Check out the code

  ::

    git clone git@github.com:ucbdrive/scalabel.git
    cd scalabel


2. Compile the code

    There are two alternatives to get the compiled code
    
    i). Use docker 
    
      Download from dockerhub

      ::

        docker pull scalabel/www
        
        
      or build the docker image yourself
        
      ::

        docker build . -t scalabel/www

    
    ii). Compile the code yourself
        
      Install `golang <https://golang.org/doc/install>`__, `nodejs and npm <https://nodejs.org/en/download/>`__.
        
      Compile Go server code

      ::

        bash scripts/install_go_packages.sh
        go build -i -o ./bin/scalabel ./server/http
        
      (For Windows users, build with:

      ::

        go build -i -o .\bin\scalabel.exe .\server\http

      )

      Transpile Javascript code

      ::

        npm install
        node_modules/.bin/npx webpack --config webpack.config.js --mode=production
        

3. Prepare data directory

  ::

    mkdir data
    cp app/config/default_config.yml data/config.yml
    
    
4. Launch the server

  If using docker,

  ::

    docker run -it -v `pwd`/data:/opt/scalabel/data -p 8686:8686 scalabel/www \
        /opt/scalabel/bin/scalabel --config /opt/scalabel/data/config.yml
    
    
  Otherwise

  ::

    ./bin/scalabel --config ./data/config.yml

  (For Windows users, run with:

  ::
  
    .\bin\scalabel.exe --config .\data\config.yml

  )
    
    
  Then, the server can be accessed at ``http://localhost:8686``.
    
5. Get labels
    
  Collected labels can be directly downloaded from the project dashboard. The data follows `bdd data format <https://github.com/ucbdrive/bdd-data/blob/master/doc/format.md>`__. After installing the requirements and setting up the paths of the `bdd data toolkit <https://github.com/ucbdrive/bdd-data>`__, you can visualize the labels by

  ::

    python3 -m bdd_data.show_labels.py -l <your_downloaded_label_path.json>
