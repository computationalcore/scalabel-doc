Project Creation
------------------------------------------

The interface of creating a new project is shown as following. We use bounding box annotation as an example.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/screenshots/create_project_0.2.png
   :alt: video bounding box annotation screenshot

   Creating a bounding box annotation project

In this case, you need to upload ``image_list.yml`` which contains
either paths to the images or public readable urls in the ``Item List``.
You can also upload Json files in the BDD format to import existing labels.
For ``Categories`` and ``Attributes``, you can upload the yaml files that contain
the labels and attribute descriptions respectively.
Please refer to ``examples/`` folder for more details.

After a project is created, you can click ``Go to Vendor Dashboard`` to access all the tasks created
in the Vendor Dashboard.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/screenshots/box2d_vendor_0.2.png
   :alt: the screenshot of the vendor dashboard

   The vendor dashboard

Go to the project dashboard by clicking the ``Go to Dashboard`` button. In addition to the features
of the vendor dashboard, you can also export the labeled results and task URLs in the project dashboard.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/screenshots/box2d_dashboard_0.2.png
   :alt: the screenshot of the project dashboard

   The project dashboard

Go to the annotation interface and start the work by clicking a task link.
