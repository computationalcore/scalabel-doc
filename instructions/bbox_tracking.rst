
.. role:: red
.. role:: bold

Bounding Box Tracking
--------------------------------------------

1. Your Mission
~~~~~~~~~~~~~~~~
Your mission is to annotate bounding box tracks around the following
10 objects as well their attributes (e.g. occluded, truncated):

2. Label Categories
~~~~~~~~~~~~~~~~~~~

* Human: person, rider
* Vehicle: car, truck, bus, train, motorcycle, bike

2.1 Human
===========

2.1.1 Person
########################

A human that satisfies the following criterion. Assume the human
moved a distance of 1m and stopped again. If the human would
walk, the label is person, otherwise not. Examples are people
walking, standing or sitting on the ground, on a bench, on a
chair. This class also includes toddlers, someone pushing a
bicycle or standing next to it with both legs on the same side
of the bicycle. This class includes anything that is carried by
the person, e.g. backpack, but not items touching the ground,
e.g. trolleys.

.. figure:: ../media/images/instructions/bbox/person.png
    :width: 400px

2.1.2 Rider
########################

A human that would use some device to move a distance of 1m.
Includes, riders/drivers of bicycle, motorbike, scooter,
skateboards, horses, roller-blades, wheel-chairs, road cleaning
cars, cars without roof. Note that a visible driver of a car
with roof can only be seen through the window. Since holes are
not labeled, the human is included in the car label.

.. figure:: ../media/images/instructions/bbox/rider.png
    :width: 400px

2.2 Vehicle
===========

2.2.1 Car
########################

Car, jeep, SUV, small van with continuous body shape, caravan,
no other trailers.

.. figure:: ../media/images/instructions/bbox/car.png
    :width: 400px

2.2.2 Truck
########################

Truck, box truck, pickup truck. Including their trailers. Back
part / loading area is physically separated from driving
compartment.

.. figure:: ../media/images/instructions/bbox/truck.png
    :width: 400px

2.2.3 Bus
########################

Bus for 9+ persons, public transport or long distance
transport.

.. figure:: ../media/images/instructions/bbox/bus.png
    :width: 400px

2.2.4 Train
########################

.. figure:: ../media/images/instructions/bbox/train.png
    :width: 400px

2.2.5 Motorcycle
########################

Motorbike, moped, scooter without the driver (otherwise that's a rider,
see above)

.. figure:: ../media/images/instructions/bbox/motor.png
    :width: 400px

2.2.6 Bike
########################

Bicycle without the rider (otherwise that's a rider, see above)

.. figure:: ../media/images/instructions/bbox/bike.png
    :width: 400px


3. Label Attributes
~~~~~~~~~~~~~~~~~~~~

3.1 Occluded
============

An object annotated as "occluded" when one object is
hidden by another object. e.g. two persons walking
past each other, or a car that drives under a bridge or parks
behind another car.

Good example: annotate all visible parts of the object.

.. figure:: ../media/images/instructions/bbox/good_occluded_example.png
    :width: 600px

Bad example: missed some visible parts of the object.

.. figure:: ../media/images/instructions/bbox/bad_occluded_example.png
    :width: 600px


3.2 Truncated
=============

An object annotated as "truncated" indicates that the bounding
box specified for the object does not correspond to the full extent
of the object e.g. an image of a person from the waist up, or a
view of a car extending outside the image.

.. figure:: ../media/images/instructions/bbox/occluded_truncated_example.png
    :width: 600px


3.3 Traffic Light Color
=======================

For traffic lights, identify the color by selecting "G" (green),
"Y" (yellow), or "R" (red). If neither of the color applies, select
"NA".


4. Basic Operations
~~~~~~~~~~~~~~~~~~~~

4.1 The Interface
=================
Category and attributes loaded during project creation are shown in the left sidebar.
The number of labels in the current image is shown on the left of the title bar.

4.1.1 Moving across frames
##################################################

To move across different frames, drag the slider on the bottom or press the left/right arrow keys. You can also edit
the index of the frame and hit "Enter" to jump to a specific frame.

.. figure:: ../media/videos/box2d_tracking_slider.gif
    :width: 600px

4.1.2 Zoom in/out
##################################################
To zoom in/out, click the "+"/"-" buttons or the '+'/'-' keys.
 You can also zoom by scrolling while pressing the Ctrl key (Cmd for Mac users). You can
 drag the image around while pressing the Ctrl key (Cmd for Mac users).

.. figure:: ../media/videos/2d_zoom-drag.gif
    :width: 600px

4.1.3 Saving and submitting
##################################################
To save the results of the current task, click "Save".
Always save the task before refreshing or leaving the annotation interface. Once done labeling each image of the
whole task, click Submit to indicate that the whole task is finished.


4.2 Bounding Box Tracking Annotation
====================================

4.2.1 Create a bounding box
##################################################

Simply click and drag on the canvas to create a bounding box. On
the left sidebar, you can change the category and attributes of
a selected bounding box.

.. figure:: ../media/videos/box2d_change.gif
    :width: 600px

4.2.2 Select, delete, and edit a bounding box
##################################################

Click on a bounding box to select the label, and press delete to
delete it. Drag the control points on the bounding box to resize
it. Please annotate the bounding box around the object as tight
as possible and only annotate visible part of the object.

.. figure:: ../media/videos/box2d_select-delete.gif
    :width: 600px

4.2.3 Bounding box interpolation
##################################################

Create a bounding box at the first frame it appears, and adjust the bounding boxes in the subsequent frames. For a
given bounding box track, the frames in which the box is edited are considered a keyframe. The frames between keyframes
are automatically interpolated.

.. figure:: ../media/videos/box2d_tracking_keyframe.gif
    :width: 600px


4.2.4 Ending Object Track
##################################################

For an object that disappears after certain frame, click “End Object Track” or press Ctrl-E (Cmd-E for Mac users) at
the frame of its last occurrence. The bounding box labels after this frame will be deleted.

.. figure:: ../media/videos/box2d_tracking_end-track.gif
    :width: 600px


4.2.5 Track linking
##################################################

Sometimes an object reappears in the frame due to occlusion or re-entrance, and track linking enables individual tracks
to be linked as a single instance. Select a label, click “Track-Link” or press Ctrl-L (Cmd-L for Mac users), and click
on any other tracks that you want to link with this label. The tracks you choose to link appears in dashed lines. Click
“Finish Track-Link” or hit Enter to finish this operation.

.. figure:: ../media/videos/box2d_tracking_track-link.gif
    :width: 600px


5. Notice
~~~~~~~~~

* :red:`Always start labeling a bounding box in the FIRST frame of its occurrence. Otherwise you might need to start over.`


* Objects that are smaller than 7 * 7 pixel can be ignored. The bounding box smaller than 7 * 7 will turn grey and disappear when you finish.


* The remove operation is irreversible.
* Toggle the keyboard usage window by pressing '?'. Being familiar with the keyboard shortcuts can help you label much more efficiently.
* Zoom in with your browser to draw the bounding boxes more accurately. You can zoom in by pressing the '+'/'-' keys or scroll while pressing Ctrl (Cmd for Mac users). When zoomed in, you can drag the image around when pressing Ctrl (Cmd for Mac users).
* Hit Ctrl-H (Cmd-H for Mac users) to hide category label tags on the bounding boxes, and to show them after hitting Ctrl-H (Cmd-H for Mac users) again. Press the up/down arrow keys to bring a selected label forward/backward, and press the 'f'/'b' buttons to bring a selected label to front/back.
* If you refresh the page before saving, all previous history will not be saved.
* Report bugs and send questions to :bold:`bdd-label-help@googlegroups.com`.
