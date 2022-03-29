//updates database entries - pushes sender to receiver friend list and vice versa
//and updates the accepted value of the pending request to accepted
module.exports = function (sender, receiver, request) {
    sender.friends.push(receiver);
    sender.removeRequest(request);
    sender.save();
    receiver.friends.push(sender);
    receiver.removeRequest(request);
    receiver.save();
    request.accepted = true;
    request.save();
}

