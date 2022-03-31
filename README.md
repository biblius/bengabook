# &#129305; Bengabook

## Social media deluxe

To access Bengabook, one must first register then login with those credentials to establish a session. Every page other than login and register requires an active session. The home page will only display posts (haps) from befriended users so it's recommended to make multiple accounts and befriend them, then post a few haps to display them on the home page. 

To find all users other than the active one simply click on search with the input field empty. The option to befriend them will be there if the request isn't already sent or if the user isn't already befriended. The option to view their profile, where you can see all the user's friends, pending requests, images and haps, will also be there.

The profile button in the header redirects to the active user's profile where they can change their profile picture, edit their about, befriend users from whom they received requests, upload images and post haps.

Haps can be posted with or without an image. They can be labamba'd, which stores them to the active users labamba'd posts, and they can be commented on.

#### To do:

* Add ccms functionality
* Make the befriends and post labambas update without having to reload the page
* Add css and js for the individual post page
* Add clarity for the picture uploads in both images and haps (right now it doesn't display the selected file)
* Make haps without image not look so ugly
* Probably something I can't think of right now

###### Note

For the app to work you must install and spin up a local [mongoDB server](https://www.mongodb.com/try/download/community). Follow the [instructions](https://docs.mongodb.com/manual/administration/install-community/) for your OS. If there is no instance of the mongo server running, the app won't be able to connect to it and it will throw an error. All the dependencies used are in package.json - simply do `npm install`.

