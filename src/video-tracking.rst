Video Tracking
--------------

The tool also supports video object tracking.

Firstly, you need to draw a bounding box around the object of interest 
at the starting frame.

Then, continue playing the video until the ending frame. Move the
bounding box to the ending position of the object and adjust the
bounding box size.

At this point, if you replay the video, the bounding box will track its
object and adjust its own size across different frames.

Here is a short demo to track a person in the video. Please check out
the video with higher resolution
`here <https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/video_tracking_caption.mp4>`__.

.. figure:: https://s3-us-west-2.amazonaws.com/scalabel-public/demo/videos/bbox2d_tracking_0.2.gif


