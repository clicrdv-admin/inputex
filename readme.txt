This is an experimental YUI3 development branch created base on the 20081127 snapshot of the trunk.

Status of YUI
  - YUI3 PR1 has been available for some time. The new 'base' class that provide attribute and event features will be
    the base class for general YUI applications.

  - YUI3 PR2 that will be released in mid Dec will provide a widget infrastructure. Quote from the YUI3 mail list:
    http://tech.groups.yahoo.com/group/yui3/message/242

    Widget Infrastructure

    PR2 will deliver the base Widget class for YUI3, which will be the foundation class for all YUI3 Widgets.

    The Widget class itself will extend Base, which was delivered with PR1, and will add a render phase to the
    init/destroy lifecycle phases which Base already delivers.

    Widgets will be Attribute driven, similar to other PR1 components such as Anim and DD which extend Base, so working
    your way through Attribute, Base and the existing components in PR1 which derive from Base will leave you in good
    shape to start working with Widget.

    A key part of our focus when developing widgets for YUI3 is to provide a lighter core widget class for any given
    widget, with additional functionality provided in the form of atomic Plugins or Extensions, which can be plugged
    into or augmented to the core widget to modify or add to it's core functionality.


inputEx YUI3 development branch
  - The informaion about the widget infrastructure indicate it will utilize the same attribute and event infrastructure
    from the base class of YUI3 PR1. The things that is missing will be the render events.

  - The early inputEx YUI3 develop will try make the Field.js compatiable to the YUI2 version. With the following
    difference:
        - attributes be managed in the YUI3 way
        - events be manged in the YUI3 way
        - use the YUI3 loader mechanism

    If possible, the following should make unchanged:
        - the rendering mechanism
          it's preferable to look at the YUI3 PR2 widget in order to save development efforts


