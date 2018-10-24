2D Bounding Box
---------------

For tasks like object detection, we need to draw bounding boxes for the
objects of interest in the image. The interface of drawing 2D bounding
boxes is shown as follows.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/screenshots/image_bbox_0.2.png
   :alt: 2D Bounding Boxes

   2D Bounding Boxes

On the left side, we show all the label categories specified in
``categories.yml`` (which you can modify to meet your demand) and also
provide options like ``Occluded`` and ``Truncated``. For traffic lights,
you can also annotate their colors on the left side.

Is the object too small to annotate? Try the ``+`` button on the top
right. The zoom-in image is shown as follows. When zoomed in, you can
use your mouse to move the canvas and continue to annotate another
object.

Want to delete a bounding box? Click on the bounding box to highlight it
and then click on the ``Remove`` button on the bottom left.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/screenshots/image_bbox_zoomin_0.2.png
   :alt: Bounding Boxes

   Bounding Boxes

Once finishing drawing all the bounding boxes, you can save the results
by clicking on the ``Save`` button on the top right. Then the bounding
boxes results will be saved to your data folder specified in the
``configure.yml``.

A short demo of drawing 2D bounding boxes is shown below. The video with
higher resolution is
`here <https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/2d_bbox_caption.mp4>`__.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/2d_bbox_caption_ll.gif

