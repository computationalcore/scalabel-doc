Project Creation
------------------------------------------

The interface of creating a new project is shown as following. We use bounding box annotation as an example.

.. figure:: ../media/docs/images/create_project_0.2.png
   :alt: video bounding box annotation screenshot

   Creating a bounding box annotation project

To start with, you need to upload the ``Item List`` which contains the information of items to be labeled.
You can upload image lists like ``image_list.yml`` provided in the ``examples/`` folder, with either paths to the images or publicly readable urls.
To import existing projects, upload the Json file exported by Scalabel. The items and corresponding labels in the exported project will be loaded into the current project.
You can also upload the prediction Json file of detection and segmentation models
in the `BDD data format <https://github.com/ucbdrive/bdd-data/blob/master/doc/format.md/>`_ to achieve semi-automatic annotation.

For ``Categories`` and ``Attributes``, you can upload the yaml files that contain
the labels and attribute descriptions respectively.
Please refer to ``examples/`` folder for more details.

After a project is created, you can click ``Go to Vendor Dashboard`` to access all the tasks created
in the Vendor Dashboard.

.. figure:: ../media/docs/images/box2d_vendor_0.2.png
   :alt: the screenshot of the vendor dashboard

   The vendor dashboard

Go to the project dashboard by clicking the ``Go to Dashboard`` button. In addition to the features
of the vendor dashboard, you can also export the labeled results and task URLs in the project dashboard.
Scalabel exports projects in the `BDD data format <https://github.com/ucbdrive/bdd-data/blob/master/doc/format.md/>`_;
you can load the exported Json file back in ``Item List`` as described above.

.. figure:: ../media/docs/images/box2d_dashboard_0.2.png
   :alt: the screenshot of the project dashboard

   The project dashboard

Go to the annotation interface and start the work by clicking a task link.
