# FriendsManagement
-------------------------------------------------------
Get list of users:
GET: https://friend-manager.herokuapp.com/user
-------------------------------------------------------
Add new user:
POST: https://friend-manager.herokuapp.com/user
{
	"user": "user3@test.com"
}
-------------------------------------------------------
Add friend:
PUT: https://friend-manager.herokuapp.com/user
{
  "friends":
    [
      "user1@test.com",
      "user2@test.com"
    ]
}
-------------------------------------------------------
Get user's friends list:
POST: https://friend-manager.herokuapp.com/getfriends
{
  "email": "user1@test.com"
}
-------------------------------------------------------
Subscriber to a user:
PUT: https://friend-manager.herokuapp.com/subscribe
{
  "requestor": "user1@test.com",
  "target": "user2@test.com"
}
-------------------------------------------------------
Get common friends:
POST: https://friend-manager.herokuapp.com/commonfriends
{
  "friends":
    [
      "user1@test.com",
      "user2@test.com"
    ]
}
-------------------------------------------------------
Block a user:
PUT: https://friend-manager.herokuapp.com/block
{
  "requestor": "user1@test.com",
  "target": "user2@test.com"
}
-------------------------------------------------------
Get list of users who can receive updates:
POST: https://friend-manager.herokuapp.com/canreceive
{
  "sender":  "user2@test.com",
  "text": "Hello World! user1@test.com"
}
-------------------------------------------------------
