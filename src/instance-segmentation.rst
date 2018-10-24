Instance Segmentation
---------------------

The tool also supports "instance segmentation annotation". The interface
is similar to the interface of 2D bounding boxes.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/screenshots/seg2d_0.2.png

   To draw a mask of the instance, you need to draw multiple anchor
   points along the boundary of the instance and end at the initial
   point to complete the drawing.

A short demo of drawing instance segmentation is shown below. Please
check out the video with higher resolution
`here <https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/inst_seg_caption.mp4>`__.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/2d_seg_0.2.gif

To delete a polygon:

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/2d_delete_0.2.gif

You can also link two polygons together:

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/2d_linking_0.2.gif

Besides, you can enter the **quick draw** mode by clicking the
``Quickdraw`` on the bottom left or pressing ``s`` which allows the two
instances to share the common border. Check out the video demo with
higher resolution
`here <https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/quickdraw_demo.mp4>`__.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/quickdraw_demo_h.gif

Our tool also allows you to **bezier the curve** to improve the
annotation quality. Checkout the video demo
`here <https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/bezier_demo.mp4>`__.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/2d_bezier_0.2.gif

Lane Marking
~~~~~~~~~~~~

Lane marking is used in a similar way as the other image annotations,
but you will need to select a different label type when you are creating
your project. The operations are the same as those for instance
segmentation. In this case, you won’t see a whole chuck of color filled
in your selected area, since lane labeling is just outlining different
sections of a street.

Here is a short demo of lane marking below. Checkout the video with
higher resolution
`here <https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/lane_caption.mp4>`__.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/lane_marking_0.2.gif

Drivable Area
~~~~~~~~~~~~~

Similarly as other instance segmentation tasks, you can annotate the
drivable area in the image. Details about the drivable area can be found
in this `blog <http://bair.berkeley.edu/blog/2018/05/30/bdd/>`__.

