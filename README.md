This is the solution to the assignment given to me as part of the Package.ai interview process.

How to run the app:

option 1: download the app from the link using a n android device.

option 2: connect to this repo, download the code and do the following:
1. Run in terrminal "npm install" to install all the node modules needed for the app
2. Run in terminal "npm start" to start the expo server needed to activate the app
3. Download the app "expo Go" to your chosen phone device
4. Use the app to scan the QR code which appeared in the terminal after you ran "npm start"
5. The phone is now connected to the project.

My Approach to handling offline actions and retries:

I have created a reducer that manages the network requests in the app. Each request, on creation is sent to the reducer to be saved, 
to be prevent it disappearing if the phone exited or crashed. The requests are being divided between "small" and "Large" to ease 
the prioritization of small requests over large ones. the reeducer uses "redux-persist" to save the requests in local storage, so they will be available even when exiting and reentering the app.
When a request is added, all the requests that currently exist in the reducer are attempted to be sent out. First the smaller ones, then the larger ones. On each request succcess, it is removed from the reducer. 
On failure, the app uses the lib "Axios-retry" to retry sending the request 3 times. If those do not succeed, the request remains in the reducer.
The requests are attempted to be sent out when a new request is sent out, when there is a change in connectivity and when the app returns from the background.
The user has the option to remove or retry an unsent network request manually by swiping the request right ('retry') or left 'delete'. The user also has the ability to clear all the pending requests.


The app uses a small json object from small request and an image of a tiger for large requests.
